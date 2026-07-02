import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { getAllAdminNotes } from '@/services/contentService';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Skeletons';
import CreateNoteDialog from '@/components/admin/CreateNoteDialog';
import { cn } from '@/lib/utils';

const NotesManager = () => {
  const [createOpen, setCreateOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const { data: notes, isLoading } = useQuery({
    queryKey: ['admin-notes'],
    queryFn: getAllAdminNotes
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notes'] });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-stack-md">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-h2 text-headline-h2 text-primary">Notes Manager</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage all published notes and drafts.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Note
        </button>
        <CreateNoteDialog open={createOpen} onOpenChange={setCreateOpen} />
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
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Subject</th>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Status</th>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Updated</th>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {!notes || notes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center font-body-md text-body-md text-on-surface-variant">
                      No notes found. Create your first note!
                    </td>
                  </tr>
                ) : (
                  notes.map(note => (
                    <tr key={note.id} className="hover:bg-surface-container-lowest transition-colors group">
                      <td className="px-6 py-4 font-body-md text-body-md font-semibold text-primary">{note.title}</td>
                      <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">{note.subjects?.name}</td>
                      <td className="px-6 py-4">
                        {note.published ? (
                          <span className="inline-flex items-center gap-1.5 text-beginner-green bg-beginner-green/10 px-3 py-1 rounded-full font-label-caps text-[10px] uppercase">
                            <CheckCircle className="w-3 h-3" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-on-surface-variant bg-surface-container px-3 py-1 rounded-full font-label-caps text-[10px] uppercase">
                            <XCircle className="w-3 h-3" /> Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">
                        {new Date(note.updated_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/notes/${note.id}/edit`}>
                            <button className="px-4 py-1.5 border border-outline-variant rounded-lg font-label-caps text-label-caps text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all flex items-center gap-1.5">
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(note.id)}
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

export default NotesManager;
