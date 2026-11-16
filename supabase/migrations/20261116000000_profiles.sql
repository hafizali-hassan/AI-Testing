-- Profiles: one row per auth user, created automatically on sign-up.
create type public.user_role as enum ('customer', 'business', 'technician', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 80),
  email text not null,
  phone text check (phone ~ '^\+923\d{9}$'),
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile.
create policy "profiles: read own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- Users can update their own name and phone only (role is protected by the trigger below).
create policy "profiles: update own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- No insert/delete policies: rows are created by the trigger and removed by the FK cascade.

create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and current_user = 'authenticated' then
    raise exception 'role cannot be changed by the user';
  end if;
  if new.email is distinct from old.email and current_user = 'authenticated' then
    raise exception 'email is managed by auth';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_guard
  before update on public.profiles
  for each row execute function public.prevent_role_change();

-- Create a profile from the sign-up metadata. User metadata is client-supplied,
-- so values are validated here and 'admin' can never be self-assigned.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'role';
  requested_phone text := new.raw_user_meta_data ->> 'phone';
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1)),
    new.email,
    case when requested_phone ~ '^\+923\d{9}$' then requested_phone end,
    case
      when requested_role in ('customer', 'business', 'technician') then requested_role::public.user_role
      else 'customer'
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
