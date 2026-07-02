-- Add media_assets table
create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('image', 'video', 'document')),
  url text,
  youtube_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for media_assets
alter table media_assets enable row level security;

create policy "public read media_assets" on media_assets
  for select using (true);

create policy "admin write media_assets" on media_assets
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Add missing columns to tutorials
alter table tutorials 
  add column if not exists description text,
  add column if not exists difficulty text,
  add column if not exists duration_text text,
  add column if not exists rating numeric(3,1),
  add column if not exists topics jsonb;

-- Add missing columns to courses
alter table courses 
  add column if not exists difficulty text,
  add column if not exists duration_text text,
  add column if not exists rating numeric(3,1),
  add column if not exists topics jsonb;

-- Grant permissions for media_assets
grant all on table media_assets to anon, authenticated, service_role;
