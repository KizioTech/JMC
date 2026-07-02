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
