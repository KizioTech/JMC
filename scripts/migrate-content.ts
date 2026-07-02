/**
 * JMC Content Migration Script
 * Reads all markdown/JSON content from public/ and upserts it into Supabase.
 *
 * Run with:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/migrate-content.ts
 *
 * Or, with keys already in .env:
 *   npx dotenv -e .env -- npx tsx scripts/migrate-content.ts
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Use service role key — bypasses RLS, only for migration scripts (never in the browser)
const supabase = createClient(supabaseUrl, serviceRoleKey);

// ——————————————————————————————————————————————————
// Helpers
// ——————————————————————————————————————————————————
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function titleFromSlug(slug: string) {
  return slug.split('-').map(capitalize).join(' ');
}

// Mapping: note slug → tutorial slug (mirrors noteToTutorialMap in documentService.ts)
const noteToTutorialMap: Record<string, string> = {
  'hyperbolic-functions':        'hyperbolic-functions-tutorial',
  'transcendental-functions':    'transcendental-functions-tutorial1',
  'trigonometric-functions':     'trigonometric-functions-tutorial',
  'counting-techniques':         'counting-techniques-tutorial',
  'pigeonhole-principle':        'pigeonhole-principle-tutorial',
  'recurrence-relations':        'recurrence-relations-tutorial',
  'angular-measure':             'angular-measure-tutorial',
  'quadratic-equations':         'quadratic-equations-tutorial',
  'arcs-and-sectors':            'arcs-and-sectors-tutorial',
};

// ——————————————————————————————————————————————————
// 1. Migrate subjects
// ——————————————————————————————————————————————————
async function ensureSubject(slug: string): Promise<string> {
  const { data, error } = await supabase
    .from('subjects')
    .upsert(
      { slug, name: capitalize(slug), sort_order: ['algebra', 'calculus', 'discrete', 'trigonometry'].indexOf(slug) },
      { onConflict: 'slug' }
    )
    .select('id')
    .single();

  if (error) throw new Error(`Subject upsert failed for "${slug}": ${error.message}`);
  return data.id;
}

// ——————————————————————————————————————————————————
// 2. Migrate notes
// ——————————————————————————————————————————————————
async function migrateNotes() {
  console.log('\n📝  Migrating notes…');
  const SUBJECTS = ['algebra', 'calculus', 'discrete', 'trigonometry'];

  for (const subjectSlug of SUBJECTS) {
    const subjectId = await ensureSubject(subjectSlug);
    const dir = path.join(ROOT, 'public/content/notes', subjectSlug);

    if (!fs.existsSync(dir)) {
      console.log(`  ⚠️  Directory not found: ${dir}`);
      continue;
    }

    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .sort();

    for (const [i, file] of files.entries()) {
      const slug = file.replace('.md', '');
      const content_md = fs.readFileSync(path.join(dir, file), 'utf-8');

      // Extract title from first H1 heading if available
      const h1 = content_md.match(/^#\s+(.+)$/m);
      const title = h1 ? h1[1].trim() : titleFromSlug(slug);

      const { error } = await supabase
        .from('notes')
        .upsert(
          { subject_id: subjectId, slug, title, content_md, sort_order: i, published: true },
          { onConflict: 'subject_id,slug' }
        );

      if (error) {
        console.error(`  ❌  notes/${subjectSlug}/${slug}: ${error.message}`);
      } else {
        console.log(`  ✅  notes/${subjectSlug}/${slug}`);
      }
    }
  }
}

// ——————————————————————————————————————————————————
// 3. Migrate tutorials
// ——————————————————————————————————————————————————
async function migrateTutorials() {
  console.log('\n📖  Migrating tutorials…');
  const SUBJECTS = ['algebra', 'calculus', 'discrete', 'trigonometry'];

  for (const subjectSlug of SUBJECTS) {
    const subjectId = await ensureSubject(subjectSlug);
    const dir = path.join(ROOT, 'public/content/tutorials', subjectSlug);

    if (!fs.existsSync(dir)) {
      console.log(`  ⚠️  Directory not found: ${dir}`);
      continue;
    }

    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .sort();

    for (const [i, file] of files.entries()) {
      const slug = file.replace('.md', '');
      const content_md = fs.readFileSync(path.join(dir, file), 'utf-8');

      const h1 = content_md.match(/^#\s+(.+)$/m);
      const title = h1 ? h1[1].trim() : titleFromSlug(slug);

      // Look up the corresponding note_id via the reverse map
      const noteSlug = Object.entries(noteToTutorialMap).find(([, tSlug]) => tSlug === slug)?.[0];
      let noteId: string | null = null;
      if (noteSlug) {
        const { data: noteRow } = await supabase
          .from('notes')
          .select('id')
          .eq('slug', noteSlug)
          .eq('subject_id', subjectId)
          .single();
        noteId = noteRow?.id ?? null;
      }

      const { error } = await supabase
        .from('tutorials')
        .upsert(
          { subject_id: subjectId, slug, title, content_md, sort_order: i, published: true, note_id: noteId },
          { onConflict: 'subject_id,slug' }
        );

      if (error) {
        console.error(`  ❌  tutorials/${subjectSlug}/${slug}: ${error.message}`);
      } else {
        console.log(`  ✅  tutorials/${subjectSlug}/${slug}${noteId ? ` (linked to note: ${noteSlug})` : ''}`);
      }
    }
  }
}

// ——————————————————————————————————————————————————
// 4. Migrate quizzes
// ——————————————————————————————————————————————————
async function migrateQuizzes() {
  console.log('\n🧪  Migrating quizzes…');
  const dir = path.join(ROOT, 'public/quizzes');

  if (!fs.existsSync(dir)) {
    console.log('  ⚠️  No quizzes directory found.');
    return;
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
    // filename pattern: <tutorial-slug>-quiz.json
    const tutorialSlug = file.replace('-quiz.json', '');

    const { data: tutorialRow, error: tErr } = await supabase
      .from('tutorials')
      .select('id')
      .eq('slug', tutorialSlug)
      .single();

    if (tErr || !tutorialRow) {
      console.warn(`  ⚠️  No tutorial found for quiz: ${tutorialSlug}`);
      continue;
    }

    // Delete existing quiz for this tutorial (re-migrate clean)
    await supabase.from('quizzes').delete().eq('tutorial_id', tutorialRow.id);

    const { data: quizRow, error: qErr } = await supabase
      .from('quizzes')
      .insert({
        tutorial_id: tutorialRow.id,
        title: raw.title ?? titleFromSlug(tutorialSlug),
        description: raw.description ?? null,
      })
      .select('id')
      .single();

    if (qErr || !quizRow) {
      console.error(`  ❌  Quiz insert failed for ${tutorialSlug}: ${qErr?.message}`);
      continue;
    }

    const questions = (raw.questions ?? []).map((q: {
      question: string;
      options: string[];
      correct: number;
      explanation?: string;
    }, i: number) => ({
      quiz_id: quizRow.id,
      question: q.question,
      options: q.options,
      correct_index: q.correct,
      explanation: q.explanation ?? null,
      sort_order: i,
    }));

    if (questions.length > 0) {
      const { error: qqErr } = await supabase.from('quiz_questions').insert(questions);
      if (qqErr) {
        console.error(`  ❌  Questions insert failed for ${tutorialSlug}: ${qqErr.message}`);
      } else {
        console.log(`  ✅  quiz: ${tutorialSlug} (${questions.length} questions)`);
      }
    }
  }
}

// ——————————————————————————————————————————————————
// Main
// ——————————————————————————————————————————————————
(async () => {
  console.log('🚀  JMC Content Migration');
  console.log(`    Supabase: ${supabaseUrl}`);

  await migrateNotes();
  await migrateTutorials();
  await migrateQuizzes();

  console.log('\n🎉  Migration complete!\n');
})();
