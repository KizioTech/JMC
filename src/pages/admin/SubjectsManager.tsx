import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllSubjects, deleteSubject, type SubjectRow } from '@/services/contentService';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Skeletons';
import SubjectDialog from '@/components/admin/SubjectDialog';

const SubjectsManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<SubjectRow | null>(null);
  
  const queryClient = useQueryClient();
  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: getAllSubjects
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
    onError: (err: Error) => {
      alert(err.message || 'Failed to delete subject.');
    }
  });

  const handleCreate = () => {
    setSubjectToEdit(null);
    setDialogOpen(true);
  };

  const handleEdit = (subject: SubjectRow) => {
    setSubjectToEdit(subject);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-stack-md">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-h2 text-headline-h2 text-primary">Subjects Manager</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage top-level subjects and order.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Subject
        </button>
        <SubjectDialog 
          open={dialogOpen} 
          onOpenChange={setDialogOpen} 
          subjectToEdit={subjectToEdit} 
        />
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6"><TableSkeleton /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Name</th>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Slug</th>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Order</th>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {!subjects || subjects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center font-body-md text-body-md text-on-surface-variant">
                      No subjects found.
                    </td>
                  </tr>
                ) : (
                  subjects.map(subject => (
                    <tr key={subject.id} className="hover:bg-surface-container-lowest transition-colors group">
                      <td className="px-6 py-4 font-body-md text-body-md font-semibold text-primary">{subject.name}</td>
                      <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">{subject.slug}</td>
                      <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">{subject.sort_order}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(subject)}
                            className="px-4 py-1.5 border border-outline-variant rounded-lg font-label-caps text-label-caps text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all flex items-center gap-1.5"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(subject.id)}
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

export default SubjectsManager;
