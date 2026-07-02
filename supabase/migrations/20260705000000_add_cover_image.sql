-- ============================================================
-- Add cover_image and difficulty to notes and tutorials
-- ============================================================

-- Add cover_image and difficulty to notes
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS cover_image text,
ADD COLUMN IF NOT EXISTS difficulty text check (difficulty in ('Beginner','Intermediate','Advanced'));

-- Add cover_image to tutorials
ALTER TABLE tutorials 
ADD COLUMN IF NOT EXISTS cover_image text;
