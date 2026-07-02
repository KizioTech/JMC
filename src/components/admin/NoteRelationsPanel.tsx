import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { getAllAdminNotes } from '@/services/contentService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp, Link2 } from 'lucide-react';

export default function NoteRelationsPanel({ noteId }: { noteId: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: note } = useQuery({
    queryKey: ['admin-note', noteId],
    queryFn: async () => {
      const { data, error } = await supabase.from('notes').select('previous_note_id, next_note_id, subject_id').eq('id', noteId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: allNotes } = useQuery({ queryKey: ['admin-notes'], queryFn: getAllAdminNotes });

  const { data: tutorials } = useQuery({
    queryKey: ['admin-tutorials-for-note', noteId],
    queryFn: async () => {
      const { data, error } = await supabase.from('tutorials').select('id, title, note_id');
      if (error) throw error;
      return data;
    },
  });
  const linkedTutorial = tutorials?.find(t => t.note_id === noteId);

  const updateNote = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => {
      const { error } = await supabase.from('notes').update(patch).eq('id', noteId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-note', noteId] }),
  });

  const linkTutorial = useMutation({
    mutationFn: async (tutorialId: string | null) => {
      // clear any tutorial currently pointing at this note, then set the new one
      if (linkedTutorial) await supabase.from('tutorials').update({ note_id: null }).eq('id', linkedTutorial.id);
      if (tutorialId) await supabase.from('tutorials').update({ note_id: noteId }).eq('id', tutorialId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-tutorials-for-note', noteId] }),
  });

  return (
    <div className="border-b bg-muted/20 shrink-0">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5" /> Linked content & series order</span>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-4 pb-3">
          <div>
            <label className="text-xs text-muted-foreground">Tutorial</label>
            <Select value={linkedTutorial?.id ?? 'none'} onValueChange={(v) => linkTutorial.mutate(v === 'none' ? null : v)}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {tutorials?.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Previous note</label>
            <Select value={note?.previous_note_id ?? 'none'} onValueChange={(v) => updateNote.mutate({ previous_note_id: v === 'none' ? null : v })}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {allNotes?.filter(n => n.id !== noteId).map(n => <SelectItem key={n.id} value={n.id}>{n.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Next note</label>
            <Select value={note?.next_note_id ?? 'none'} onValueChange={(v) => updateNote.mutate({ next_note_id: v === 'none' ? null : v })}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {allNotes?.filter(n => n.id !== noteId).map(n => <SelectItem key={n.id} value={n.id}>{n.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
