-- migration: 20260704000000_note_drafts.sql
alter table notes
  add column if not exists draft_content_md text,
  add column if not exists draft_title      text,
  add column if not exists draft_saved_at   timestamptz,
  add column if not exists published_at     timestamptz;

-- backfill: existing notes start with their draft equal to their live content
update notes set draft_content_md = content_md, draft_title = title
  where draft_content_md is null;

-- repeat for tutorials
alter table tutorials
  add column if not exists draft_content_md text,
  add column if not exists draft_title      text,
  add column if not exists draft_saved_at   timestamptz,
  add column if not exists published_at     timestamptz;

update tutorials set draft_content_md = content_md, draft_title = title
  where draft_content_md is null;
