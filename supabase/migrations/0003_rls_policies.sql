-- ============================================================
-- Migration 0003: Row Level Security — enabled explicitly on
-- EVERY public-schema table; policies are the final authority.
-- No policy = denied. See docs/RLS_POLICIES.md for the rationale
-- behind each policy.
-- ============================================================

alter table public.profiles          enable row level security;
alter table public.staff_roles       enable row level security;
alter table public.content_entries   enable row level security;
alter table public.content_revisions enable row level security;
alter table public.leads             enable row level security;
alter table public.lead_notes        enable row level security;
alter table public.audit_logs        enable row level security;

-- ============ profiles ============
create policy "profiles_select_own_or_staff"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_staff());

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
-- (column restriction to display_name enforced by profiles_guard trigger)
-- No INSERT policy (trigger-managed) and no DELETE policy (cascade from auth.users).

-- ============ staff_roles ============
create policy "staff_roles_select_own_or_admin"
  on public.staff_roles for select to authenticated
  using (
    user_id = auth.uid()
    or public.has_any_role(array['administrator','super_administrator']::public.staff_role[])
  );

-- Administrators may grant ONLY ordinary staff roles. The WITH CHECK on the
-- role value makes "admins cannot grant administrator/super_administrator —
-- not even to themselves" a database-level guarantee.
create policy "staff_roles_insert_admin_basic"
  on public.staff_roles for insert to authenticated
  with check (
    public.has_any_role(array['administrator']::public.staff_role[])
    and role in ('sales_employee','content_editor')
    and granted_by = auth.uid()
  );

create policy "staff_roles_insert_super_any"
  on public.staff_roles for insert to authenticated
  with check (
    public.has_any_role(array['super_administrator']::public.staff_role[])
    and granted_by = auth.uid()
  );

create policy "staff_roles_delete_admin_basic"
  on public.staff_roles for delete to authenticated
  using (
    public.has_any_role(array['administrator']::public.staff_role[])
    and role in ('sales_employee','content_editor')
  );

create policy "staff_roles_delete_super_any"
  on public.staff_roles for delete to authenticated
  using (public.has_any_role(array['super_administrator']::public.staff_role[]));
-- (last-super-administrator lockout enforced by trigger)
-- No UPDATE policy: roles are granted/revoked, never edited (clean audit trail).

-- ============ content_entries ============
-- Public marketing copy: world-readable BY DESIGN.
create policy "content_select_public"
  on public.content_entries for select to anon, authenticated
  using (true);

create policy "content_insert_editors"
  on public.content_entries for insert to authenticated
  with check (public.has_any_role(array['content_editor','administrator','super_administrator']::public.staff_role[]));

create policy "content_update_editors"
  on public.content_entries for update to authenticated
  using (public.has_any_role(array['content_editor','administrator','super_administrator']::public.staff_role[]))
  with check (public.has_any_role(array['content_editor','administrator','super_administrator']::public.staff_role[]));
-- No DELETE policy: content keys are never deleted through the app.

-- ============ content_revisions ============
create policy "content_revisions_select_editors"
  on public.content_revisions for select to authenticated
  using (public.has_any_role(array['content_editor','administrator','super_administrator']::public.staff_role[]));
-- No INSERT policy for users: rows are written by the SECURITY DEFINER trigger.
-- No UPDATE/DELETE for anyone: append-only.

-- ============ leads ============
-- Anonymous INSERT is the database backstop behind /api/lead.
-- WITH CHECK pins safe values; no SELECT policy for anon means the insert
-- cannot RETURN the row and submitted leads can never be read publicly.
create policy "leads_insert_public"
  on public.leads for insert to anon, authenticated
  with check (
    status = 'new'
    and assigned_to is null
    and consent = true
  );

create policy "leads_select_staff"
  on public.leads for select to authenticated
  using (public.has_any_role(array['sales_employee','administrator','super_administrator']::public.staff_role[]));

-- Sales approved assignment policy (decision A, 2026-07-13):
--   USING  (unassigned OR assigned to me)  → cannot touch someone else's lead
--   WITH CHECK (assigned to me)            → claim = NULL→self only; cannot
--                                            unassign, reassign, or hand off.
--   Combined with the immutable-columns trigger, sales can only:
--   claim an unassigned lead for themselves, and update status on their own.
create policy "leads_update_sales"
  on public.leads for update to authenticated
  using (
    public.has_any_role(array['sales_employee']::public.staff_role[])
    and (assigned_to is null or assigned_to = auth.uid())
  )
  with check (
    public.has_any_role(array['sales_employee']::public.staff_role[])
    and assigned_to = auth.uid()
  );

create policy "leads_update_admin"
  on public.leads for update to authenticated
  using (public.has_any_role(array['administrator','super_administrator']::public.staff_role[]))
  with check (public.has_any_role(array['administrator','super_administrator']::public.staff_role[]));
-- No DELETE policy: leads are closed or marked spam, never deleted (audit trail).

-- ============ lead_notes ============
create policy "lead_notes_select_staff"
  on public.lead_notes for select to authenticated
  using (public.has_any_role(array['sales_employee','administrator','super_administrator']::public.staff_role[]));

-- Sales may note only leads assigned to themselves; admin/super any lead.
create policy "lead_notes_insert_sales_own"
  on public.lead_notes for insert to authenticated
  with check (
    author_id = auth.uid()
    and (
      public.has_any_role(array['administrator','super_administrator']::public.staff_role[])
      or (
        public.has_any_role(array['sales_employee']::public.staff_role[])
        and exists (
          select 1 from public.leads l
          where l.id = lead_id and l.assigned_to = auth.uid()
        )
      )
    )
  );
-- No UPDATE/DELETE: append-only.

-- ============ audit_logs ============
create policy "audit_logs_select_admin"
  on public.audit_logs for select to authenticated
  using (public.has_any_role(array['administrator','super_administrator']::public.staff_role[]));
-- No INSERT policy for users: written only by SECURITY DEFINER trigger functions
-- (which run as the table owner and are not subject to these policies).
-- No UPDATE/DELETE for anyone: append-only.
