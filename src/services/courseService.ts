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
