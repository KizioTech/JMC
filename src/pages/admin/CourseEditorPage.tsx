import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminCourseById, updateCourse, syncCourseModules, type CourseModule } from '@/services/courseService';
import { getAllAdminNotes, getAllAdminTutorials } from '@/services/contentService';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, CheckCircle, Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CourseEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { session, role, loading: authLoading } = useAuth();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['admin-course', id],
    queryFn: () => getAdminCourseById(id!),
    enabled: !!id,
  });

  const { data: notes } = useQuery({ queryKey: ['admin-notes'], queryFn: getAllAdminNotes });
  const { data: tutorials } = useQuery({ queryKey: ['admin-tutorials'], queryFn: getAllAdminTutorials });

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | ''>('');
  const [durationWeeks, setDurationWeeks] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [modules, setModules] = useState<Partial<CourseModule>[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setSlug(course.slug);
      setDescription(course.description || '');
      setLevel(course.level || '');
      setDurationWeeks(course.duration_weeks?.toString() || '');
      setCoverImage(course.cover_image || '');
      setPublished(course.published);
      setModules(course.course_modules || []);
    }
  }, [course]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      // 1. Update course metadata
      await updateCourse(id!, {
        title,
        slug,
        description: description || null,
        level: (level as any) || null,
        duration_weeks: durationWeeks ? parseInt(durationWeeks) : null,
        cover_image: coverImage || null,
        published,
      });

      // 2. Sync modules
      const cleanedModules = modules.map((m, idx) => ({
        id: m.id,
        title: m.title || 'Untitled Module',
        note_id: m.note_id || null,
        tutorial_id: m.tutorial_id || null,
        sort_order: idx,
      }));
      await syncCourseModules(id!, cleanedModules as Omit<CourseModule, 'course_id'>[]);
    },
    onSuccess: () => {
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ['admin-course', id] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to save course.');
    }
  });

  // Auth guard
  if (authLoading) return <div className="min-h-screen pt-20"><ContentSkeleton /></div>;
  if (!session) return <Navigate to="/auth" state={{ from: location }} replace />;
  if (role !== 'admin') return <Navigate to="/" replace />;

  if (courseLoading) return <div className="p-6"><ContentSkeleton /></div>;

  const addModule = () => {
    setModules([...modules, { title: '', note_id: null, tutorial_id: null }]);
  };

  const updateModule = (index: number, updates: Partial<CourseModule>) => {
    const next = [...modules];
    next[index] = { ...next[index], ...updates };
    setModules(next);
  };

  const removeModule = (index: number) => {
    const next = [...modules];
    next.splice(index, 1);
    setModules(next);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-3 border-b border-outline-variant bg-surface-container-lowest shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/courses')} className="text-on-surface-variant hover:text-primary hover:bg-primary/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="text-lg font-headline-h3 font-bold border-transparent hover:border-outline-variant focus-visible:ring-1 bg-transparent w-96 px-2 py-1 h-auto"
              placeholder="Course Title"
            />
            <div className="flex items-center gap-2 px-2">
              <span className="text-xs text-on-surface-variant">/courses/</span>
              <Input 
                value={slug} 
                onChange={e => setSlug(e.target.value)}
                className="text-xs font-mono h-6 py-0 px-1 border-transparent hover:border-outline-variant focus-visible:ring-1 bg-transparent w-64"
                placeholder="course-slug"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant">
            <Switch checked={published} onCheckedChange={setPublished} id="publish-switch" />
            <Label htmlFor="publish-switch" className="text-sm cursor-pointer">{published ? 'Published' : 'Draft'}</Label>
          </div>
          <span className="text-xs font-body-sm text-on-surface-variant flex items-center gap-1.5">
            {saveMutation.isPending ? 'Saving…' : lastSaved ? (
              <><CheckCircle className="w-3 h-3 text-green-500" /> Saved {lastSaved.toLocaleTimeString()}</>
            ) : ''}
          </span>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-2">
            <Save className="w-4 h-4" /> Save Course
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 bg-muted/20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            {/* Modules Manager */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-primary">Course Modules ({modules.length})</h2>
                <p className="text-xs text-on-surface-variant">Drag to reorder (visual only for now), select content.</p>
              </div>
              <Button variant="outline" size="sm" onClick={addModule} className="gap-2">
                <Plus className="w-4 h-4" /> Add Module
              </Button>
            </div>

            <div className="space-y-3">
              {modules.map((m, idx) => (
                <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex gap-4 items-start group">
                  <GripVertical className="w-5 h-5 text-outline-variant mt-2 cursor-grab flex-shrink-0" />
                  
                  <div className="flex-1 space-y-4">
                    <Input 
                      value={m.title} 
                      onChange={e => updateModule(idx, { title: e.target.value })}
                      className="font-semibold border-transparent bg-surface-container-low focus-visible:ring-1 focus-visible:bg-transparent"
                      placeholder={`Module ${idx + 1} Title`}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-on-surface-variant">Linked Note</Label>
                        <Select 
                          value={m.note_id || "none"} 
                          onValueChange={v => updateModule(idx, { note_id: v === "none" ? null : v, tutorial_id: null })}
                        >
                          <SelectTrigger className="text-sm h-8"><SelectValue placeholder="Select Note" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {notes?.map(n => <SelectItem key={n.id} value={n.id}>{n.title}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-on-surface-variant">OR Linked Tutorial</Label>
                        <Select 
                          value={m.tutorial_id || "none"} 
                          onValueChange={v => updateModule(idx, { tutorial_id: v === "none" ? null : v, note_id: null })}
                        >
                          <SelectTrigger className="text-sm h-8"><SelectValue placeholder="Select Tutorial" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {tutorials?.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => removeModule(idx)} className="text-error/50 hover:text-error mt-2 p-1" title="Remove Module">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {modules.length === 0 && (
                <div className="text-center p-8 border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant">
                  No modules yet. A course needs modules containing notes or tutorials.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-primary mb-2">Course Settings</h3>
              
              <div className="space-y-2">
                <Label>Level</Label>
                <Select value={level} onValueChange={(v: any) => setLevel(v)}>
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration (Weeks)</Label>
                <Input type="number" value={durationWeeks} onChange={e => setDurationWeeks(e.target.value)} placeholder="e.g. 4" />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="h-24 resize-none"
                  placeholder="Short marketing description..."
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-outline-variant">
                <Label className="flex justify-between items-center">
                  Cover Image URL
                  <a href="/admin/media" target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Media Library
                  </a>
                </Label>
                <Input 
                  value={coverImage} 
                  onChange={e => setCoverImage(e.target.value)} 
                  placeholder="https://..." 
                />
                {coverImage && (
                  <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-surface-container border border-outline-variant">
                    <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
