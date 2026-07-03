import { supabase } from '@/lib/supabaseClient';

// ——————————————————————————————————————————————————
// Types
// ——————————————————————————————————————————————————
export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  sort_order: number;
}

export interface QuizRow {
  id: string;
  tutorial_id: string | null;
  title: string;
  description: string | null;
  tutorials?: { title: string };
}

export interface QuizWithQuestions {
  id: string;
  tutorial_id: string | null;
  title: string;
  description: string | null;
  quiz_questions: QuizQuestion[];
}

// ——————————————————————————————————————————————————
// Fetch quiz by tutorial slug (joins through tutorials table)
// ——————————————————————————————————————————————————
export async function getQuizByTutorialSlug(
  tutorialSlug: string
): Promise<QuizWithQuestions | null> {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      id,
      tutorial_id,
      title,
      description,
      quiz_questions (
        id,
        quiz_id,
        question,
        options,
        correct_index,
        explanation,
        sort_order
      ),
      tutorials!inner ( slug )
    `)
    .eq('tutorials.slug', tutorialSlug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // no rows
    throw error;
  }

  // Sort questions by sort_order
  if (data?.quiz_questions) {
    (data.quiz_questions as QuizQuestion[]).sort((a, b) => a.sort_order - b.sort_order);
  }

  return data as unknown as QuizWithQuestions;
}

// ——————————————————————————————————————————————————
// Admin CRUD
// ——————————————————————————————————————————————————
export async function getAllQuizzes(): Promise<QuizRow[]> {
  const { data, error } = await supabase
    .from('quizzes')
    .select('id, tutorial_id, title, description, tutorials(title)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as unknown as QuizRow[];
}

export async function getQuizById(id: string): Promise<QuizWithQuestions> {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      id, tutorial_id, title, description,
      quiz_questions ( id, quiz_id, question, options, correct_index, explanation, sort_order )
    `)
    .eq('id', id)
    .single();
  if (error) throw error;
  
  if (data?.quiz_questions) {
    (data.quiz_questions as QuizQuestion[]).sort((a, b) => a.sort_order - b.sort_order);
  }
  return data as unknown as QuizWithQuestions;
}

export async function createQuiz(quiz: { tutorial_id: string; title: string; description?: string }): Promise<QuizRow> {
  const { data, error } = await supabase
    .from('quizzes')
    .insert([quiz])
    .select()
    .single();
  if (error) throw error;
  return data as unknown as QuizRow;
}

export async function updateQuiz(id: string, updates: { title?: string; description?: string; tutorial_id?: string }): Promise<QuizRow> {
  const { data, error } = await supabase
    .from('quizzes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as QuizRow;
}

export async function deleteQuiz(id: string): Promise<void> {
  const { error } = await supabase.from('quizzes').delete().eq('id', id);
  if (error) throw error;
}

export async function syncQuizQuestions(quizId: string, questions: Omit<QuizQuestion, 'quiz_id'>[]): Promise<void> {
  // 1. Delete all existing questions for this quiz
  const { error: delErr } = await supabase.from('quiz_questions').delete().eq('quiz_id', quizId);
  if (delErr) throw delErr;

  if (questions.length === 0) return;

  // 2. Insert the new/updated ones
  const toInsert = questions.map(q => {
    const { id, ...rest } = q;
    return { ...rest, quiz_id: quizId }; // let DB generate new UUIDs
  });

  const { error: insErr } = await supabase.from('quiz_questions').insert(toInsert);
  if (insErr) throw insErr;
}
