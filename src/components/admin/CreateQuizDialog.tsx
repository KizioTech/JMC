import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createQuiz } from '@/services/quizService';
import { getAllAdminTutorials } from '@/services/contentService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function CreateQuizDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tutorialId, setTutorialId] = useState('');

  const { data: tutorials } = useQuery({ 
    queryKey: ['admin-tutorials'], 
    queryFn: getAllAdminTutorials 
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return createQuiz({ 
        title, 
        description, 
        tutorial_id: tutorialId 
      });
    },
    onSuccess: (quiz) => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      onOpenChange(false);
      navigate(`/admin/quizzes/${quiz.id}/edit`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Create Quiz</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Calculus Basics Quiz" 
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Short description of the quiz" 
              className="resize-none h-20"
            />
          </div>
          <div className="space-y-2">
            <Label>Linked Tutorial</Label>
            <Select value={tutorialId} onValueChange={setTutorialId}>
              <SelectTrigger><SelectValue placeholder="Select a tutorial" /></SelectTrigger>
              <SelectContent>
                {tutorials?.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            disabled={!title || !tutorialId || createMutation.isPending} 
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? 'Creating…' : 'Create & Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
