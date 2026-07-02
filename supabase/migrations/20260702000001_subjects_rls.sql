-- Enable RLS on subjects and add public read policy
alter table subjects enable row level security;

create policy "public read subjects" on subjects
  for select using (true);

create policy "admin write subjects" on subjects
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
