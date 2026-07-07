import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { getAllSubjects } from '@/services/contentService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

function slugify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

interface CreateContentDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: 'note' | 'tutorial';
}

export default function CreateContentDialog({ open, onOpenChange, type }: CreateContentDialogProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: subjects } = useQuery({ queryKey: ['subjects'], queryFn: getAllSubjects });

  const createMutation = useMutation({
    mutationFn: async () => {
      setErrorMsg('');
      const table = type === 'note' ? 'notes' : 'tutorials';
      
      const { data, error } = await supabase
        .from(table)
        .insert([{ 
          title, 
          slug, 
          subject_id: subjectId, 
          content_md: '', 
          draft_title: title,
          draft_content_md: '',
          published: false 
        }])
        .select()
        .single();
        
      if (error) {
        if (error.code === '23505') {
          throw new Error('That slug already exists in this subject. Try a different title or edit the slug manually.');
        }
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`admin-${type}s`] });
      onOpenChange(false);
      navigate(`/admin/${type}s/${data.id}/edit`);
    },
    onError: (err: Error) => {
      setErrorMsg(err.message || 'Failed to create content.');
    }
  });

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      setTitle('');
      setSlug('');
      setSubjectId('');
      setErrorMsg('');
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create {type === 'note' ? 'Note' : 'Tutorial'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {errorMsg && (
            <div className="p-3 bg-error/10 text-error rounded-md text-sm font-medium">
              {errorMsg}
            </div>
          )}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input 
              value={title} 
              onChange={(e) => { 
                setTitle(e.target.value); 
                setSlug(slugify(e.target.value)); 
              }} 
              placeholder={`e.g. Introduction to ${type === 'note' ? 'Algebra' : 'Calculus'}`} 
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
              <SelectContent>
                {subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button 
            disabled={!title || !slug || !subjectId || createMutation.isPending} 
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? 'Creating…' : 'Create & Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
