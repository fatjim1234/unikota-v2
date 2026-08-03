-- ============================================================
-- Phase 2A foundation schema — Unikota platform
-- Migration 0001: extensions, enums, tables, indexes
-- Foundation subset ONLY (no OEM/commerce tables yet).
-- auth.users is canonical for authentication; public.profiles is 1:1 app data.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Enums ----------
create type public.staff_role as enum (
  'sales_employee',
  'content_editor',
  'administrator',
  'super_administrator'
);

create type public.lead_status as enum ('new', 'in_progress', 'closed', 'spam');

-- ---------- profiles (1:1 with auth.users; auto-created by trigger) ----------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  display_name text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- staff_roles (multi-role; "public visitor" = no row) ----------
create table public.staff_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  role       public.staff_role not null,
  granted_by uuid references public.profiles (id),
  granted_at timestamptz not null default now(),
  unique (user_id, role)
);
create index staff_roles_user_idx on public.staff_roles (user_id);

-- ---------- content_entries (admin-editable public site copy) ----------
-- RULE: content is world-readable by design. Never store credentials,
-- internal notes or personal data in any content key.
create table public.content_entries (
  key        text primary key,
  value      jsonb not null,
  version    integer not null default 1,
  updated_by uuid references public.profiles (id),
  updated_at timestamptz not null default now()
);

-- ---------- content_revisions (append-only history) ----------
create table public.content_revisions (
  id         uuid primary key default gen_random_uuid(),
  entry_key  text not null references public.content_entries (key) on delete cascade,
  value      jsonb not null,
  version    integer not null,
  edited_by  uuid references public.profiles (id),
  created_at timestamptz not null default now()
);
create index content_revisions_key_idx on public.content_revisions (entry_key, version desc);

-- ---------- leads (canonical parent record for all enquiries) ----------
-- Future export_enquiries / sample_requests / retail_support_requests /
-- whatsapp_leads reference leads(id) rather than duplicating contact data.
create table public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  name         text not null check (char_length(name) between 1 and 200),
  email        text not null check (char_length(email) between 3 and 320),
  company      text check (company is null or char_length(company) <= 300),
  enquiry_type text not null check (char_length(enquiry_type) <= 50),
  message      text not null check (char_length(message) between 1 and 5000),
  source_page  text check (source_page is null or char_length(source_page) <= 500),
  consent      boolean not null,
  consent_text text,
  status       public.lead_status not null default 'new',
  assigned_to  uuid references public.profiles (id)
);
create index leads_status_idx on public.leads (status, created_at desc);
create index leads_assigned_idx on public.leads (assigned_to);

-- ---------- lead_notes (append-only) ----------
create table public.lead_notes (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads (id) on delete cascade,
  author_id  uuid not null references public.profiles (id),
  body       text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index lead_notes_lead_idx on public.lead_notes (lead_id, created_at);

-- ---------- audit_logs (append-only; written only by SECURITY DEFINER triggers) ----------
create table public.audit_logs (
  id           uuid primary key default gen_random_uuid(),
  actor_id     uuid,
  actor_roles  text[],
  action       text not null,
  entity_table text not null,
  entity_id    text,
  before       jsonb,
  after        jsonb,
  created_at   timestamptz not null default now()
);
create index audit_logs_entity_idx on public.audit_logs (entity_table, entity_id, created_at desc);
