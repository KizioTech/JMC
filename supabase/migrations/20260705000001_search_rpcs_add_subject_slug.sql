-- ============================================================
-- Fix search RPCs: add subject_slug to return type so clients
-- can build correct URLs (/notes/:subject/:slug instead of
-- /notes/:slug which was the broken pre-migration path).
-- ============================================================

-- Drop existing functions first (they have different return types)
drop function if exists search_notes(text);
drop function if exists search_tutorials(text);

-- Recreate search_notes with subject_slug in return type
create function search_notes(search_query text)
returns table (
  id            uuid,
  slug          text,
  title         text,
  subject_slug  text,
  subject_id    uuid,
  sort_order    int,
  rank          float4
) as $$
  select
    n.id,
    n.slug,
    n.title,
    s.slug  as subject_slug,
    n.subject_id,
    n.sort_order,
    ts_rank(n.search_vector, websearch_to_tsquery('english', search_query)) as rank
  from notes n
  join subjects s on s.id = n.subject_id
  where
    n.published = true
    and n.search_vector @@ websearch_to_tsquery('english', search_query)
  order by rank desc
  limit 20;
$$ language sql stable;

-- Recreate search_tutorials with subject_slug in return type
create function search_tutorials(search_query text)
returns table (
  id            uuid,
  slug          text,
  title         text,
  subject_slug  text,
  subject_id    uuid,
  sort_order    int,
  rank          float4
) as $$
  select
    t.id,
    t.slug,
    t.title,
    s.slug  as subject_slug,
    t.subject_id,
    t.sort_order,
    ts_rank(t.search_vector, websearch_to_tsquery('english', search_query)) as rank
  from tutorials t
  join subjects s on s.id = t.subject_id
  where
    t.published = true
    and t.search_vector @@ websearch_to_tsquery('english', search_query)
  order by rank desc
  limit 20;
$$ language sql stable;