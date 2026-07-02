import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { getAllAdminNotes } from '@/services/contentService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateNoteDialog from '@/components/admin/CreateNoteDialog';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notes Manager</h1>
        <Button className="gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> Create Note
        </Button>
        <CreateNoteDialog open={createOpen} onOpenChange={setCreateOpen} />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Subject</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Updated</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-t">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
                ) : notes?.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-4 text-center">No notes found.</td></tr>
                ) : (
                  notes?.map(note => (
                    <tr key={note.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{note.title}</td>
                      <td className="px-6 py-4 text-muted-foreground">{note.subjects?.name}</td>
                      <td className="px-6 py-4">
                        {note.published ? (
                          <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs w-max">
                            <CheckCircle className="w-3 h-3" /> Published
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs w-max">
                            <XCircle className="w-3 h-3" /> Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(note.updated_at || '').toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link to={`/admin/notes/${note.id}/edit`}>
                          <Button variant="outline" size="sm"><Edit2 className="w-4 h-4" /></Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(note.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesManager;
