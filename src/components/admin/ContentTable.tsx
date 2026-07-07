import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from '@/components/ui/alert-dialog';

export interface ContentRow {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  difficulty?: string | null;
  updated_at?: string | null;
  subjects?: { name: string } | null;
}

interface ContentTableProps {
  items: ContentRow[];
  type: 'note' | 'tutorial';
}

const getDifficultyStyle = (difficulty?: string | null) => {
  switch (difficulty) {
    case "Beginner": return "bg-beginner-green/10 text-beginner-green";
    case "Intermediate": return "bg-intermediate-yellow/10 text-intermediate-yellow";
    case "Advanced": return "bg-advanced-red/10 text-advanced-red";
    default: return "bg-surface-container text-on-surface-variant";
  }
};

export default function ContentTable({ items, type }: ContentTableProps) {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const table = type === 'note' ? 'notes' : 'tutorials';
  const queryKey = type === 'note' ? 'admin-notes' : 'admin-tutorials';
  const basePath = type === 'note' ? '/admin/notes' : '/admin/tutorials';

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setDeleteId(null);
    }
  });

  if (!items || items.length === 0) {
    return (
      <div className="px-6 py-12 text-center font-body-md text-body-md text-on-surface-variant">
        No {type}s found. Create your first {type}!
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Title</th>
              <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Subject</th>
              <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Difficulty</th>
              <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Status</th>
              <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Updated</th>
              <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-body-md text-body-md font-semibold text-primary">{item.title}</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant text-xs">{item.slug}</div>
                </td>
                <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">{item.subjects?.name || '-'}</td>
                <td className="px-6 py-4">
                  {item.difficulty ? (
                    <span className={cn("inline-block px-3 py-1 rounded-full font-label-caps text-[10px] uppercase", getDifficultyStyle(item.difficulty))}>
                      {item.difficulty}
                    </span>
                  ) : (
                    <span className="text-on-surface-variant font-body-sm text-body-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {item.published ? (
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
                  {item.updated_at ? new Date(item.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`${basePath}/${item.id}/edit`}>
                      <button className="px-4 py-1.5 border border-outline-variant rounded-lg font-label-caps text-label-caps text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all flex items-center gap-1.5">
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="px-4 py-1.5 border border-error/30 rounded-lg font-label-caps text-label-caps text-error hover:bg-error hover:text-on-error hover:border-error transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {type}.
              {type === 'note' ? ' If this note is referenced in any tutorials or course modules, those links will be broken.' : ''}
              {type === 'tutorial' ? ' Any quizzes attached to this tutorial will also be deleted.' : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                if (deleteId) deleteMutation.mutate(deleteId);
              }}
              className="bg-error hover:bg-error/90 text-on-error"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
