-- ============================================================
-- Media Storage Bucket setup
-- ============================================================

-- Create a public "media" bucket
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Drop existing policies if any
drop policy if exists "Public media reads" on storage.objects;
drop policy if exists "Admin media inserts" on storage.objects;
drop policy if exists "Admin media updates" on storage.objects;
drop policy if exists "Admin media deletes" on storage.objects;

-- Allow public read access to all objects in the "media" bucket
create policy "Public media reads"
on storage.objects for select
to public
using ( bucket_id = 'media' );

-- Allow authenticated admins to insert
create policy "Admin media inserts"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'media' and (auth.jwt() ->> 'role') = 'admin' );

-- Allow authenticated admins to update
create policy "Admin media updates"
on storage.objects for update
to authenticated
using ( bucket_id = 'media' and (auth.jwt() ->> 'role') = 'admin' );

-- Allow authenticated admins to delete
create policy "Admin media deletes"
on storage.objects for delete
to authenticated
using ( bucket_id = 'media' and (auth.jwt() ->> 'role') = 'admin' );
