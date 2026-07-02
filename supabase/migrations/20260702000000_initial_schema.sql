-- ============================================================
-- Subjects: top-level groupings (algebra, calculus, trigonometry, discrete)
-- ============================================================
create table if not exists subjects (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,        -- 'calculus'
  name          text not null,               -- 'Calculus'
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- Notes: replaces public/content/notes/**/*.md
-- ============================================================
create table if not exists notes (
  id            uuid primary key default gen_random_uuid(),
  subject_id    uuid not null references subjects(id) on delete cascade,
  slug          text not null,               -- 'angular-measure'
  title         text not null,
  content_md    text not null,               -- raw markdown body
  sort_order    int not null default 0,
  published     boolean not null default true,
  search_vector tsvector generated always as (
                  setweight(to_tsvector('english', coalesce(title,'')), 'A') ||
                  setweight(to_tsvector('english', coalesce(content_md,'')), 'B')
                ) stored,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (subject_id, slug)
);
create index if not exists notes_search_idx on notes using gin (search_vector);
create index if not exists notes_subject_sort_idx on notes (subject_id, sort_order);

-- ============================================================
-- Tutorials: replaces public/content/tutorials/**/*.md
-- ============================================================
create table if not exists tutorials (
  id            uuid primary key default gen_random_uuid(),
  subject_id    uuid not null references subjects(id) on delete cascade,
  note_id       uuid references notes(id) on delete set null,
  slug          text not null,
  title         text not null,
  content_md    text not null,
  sort_order    int not null default 0,
  published     boolean not null default true,
  search_vector tsvector generated always as (
                  setweight(to_tsvector('english', coalesce(title,'')), 'A') ||
                  setweight(to_tsvector('english', coalesce(content_md,'')), 'B')
                ) stored,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (subject_id, slug)
);
create index if not exists tutorials_search_idx on tutorials using gin (search_vector);
create index if not exists tutorials_subject_sort_idx on tutorials (subject_id, sort_order);

-- ============================================================
-- Quizzes: replaces public/quizzes/*.json
-- ============================================================
create table if not exists quizzes (
  id            uuid primary key default gen_random_uuid(),
  tutorial_id   uuid references tutorials(id) on delete cascade,
  title         text not null,
  description   text,
  created_at    timestamptz not null default now()
);

create table if not exists quiz_questions (
  id            uuid primary key default gen_random_uuid(),
  quiz_id       uuid not null references quizzes(id) on delete cascade,
  question      text not null,
  options       jsonb not null,   -- ["$e^x$", "$\ln(x)$", ...]
  correct_index int not null,
  explanation   text,
  sort_order    int not null default 0
);
create index if not exists quiz_questions_quiz_idx on quiz_questions (quiz_id, sort_order);

-- ============================================================
-- Courses: real backing for the currently-hardcoded Courses.tsx
-- ============================================================
create table if not exists courses (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,          -- 'advanced-calculus'
  title           text not null,
  description     text,
  level           text check (level in ('Beginner','Intermediate','Advanced')),
  duration_weeks  int,
  cover_image     text,                           -- Supabase Storage URL or local path
  published       boolean not null default false,
  created_at      timestamptz not null default now()
);

-- Ordered modules within a course, each pointing at existing notes/tutorials
create table if not exists course_modules (
  id            uuid primary key default gen_random_uuid(),
  course_id     uuid not null references courses(id) on delete cascade,
  note_id       uuid references notes(id) on delete set null,
  tutorial_id   uuid references tutorials(id) on delete set null,
  title         text not null,
  sort_order    int not null default 0
);

-- ============================================================
-- User profiles & roles (backs real Auth.tsx + admin content tools)
-- Supabase auto-creates auth.users; this extends it.
-- ============================================================
do $$ begin
  create type user_role as enum ('student', 'admin');
exception when duplicate_object then null;
end $$;

create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  role          user_role not null default 'student',
  created_at    timestamptz not null default now()
);

-- Track completed lessons per user, for course progress
create table if not exists course_progress (
  user_id           uuid not null references auth.users(id) on delete cascade,
  course_module_id  uuid not null references course_modules(id) on delete cascade,
  completed_at      timestamptz not null default now(),
  primary key (user_id, course_module_id)
);

-- ============================================================
-- Auto-create profile row when a new user signs up
-- ============================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table notes enable row level security;
alter table tutorials enable row level security;
alter table courses enable row level security;
alter table course_modules enable row level security;
alter table quizzes enable row level security;
alter table quiz_questions enable row level security;
alter table profiles enable row level security;
alter table course_progress enable row level security;

-- Public read for published content
create policy "public read published notes" on notes
  for select using (published = true);

create policy "public read published tutorials" on tutorials
  for select using (published = true);

create policy "public read published courses" on courses
  for select using (published = true);

create policy "public read course_modules" on course_modules
  for select using (true);

create policy "public read quizzes" on quizzes
  for select using (true);

create policy "public read quiz_questions" on quiz_questions
  for select using (true);

-- Admin write policies
create policy "admin write notes" on notes
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "admin write tutorials" on tutorials
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "admin write courses" on courses
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "admin write course_modules" on course_modules
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "admin write quizzes" on quizzes
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "admin write quiz_questions" on quiz_questions
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Users can only see/write their own profile
create policy "own profile" on profiles
  for all using (auth.uid() = id);

-- Users can only see/write their own progress
create policy "own progress" on course_progress
  for all using (auth.uid() = user_id);

-- ============================================================
-- Full-text search RPCs (called from searchService.ts)
-- ============================================================
create or replace function search_notes(search_query text)
returns table (
  id            uuid,
  slug          text,
  title         text,
  subject_id    uuid,
  sort_order    int,
  rank          float4
) as $$
  select
    n.id,
    n.slug,
    n.title,
    n.subject_id,
    n.sort_order,
    ts_rank(n.search_vector, websearch_to_tsquery('english', search_query)) as rank
  from notes n
  where
    n.published = true
    and n.search_vector @@ websearch_to_tsquery('english', search_query)
  order by rank desc
  limit 20;
$$ language sql stable;

create or replace function search_tutorials(search_query text)
returns table (
  id            uuid,
  slug          text,
  title         text,
  subject_id    uuid,
  sort_order    int,
  rank          float4
) as $$
  select
    t.id,
    t.slug,
    t.title,
    t.subject_id,
    t.sort_order,
    ts_rank(t.search_vector, websearch_to_tsquery('english', search_query)) as rank
  from tutorials t
  where
    t.published = true
    and t.search_vector @@ websearch_to_tsquery('english', search_query)
  order by rank desc
  limit 20;
$$ language sql stable;
