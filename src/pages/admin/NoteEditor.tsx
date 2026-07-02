import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { getAllSubjects } from '@/services/contentService';
import ContentEditor from '@/components/admin/ContentEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, ArrowLeft } from 'lucide-react';

const NoteEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [published, setPublished] = useState(false);
  const [content, setContent] = useState('');

  // Fetch subjects for dropdown
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: getAllSubjects
  });

  // Fetch note if editing
  const { data: note, isLoading } = useQuery({
    queryKey: ['admin-note', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !isNew
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setSlug(note.slug);
      setSubjectId(note.subject_id);
      setSortOrder(note.sort_order);
      setPublished(note.published);
      setContent(note.content_md || '');
    }
  }, [note]);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        slug,
        subject_id: subjectId,
        sort_order: sortOrder,
        published,
        content_md: content,
        updated_at: new Date().toISOString()
      };

      if (isNew) {
        const { error } = await supabase.from('notes').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('notes').update(payload).eq('id', id!);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notes'] });
      navigate('/admin/notes');
    },
    onError: (err) => {
      alert("Error saving note: " + err.message);
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/notes')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">{isNew ? 'Create Note' : 'Edit Note'}</h1>
        </div>
        <Button 
          onClick={() => saveMutation.mutate()} 
          disabled={saveMutation.isPending || !title || !slug || !subjectId}
          className="gap-2"
        >
          <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Note'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => handleTitleChange(e.target.value)} 
                placeholder="e.g. Introduction to Derivatives"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown + Math)</Label>
              <div className="border rounded-md overflow-hidden">
                <ContentEditor 
                  content={content} 
                  onChange={setContent} 
                  minHeight="min-h-[600px]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input 
                id="slug" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)} 
                placeholder="intro-to-derivatives"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects?.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input 
                id="sort_order" 
                type="number"
                value={sortOrder} 
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} 
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-0.5">
                <Label>Published</Label>
                <p className="text-xs text-muted-foreground">Make visible to public</p>
              </div>
              <Switch checked={published} onCheckedChange={setPublished} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
