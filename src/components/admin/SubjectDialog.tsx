import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubject, updateSubject, type SubjectRow } from '@/services/contentService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function slugify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default function SubjectDialog({ 
  open, 
  onOpenChange,
  subjectToEdit
}: { 
  open: boolean; 
  onOpenChange: (v: boolean) => void;
  subjectToEdit?: SubjectRow | null;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  
  const isEditing = !!subjectToEdit;

  useEffect(() => {
    if (open) {
      if (subjectToEdit) {
        setName(subjectToEdit.name);
        setSlug(subjectToEdit.slug);
        setSortOrder(subjectToEdit.sort_order.toString());
      } else {
        setName('');
        setSlug('');
        setSortOrder('0');
      }
    }
  }, [open, subjectToEdit]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isEditing) {
        return updateSubject(subjectToEdit.id, { 
          name, 
          slug, 
          sort_order: parseInt(sortOrder, 10) || 0 
        });
      } else {
        return createSubject({ 
          name, 
          slug, 
          sort_order: parseInt(sortOrder, 10) || 0 
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{isEditing ? 'Edit Subject' : 'Create Subject'}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input 
              value={name} 
              onChange={(e) => { 
                setName(e.target.value); 
                if (!isEditing) setSlug(slugify(e.target.value)); 
              }} 
              placeholder="e.g. Calculus" 
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. calculus" />
          </div>
          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            disabled={!name || !slug || saveMutation.isPending} 
            onClick={() => saveMutation.mutate()}
          >
            {saveMutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
