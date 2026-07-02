import { supabase } from '@/lib/supabaseClient';

// ——————————————————————————————————————————————————
// Types
// ——————————————————————————————————————————————————
export interface SubjectRow {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
}

export interface NoteRow {
  id: string;
  subject_id: string;
  slug: string;
  title: string;
  sort_order: number;
  published: boolean;
  subjects?: { slug: string; name: string };
  updated_at?: string;
  content_md?: string; // used for preview/extracts if needed
}

export interface NoteWithContent extends NoteRow {
  content_md: string;
}

export interface TutorialRow {
  id: string;
  subject_id: string;
  note_id: string | null;
  slug: string;
  title: string;
  description?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  duration_text?: string;
  rating?: number;
  topics?: string[];
  sort_order: number;
  published: boolean;
  subjects?: { slug: string; name: string };
  notes?: { slug: string };
}

export interface TutorialWithContent extends TutorialRow {
  content_md: string;
}

// ——————————————————————————————————————————————————
// Subjects
// ——————————————————————————————————————————————————
export async function getAllSubjects(): Promise<SubjectRow[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data;
}

// ——————————————————————————————————————————————————
// Notes
// ——————————————————————————————————————————————————
export async function getAllNotes(): Promise<NoteRow[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('id, subject_id, slug, title, sort_order, published, updated_at, subjects(slug, name)')
    .eq('published', true)
    .order('sort_order');
  if (error) throw error;
  return data as unknown as NoteRow[];
}

export async function getAllAdminNotes(): Promise<NoteRow[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('id, subject_id, slug, title, sort_order, published, updated_at, subjects(slug, name)')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data as unknown as NoteRow[];
}

export async function getNotesForSubject(subjectSlug: string): Promise<NoteRow[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('id, subject_id, slug, title, sort_order, published, subjects!inner(slug, name)')
    .eq('subjects.slug', subjectSlug)
    .eq('published', true)
    .order('sort_order');
  if (error) throw error;
  return data as unknown as NoteRow[];
}

export async function getNoteBySlug(
  subjectSlug: string,
  noteSlug: string
): Promise<NoteWithContent> {
  const { data, error } = await supabase
    .from('notes')
    .select('id, subject_id, slug, title, content_md, sort_order, published, subjects!inner(slug, name)')
    .eq('slug', noteSlug)
    .eq('subjects.slug', subjectSlug)
    .eq('published', true)
    .single();
  if (error) throw error;
  return data as unknown as NoteWithContent;
}

// ——————————————————————————————————————————————————
// Tutorials
// ——————————————————————————————————————————————————
export async function getAllTutorials(): Promise<TutorialRow[]> {
  const { data, error } = await supabase
    .from('tutorials')
    .select('id, subject_id, note_id, slug, title, description, difficulty, duration_text, rating, topics, sort_order, published, subjects(slug, name), notes(slug)')
    .eq('published', true)
    .order('sort_order');
  if (error) throw error;
  return data as unknown as TutorialRow[];
}

export async function getAllAdminTutorials(): Promise<TutorialRow[]> {
  const { data, error } = await supabase
    .from('tutorials')
    .select('id, subject_id, note_id, slug, title, description, difficulty, duration_text, rating, topics, sort_order, published, subjects(slug, name), notes(slug)')
    .order('sort_order');
  if (error) throw error;
  return data as unknown as TutorialRow[];
}

export async function getTutorialsForSubject(subjectSlug: string): Promise<TutorialRow[]> {
  const { data, error } = await supabase
    .from('tutorials')
    .select('id, subject_id, note_id, slug, title, description, difficulty, duration_text, rating, topics, sort_order, published, subjects!inner(slug, name), notes(slug)')
    .eq('subjects.slug', subjectSlug)
    .eq('published', true)
    .order('sort_order');
  if (error) throw error;
  return data as unknown as TutorialRow[];
}

export async function getTutorialBySlug(
  subjectSlug: string,
  tutorialSlug: string
): Promise<TutorialWithContent> {
  const { data, error } = await supabase
    .from('tutorials')
    .select('id, subject_id, note_id, slug, title, description, difficulty, duration_text, rating, topics, content_md, sort_order, published, subjects!inner(slug, name), notes(slug)')
    .eq('slug', tutorialSlug)
    .eq('subjects.slug', subjectSlug)
    .eq('published', true)
    .single();
  if (error) throw error;
  return data as unknown as TutorialWithContent;
}
