import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuizById, updateQuiz, syncQuizQuestions, type QuizQuestion } from '@/services/quizService';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, CheckCircle, Plus, Trash2, GripVertical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function QuizEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { session, role, loading: authLoading } = useAuth();

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['admin-quiz', id],
    queryFn: () => getQuizById(id!),
    enabled: !!id,
    staleTime: Infinity,
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Partial<QuizQuestion>[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title);
      setDescription(quiz.description || '');
      setQuestions(quiz.quiz_questions || []);
    }
  }, [quiz]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      // 1. Update quiz metadata
      await updateQuiz(id!, { title, description });
      
      // 2. Sync questions
      const cleanedQuestions = questions.map((q, idx) => ({
        id: q.id, // will be undefined for new ones
        question: q.question || '',
        options: q.options || ['', ''],
        correct_index: q.correct_index || 0,
        explanation: q.explanation || '',
        sort_order: idx
      }));
      await syncQuizQuestions(id!, cleanedQuestions as Omit<QuizQuestion, 'quiz_id'>[]);
    },
    onSuccess: () => {
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ['admin-quiz', id] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to save quiz.');
    }
  });

  // Auth guard
  if (authLoading) return <div className="min-h-screen pt-20"><ContentSkeleton /></div>;
  if (!session) return <Navigate to="/auth" state={{ from: location }} replace />;
  if (role !== 'admin') return <Navigate to="/" replace />;

  if (isLoading) return <div className="p-6"><ContentSkeleton /></div>;

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correct_index: 0, explanation: '' }]);
  };

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    const next = [...questions];
    next[index] = { ...next[index], ...updates };
    setQuestions(next);
  };

  const removeQuestion = (index: number) => {
    const next = [...questions];
    next.splice(index, 1);
    setQuestions(next);
  };

  const updateOption = (qIndex: number, optIndex: number, val: string) => {
    const next = [...questions];
    const opts = [...(next[qIndex].options || [])];
    opts[optIndex] = val;
    next[qIndex].options = opts;
    setQuestions(next);
  };

  const addOption = (qIndex: number) => {
    const next = [...questions];
    next[qIndex].options = [...(next[qIndex].options || []), ''];
    setQuestions(next);
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const next = [...questions];
    const opts = [...(next[qIndex].options || [])];
    opts.splice(optIndex, 1);
    next[qIndex].options = opts;
    
    // adjust correct index if needed
    if (next[qIndex].correct_index === optIndex) next[qIndex].correct_index = 0;
    else if ((next[qIndex].correct_index || 0) > optIndex) {
      next[qIndex].correct_index = (next[qIndex].correct_index || 1) - 1;
    }
    
    setQuestions(next);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-3 border-b border-outline-variant bg-surface-container-lowest shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/quizzes')} className="text-on-surface-variant hover:text-primary hover:bg-primary/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Input 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            className="text-lg font-headline-h3 font-bold border-transparent hover:border-outline-variant focus-visible:ring-1 bg-transparent w-96 px-2 py-1 h-auto"
            placeholder="Quiz Title"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-body-sm text-on-surface-variant flex items-center gap-1.5">
            {saveMutation.isPending ? 'Saving…' : lastSaved ? (
              <><CheckCircle className="w-3 h-3 text-green-500" /> Saved {lastSaved.toLocaleTimeString()}</>
            ) : ''}
          </span>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-2">
            <Save className="w-4 h-4" /> Save Quiz
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 bg-muted/20">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-primary">Quiz Details</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">Description (Markdown supported)</label>
              <Textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="h-24 font-mono text-sm"
                placeholder="Description shown before the quiz begins..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">Questions ({questions.length})</h2>
              <Button variant="outline" size="sm" onClick={addQuestion} className="gap-2">
                <Plus className="w-4 h-4" /> Add Question
              </Button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm relative group overflow-hidden">
                <div className="bg-surface-container-low px-4 py-2 border-b border-outline-variant flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                    <GripVertical className="w-4 h-4 opacity-50 cursor-grab" />
                    Question {qIdx + 1}
                  </div>
                  <button onClick={() => removeQuestion(qIdx)} className="text-error/70 hover:text-error transition-colors p-1" title="Delete question">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Question Text (Markdown)</label>
                    <Textarea 
                      value={q.question} 
                      onChange={e => updateQuestion(qIdx, { question: e.target.value })} 
                      className="h-20 font-mono text-sm"
                      placeholder="What is the derivative of..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
                      Options (Markdown)
                      <button onClick={() => addOption(qIdx)} className="text-primary hover:underline flex items-center gap-1">
                        <Plus className="w-3 h-3" /> add
                      </button>
                    </label>
                    <div className="space-y-2">
                      {q.options?.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-start gap-2">
                          <input 
                            type="radio" 
                            name={`correct-${qIdx}`} 
                            checked={q.correct_index === oIdx}
                            onChange={() => updateQuestion(qIdx, { correct_index: oIdx })}
                            className="mt-3 w-4 h-4 text-primary border-outline-variant cursor-pointer"
                            title="Mark as correct answer"
                          />
                          <div className="flex-1 relative">
                            <Input 
                              value={opt} 
                              onChange={e => updateOption(qIdx, oIdx, e.target.value)} 
                              className={`font-mono text-sm pr-8 ${q.correct_index === oIdx ? 'border-primary ring-1 ring-primary/20' : ''}`}
                              placeholder={`Option ${oIdx + 1}`}
                            />
                            {q.options!.length > 2 && (
                              <button onClick={() => removeOption(qIdx, oIdx)} className="absolute right-2 top-2 text-on-surface-variant hover:text-error transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Explanation (Markdown) - Optional</label>
                    <Textarea 
                      value={q.explanation || ''} 
                      onChange={e => updateQuestion(qIdx, { explanation: e.target.value })} 
                      className="h-16 font-mono text-sm"
                      placeholder="Shown after answering..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant">
                No questions yet. Click "Add Question" to start building your quiz.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
