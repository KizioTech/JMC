import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllQuizzes, deleteQuiz } from '@/services/quizService';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Skeletons';
import CreateQuizDialog from '@/components/admin/CreateQuizDialog';

const QuizzesManager = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['admin-quizzes'],
    queryFn: getAllQuizzes
  });

  const deleteMutation = useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete quiz.');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-stack-md">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-h2 text-headline-h2 text-primary">Quizzes Manager</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage quizzes and their questions.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Quiz
        </button>
        <CreateQuizDialog open={createOpen} onOpenChange={setCreateOpen} />
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6"><TableSkeleton /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Title</th>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Linked Tutorial</th>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {!quizzes || quizzes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center font-body-md text-body-md text-on-surface-variant">
                      No quizzes found. Create your first quiz!
                    </td>
                  </tr>
                ) : (
                  quizzes.map(quiz => (
                    <tr key={quiz.id} className="hover:bg-surface-container-lowest transition-colors group">
                      <td className="px-6 py-4 font-body-md text-body-md font-semibold text-primary">{quiz.title}</td>
                      <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">
                        {quiz.tutorials?.title || <span className="text-muted-foreground italic">None</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/quizzes/${quiz.id}/edit`}>
                            <button className="px-4 py-1.5 border border-outline-variant rounded-lg font-label-caps text-label-caps text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all flex items-center gap-1.5">
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(quiz.id)}
                            disabled={deleteMutation.isPending}
                            className="px-4 py-1.5 border border-error/30 rounded-lg font-label-caps text-label-caps text-error hover:bg-error hover:text-on-error hover:border-error transition-all flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesManager;
