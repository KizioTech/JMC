import { supabase } from '@/lib/supabaseClient';

// ——————————————————————————————————————————————————
// Types
// ——————————————————————————————————————————————————
export interface CourseRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | null;
  duration_weeks: number | null;
  cover_image: string | null;
  published: boolean;
}

export interface CourseModule {
  id: string;
  course_id: string;
  note_id: string | null;
  tutorial_id: string | null;
  title: string;
  sort_order: number;
}

export interface CourseWithModules extends CourseRow {
  course_modules: CourseModule[];
}

// ——————————————————————————————————————————————————
// Fetch all published courses
// ——————————————————————————————————————————————————
export async function getPublishedCourses(): Promise<CourseRow[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('id, slug, title, description, level, duration_weeks, cover_image, published')
    .eq('published', true)
    .order('created_at');
  if (error) throw error;
  return data as CourseRow[];
}

// ——————————————————————————————————————————————————
// Fetch a single course with its modules
// ——————————————————————————————————————————————————
export async function getCourseBySlug(slug: string): Promise<CourseWithModules> {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      id, slug, title, description, level, duration_weeks, cover_image, published,
      course_modules (
        id, course_id, note_id, tutorial_id, title, sort_order
      )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single();
  if (error) throw error;

  if (data?.course_modules) {
    (data.course_modules as CourseModule[]).sort((a, b) => a.sort_order - b.sort_order);
  }

  return data as unknown as CourseWithModules;
}

// ——————————————————————————————————————————————————
// Admin CRUD
// ——————————————————————————————————————————————————
export async function getAllAdminCourses(): Promise<CourseRow[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('id, slug, title, description, level, duration_weeks, cover_image, published')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as CourseRow[];
}

export async function getAdminCourseById(id: string): Promise<CourseWithModules> {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      id, slug, title, description, level, duration_weeks, cover_image, published,
      course_modules (
        id, course_id, note_id, tutorial_id, title, sort_order
      )
    `)
    .eq('id', id)
    .single();
  if (error) throw error;

  if (data?.course_modules) {
    (data.course_modules as CourseModule[]).sort((a, b) => a.sort_order - b.sort_order);
  }

  return data as unknown as CourseWithModules;
}

export async function createCourse(course: { title: string; slug: string }): Promise<CourseRow> {
  const { data, error } = await supabase
    .from('courses')
    .insert([{ ...course, published: false }])
    .select()
    .single();
  if (error) throw error;
  return data as CourseRow;
}

export async function updateCourse(id: string, updates: Partial<CourseRow>): Promise<CourseRow> {
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as CourseRow;
}

export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
}

export async function syncCourseModules(courseId: string, modules: Omit<CourseModule, 'course_id'>[]): Promise<void> {
  // 1. Delete all existing modules
  const { error: delErr } = await supabase.from('course_modules').delete().eq('course_id', courseId);
  if (delErr) throw delErr;

  if (modules.length === 0) return;

  // 2. Insert the new ones
  const toInsert = modules.map(m => {
    const { id, ...rest } = m;
    return { ...rest, course_id: courseId };
  });

  const { error: insErr } = await supabase.from('course_modules').insert(toInsert);
  if (insErr) throw insErr;
}
