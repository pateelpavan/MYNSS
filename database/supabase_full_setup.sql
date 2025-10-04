-- NSS Volunteers System - Supabase Full Setup
-- Run this entire script in Supabase SQL editor (Project > SQL > New query)

-- =============================================
-- Extensions
-- =============================================
create extension if not exists "uuid-ossp";

-- =============================================
-- Tables
-- =============================================

-- users
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  full_name varchar(255) not null,
  roll_number varchar(50) unique not null,
  branch varchar(100) not null,
  password varchar(255) not null,
  profile_photo text,
  qr_code varchar(255) unique not null,
  is_approved boolean default false,
  is_rejected boolean default false,
  approved_by varchar(255),
  approved_at timestamptz,
  rejected_by varchar(255),
  rejected_at timestamptz,
  rejection_reason text,
  join_date date not null,
  end_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- achievements
create table if not exists public.achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  title varchar(255) not null,
  description text,
  level varchar(20) not null check (level in ('national','district','state')),
  achievement_date date not null,
  photo_url text,
  is_verified boolean default false,
  verified_by varchar(255),
  verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- certificates
create table if not exists public.certificates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  title varchar(255) not null,
  description text,
  file_url text not null,
  upload_date date not null,
  is_verified boolean default false,
  verified_by varchar(255),
  verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- events
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title varchar(255) not null,
  description text,
  event_date date not null,
  start_date date not null,
  end_date date not null,
  created_by varchar(255) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- event_registrations
create table if not exists public.event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  user_roll_number varchar(50) not null,
  user_name varchar(255) not null,
  is_approved boolean default false,
  approved_by varchar(255),
  approved_at timestamptz,
  attendance_status varchar(50),
  attendance_date timestamptz,
  registered_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(event_id, user_id)
);

-- event_photos
create table if not exists public.event_photos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  photo_url text not null,
  title varchar(255),
  description text,
  upload_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- suggestions
create table if not exists public.suggestions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  user_name varchar(255) not null,
  user_roll_number varchar(50) not null,
  title varchar(255) not null,
  description text not null,
  category varchar(20) not null check (category in ('general','event','system','achievement')),
  status varchar(20) default 'pending' check (status in ('pending','reviewed','implemented','rejected')),
  reviewed_by varchar(255),
  reviewed_at timestamptz,
  response text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- admin_users
create table if not exists public.admin_users (
  id uuid primary key default uuid_generate_v4(),
  username varchar(100) unique not null,
  email varchar(255) unique not null,
  password varchar(255) not null,
  full_name varchar(255) not null,
  role varchar(50) not null,
  is_active boolean default true,
  last_login timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- Indexes
-- =============================================
create index if not exists idx_users_roll_number on public.users(roll_number);
create index if not exists idx_users_qr_code on public.users(qr_code);
create index if not exists idx_users_approved on public.users(is_approved);
create index if not exists idx_achievements_user_id on public.achievements(user_id);
create index if not exists idx_achievements_level on public.achievements(level);
create index if not exists idx_certificates_user_id on public.certificates(user_id);
create index if not exists idx_events_date on public.events(event_date);
create index if not exists idx_event_registrations_event_id on public.event_registrations(event_id);
create index if not exists idx_event_registrations_user_id on public.event_registrations(user_id);
create index if not exists idx_event_photos_user_id on public.event_photos(user_id);
create index if not exists idx_event_photos_event_id on public.event_photos(event_id);
create index if not exists idx_suggestions_user_id on public.suggestions(user_id);
create index if not exists idx_suggestions_status on public.suggestions(status);
create index if not exists idx_admin_users_username on public.admin_users(username);
create index if not exists idx_admin_users_email on public.admin_users(email);

-- Optional composite indexes
create index if not exists idx_users_approval_status on public.users(is_approved, is_rejected, created_at);
create index if not exists idx_achievements_user_level on public.achievements(user_id, level, achievement_date);
create index if not exists idx_event_registrations_status on public.event_registrations(event_id, is_approved, attendance_status);
create index if not exists idx_suggestions_status_category on public.suggestions(status, category, created_at);

-- =============================================
-- updated_at trigger
-- =============================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_users_updated_at on public.users;
create trigger update_users_updated_at before update on public.users
for each row execute function public.update_updated_at_column();

drop trigger if exists update_achievements_updated_at on public.achievements;
create trigger update_achievements_updated_at before update on public.achievements
for each row execute function public.update_updated_at_column();

drop trigger if exists update_certificates_updated_at on public.certificates;
create trigger update_certificates_updated_at before update on public.certificates
for each row execute function public.update_updated_at_column();

drop trigger if exists update_events_updated_at on public.events;
create trigger update_events_updated_at before update on public.events
for each row execute function public.update_updated_at_column();

drop trigger if exists update_event_registrations_updated_at on public.event_registrations;
create trigger update_event_registrations_updated_at before update on public.event_registrations
for each row execute function public.update_updated_at_column();

drop trigger if exists update_event_photos_updated_at on public.event_photos;
create trigger update_event_photos_updated_at before update on public.event_photos
for each row execute function public.update_updated_at_column();

drop trigger if exists update_suggestions_updated_at on public.suggestions;
create trigger update_suggestions_updated_at before update on public.suggestions
for each row execute function public.update_updated_at_column();

drop trigger if exists update_admin_users_updated_at on public.admin_users;
create trigger update_admin_users_updated_at before update on public.admin_users
for each row execute function public.update_updated_at_column();

-- =============================================
-- Row Level Security (RLS)
-- NOTE: Policies below are permissive. Tighten for production.
-- =============================================
alter table public.users enable row level security;
alter table public.achievements enable row level security;
alter table public.certificates enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.event_photos enable row level security;
alter table public.suggestions enable row level security;
alter table public.admin_users enable row level security;

-- Users
drop policy if exists "users_select_all" on public.users;
create policy "users_select_all" on public.users
  for select using (true);
drop policy if exists "users_insert_all" on public.users;
create policy "users_insert_all" on public.users
  for insert with check (true);
drop policy if exists "users_update_all" on public.users;
create policy "users_update_all" on public.users
  for update using (true);

-- Achievements
drop policy if exists "achievements_select_all" on public.achievements;
create policy "achievements_select_all" on public.achievements
  for select using (true);
drop policy if exists "achievements_insert_all" on public.achievements;
create policy "achievements_insert_all" on public.achievements
  for insert with check (true);
drop policy if exists "achievements_update_all" on public.achievements;
create policy "achievements_update_all" on public.achievements
  for update using (true);

-- Certificates
drop policy if exists "certificates_select_all" on public.certificates;
create policy "certificates_select_all" on public.certificates
  for select using (true);
drop policy if exists "certificates_insert_all" on public.certificates;
create policy "certificates_insert_all" on public.certificates
  for insert with check (true);
drop policy if exists "certificates_update_all" on public.certificates;
create policy "certificates_update_all" on public.certificates
  for update using (true);

-- Events
drop policy if exists "events_select_all" on public.events;
create policy "events_select_all" on public.events
  for select using (true);
drop policy if exists "events_insert_all" on public.events;
create policy "events_insert_all" on public.events
  for insert with check (true);
drop policy if exists "events_update_all" on public.events;
create policy "events_update_all" on public.events
  for update using (true);

-- Event registrations
drop policy if exists "event_registrations_select_all" on public.event_registrations;
create policy "event_registrations_select_all" on public.event_registrations
  for select using (true);
drop policy if exists "event_registrations_insert_all" on public.event_registrations;
create policy "event_registrations_insert_all" on public.event_registrations
  for insert with check (true);
drop policy if exists "event_registrations_update_all" on public.event_registrations;
create policy "event_registrations_update_all" on public.event_registrations
  for update using (true);

-- Event photos
drop policy if exists "event_photos_select_all" on public.event_photos;
create policy "event_photos_select_all" on public.event_photos
  for select using (true);
drop policy if exists "event_photos_insert_all" on public.event_photos;
create policy "event_photos_insert_all" on public.event_photos
  for insert with check (true);
drop policy if exists "event_photos_update_all" on public.event_photos;
create policy "event_photos_update_all" on public.event_photos
  for update using (true);

-- Suggestions
drop policy if exists "suggestions_select_all" on public.suggestions;
create policy "suggestions_select_all" on public.suggestions
  for select using (true);
drop policy if exists "suggestions_insert_all" on public.suggestions;
create policy "suggestions_insert_all" on public.suggestions
  for insert with check (true);
drop policy if exists "suggestions_update_all" on public.suggestions;
create policy "suggestions_update_all" on public.suggestions
  for update using (true);

-- Admin users (KEEP RESTRICTIVE IN PROD)
drop policy if exists "admin_users_select_all" on public.admin_users;
create policy "admin_users_select_all" on public.admin_users
  for select using (true);
drop policy if exists "admin_users_insert_all" on public.admin_users;
create policy "admin_users_insert_all" on public.admin_users
  for insert with check (true);
drop policy if exists "admin_users_update_all" on public.admin_users;
create policy "admin_users_update_all" on public.admin_users
  for update using (true);

-- =============================================
-- Seed Data (Optional) - remove if you don't want sample rows
-- =============================================
insert into public.admin_users (username, email, password, full_name, role) values
('admin', 'admin@nss.com', '$2b$10$rQZ8K9L2vN3mP4qR5sT6uO7wX8yZ9A0bC1dE2fG3hI4jK5lM6nO7pQ8rS9tU', 'System Administrator', 'super_admin')
on conflict do nothing;

insert into public.users (full_name, roll_number, branch, password, qr_code, join_date, is_approved) values
('John Doe', '21CS001', 'Computer Science', '$2b$10$rQZ8K9L2vN3mP4qR5sT6uO7wX8yZ9A0bC1dE2fG3hI4jK5lM6nO7pQ8rS9tU', 'QR001', '2024-01-01', true),
('Jane Smith', '21IT002', 'Information Technology', '$2b$10$rQZ8K9L2vN3mP4qR5sT6uO7wX8yZ9A0bC1dE2fG3hI4jK5lM6nO7pQ8rS9tU', 'QR002', '2024-01-02', true),
('Bob Johnson', '21EC003', 'Electronics', '$2b$10$rQZ8K9L2vN3mP4qR5sT6uO7wX8yZ9A0bC1dE2fG3hI4jK5lM6nO7pQ8rS9tU', 'QR003', '2024-01-03', false)
on conflict do nothing;

insert into public.events (title, description, event_date, start_date, end_date, created_by) values
('Blood Donation Camp', 'Annual blood donation camp for the community', '2024-02-15', '2024-02-15', '2024-02-15', 'admin'),
('Tree Plantation Drive', 'Planting trees for environmental conservation', '2024-03-20', '2024-03-20', '2024-03-20', 'admin'),
('Cleanliness Drive', 'Cleaning the campus and surrounding areas', '2024-04-10', '2024-04-10', '2024-04-10', 'admin')
on conflict do nothing;

insert into public.achievements (user_id, title, description, level, achievement_date, is_verified) values
((select id from public.users where roll_number = '21CS001'), 'Best Volunteer Award', 'Outstanding community service', 'state', '2024-01-15', true),
((select id from public.users where roll_number = '21IT002'), 'Leadership Excellence', 'Recognized for leadership in NSS activities', 'district', '2024-01-20', true)
on conflict do nothing;

insert into public.suggestions (user_id, user_name, user_roll_number, title, description, category) values
((select id from public.users where roll_number = '21CS001'), 'John Doe', '21CS001', 'Digital Registration System', 'Implement an online registration system for events', 'system'),
((select id from public.users where roll_number = '21IT002'), 'Jane Smith', '21IT002', 'Mobile App Development', 'Create a mobile app for better accessibility', 'general')
on conflict do nothing;

-- =============================================
-- End
-- =============================================

