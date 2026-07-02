-- Grant all privileges to authenticated and service_role on all public tables
-- This is needed for the supabase JS client to work properly.
-- The service_role bypasses RLS but still needs Postgres-level grants.

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;

-- Ensure future tables also get these grants automatically
alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;

alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;

alter default privileges in schema public
  grant all on routines to anon, authenticated, service_role;
