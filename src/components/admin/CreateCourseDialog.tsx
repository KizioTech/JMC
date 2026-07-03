import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse } from '@/services/courseService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function slugify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default function CreateCourseDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => {
      return createCourse({ title, slug });
    },
    onSuccess: (course) => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      onOpenChange(false);
      navigate(`/admin/courses/${course.id}/edit`);
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to create course');
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Create Course</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Course Title</Label>
            <Input 
              value={title} 
              onChange={(e) => { 
                setTitle(e.target.value); 
                setSlug(slugify(e.target.value)); 
              }} 
              placeholder="e.g. Master Calculus in 30 Days" 
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            disabled={!title || !slug || createMutation.isPending} 
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? 'Creating…' : 'Create & Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
