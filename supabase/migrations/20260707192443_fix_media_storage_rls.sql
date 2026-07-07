-- Drop existing policies if any
drop policy if exists "Admin media inserts" on storage.objects;
drop policy if exists "Admin media updates" on storage.objects;
drop policy if exists "Admin media deletes" on storage.objects;

-- Allow authenticated admins to insert
create policy "Admin media inserts"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'media' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

-- Allow authenticated admins to update
create policy "Admin media updates"
on storage.objects for update
to authenticated
using ( bucket_id = 'media' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

-- Allow authenticated admins to delete
create policy "Admin media deletes"
on storage.objects for delete
to authenticated
using ( bucket_id = 'media' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );
