-- migration: 20260703000000_note_series_links.sql
alter table notes
  add column if not exists previous_note_id uuid references notes(id) on delete set null,
  add column if not exists next_note_id     uuid references notes(id) on delete set null;

create index if not exists notes_previous_idx on notes (previous_note_id);
create index if not exists notes_next_idx     on notes (next_note_id);
