-- ============================================================
-- Migration 0002: helper functions + triggers
-- Every SECURITY DEFINER function: hardened search_path,
-- schema-qualified references, explicit EXECUTE revokes.
-- ============================================================

-- ---------- Role helpers (used inside RLS policies) ----------
-- SECURITY DEFINER so policy evaluation does not recurse into staff_roles RLS.
-- Granted to anon+authenticated: returns false/empty for anonymous users and
-- leaks nothing beyond the caller's own role membership.

create or replace function public.has_any_role(p_roles public.staff_role[])
returns boolean
language sql stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.staff_roles sr
    where sr.user_id = auth.uid() and sr.role = any (p_roles)
  );
$$;
revoke execute on function public.has_any_role(public.staff_role[]) from public;
grant execute on function public.has_any_role(public.staff_role[]) to anon, authenticated;

create or replace function public.is_staff()
returns boolean
language sql stable
security definer
set search_path = public, pg_temp
as $$
  select exists (select 1 from public.staff_roles sr where sr.user_id = auth.uid());
$$;
revoke execute on function public.is_staff() from public;
grant execute on function public.is_staff() to anon, authenticated;

-- ---------- Audit writer (internal; called only from triggers below) ----------
create or replace function public.write_audit(
  p_action text, p_table text, p_entity_id text, p_before jsonb, p_after jsonb
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.audit_logs (actor_id, actor_roles, action, entity_table, entity_id, before, after)
  values (
    auth.uid(),
    (select coalesce(array_agg(sr.role::text), '{}') from public.staff_roles sr where sr.user_id = auth.uid()),
    p_action, p_table, p_entity_id, p_before, p_after
  );
end;
$$;
revoke execute on function public.write_audit(text, text, text, jsonb, jsonb) from public, anon, authenticated;

-- ---------- Profile auto-creation on signup ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, coalesce(new.email, ''), split_part(coalesce(new.email, ''), '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- updated_at maintenance ----------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();

-- ---------- profiles: immutable columns guard ----------
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.id is distinct from old.id or new.email is distinct from old.email
     or new.created_at is distinct from old.created_at then
    raise exception 'profiles: only display_name may be changed';
  end if;
  return new;
end;
$$;
revoke execute on function public.guard_profile_update() from public, anon, authenticated;

create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ---------- content: version bump, revision capture, audit ----------
create or replace function public.content_before_update()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.key is distinct from old.key then
    raise exception 'content_entries: key is immutable';
  end if;
  new.version := old.version + 1;
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;
revoke execute on function public.content_before_update() from public, anon, authenticated;

create trigger content_before_update before update on public.content_entries
  for each row execute function public.content_before_update();

create or replace function public.content_after_write()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.content_revisions (entry_key, value, version, edited_by)
  values (new.key, new.value, new.version, coalesce(new.updated_by, auth.uid()));
  perform public.write_audit(
    case when tg_op = 'INSERT' then 'content.created' else 'content.updated' end,
    'content_entries', new.key,
    case when tg_op = 'UPDATE' then to_jsonb(old.value) else null end,
    to_jsonb(new.value)
  );
  return new;
end;
$$;
revoke execute on function public.content_after_write() from public, anon, authenticated;

create trigger content_after_write after insert or update on public.content_entries
  for each row execute function public.content_after_write();

-- ---------- leads: immutable submission columns; only status/assigned_to change ----------
create or replace function public.guard_lead_update()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.name         is distinct from old.name
  or new.email        is distinct from old.email
  or new.company      is distinct from old.company
  or new.enquiry_type is distinct from old.enquiry_type
  or new.message      is distinct from old.message
  or new.source_page  is distinct from old.source_page
  or new.consent      is distinct from old.consent
  or new.consent_text is distinct from old.consent_text
  or new.created_at   is distinct from old.created_at
  or new.id           is distinct from old.id then
    raise exception 'leads: submission fields are immutable; only status and assigned_to may change';
  end if;
  return new;
end;
$$;
revoke execute on function public.guard_lead_update() from public, anon, authenticated;

create trigger leads_guard before update on public.leads
  for each row execute function public.guard_lead_update();

create or replace function public.lead_after_update()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.status is distinct from old.status or new.assigned_to is distinct from old.assigned_to then
    perform public.write_audit(
      'lead.updated', 'leads', new.id::text,
      jsonb_build_object('status', old.status, 'assigned_to', old.assigned_to),
      jsonb_build_object('status', new.status, 'assigned_to', new.assigned_to)
    );
  end if;
  return new;
end;
$$;
revoke execute on function public.lead_after_update() from public, anon, authenticated;

create trigger lead_after_update after update on public.leads
  for each row execute function public.lead_after_update();

-- ---------- staff_roles: audit + last-super-admin lockout guard ----------
create or replace function public.staff_role_after_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    perform public.write_audit('role.granted', 'staff_roles', new.id::text, null,
      jsonb_build_object('user_id', new.user_id, 'role', new.role, 'granted_by', new.granted_by));
    return new;
  else
    perform public.write_audit('role.revoked', 'staff_roles', old.id::text,
      jsonb_build_object('user_id', old.user_id, 'role', old.role), null);
    return old;
  end if;
end;
$$;
revoke execute on function public.staff_role_after_change() from public, anon, authenticated;

create trigger staff_roles_audit after insert or delete on public.staff_roles
  for each row execute function public.staff_role_after_change();

create or replace function public.guard_last_super_admin()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.role = 'super_administrator' and
     (select count(*) from public.staff_roles where role = 'super_administrator') <= 1 then
    raise exception 'cannot remove the last super_administrator (lockout protection)';
  end if;
  return old;
end;
$$;
revoke execute on function public.guard_last_super_admin() from public, anon, authenticated;

create trigger staff_roles_last_super_guard before delete on public.staff_roles
  for each row execute function public.guard_last_super_admin();

-- ---------- First super-administrator bootstrap ----------
-- Callable ONLY from the Supabase Dashboard SQL editor (or secret-key server
-- context): EXECUTE is revoked from anon and authenticated. Self-disabling:
-- refuses to run once any super_administrator exists. Optional hardening after
-- use: drop function public.bootstrap_first_super_admin(text);
create or replace function public.bootstrap_first_super_admin(p_email text)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
begin
  if exists (select 1 from public.staff_roles where role = 'super_administrator') then
    raise exception 'bootstrap disabled: a super_administrator already exists';
  end if;

  select u.id into v_user_id from auth.users u where lower(u.email) = lower(p_email);
  if v_user_id is null then
    raise exception 'no auth user with email %; create the user in Dashboard > Authentication first', p_email;
  end if;

  insert into public.profiles (id, email, display_name)
  values (v_user_id, p_email, split_part(p_email, '@', 1))
  on conflict (id) do nothing;

  insert into public.staff_roles (user_id, role, granted_by)
  values (v_user_id, 'super_administrator', null);

  return 'super_administrator granted to ' || p_email;
end;
$$;
revoke execute on function public.bootstrap_first_super_admin(text) from public, anon, authenticated;
