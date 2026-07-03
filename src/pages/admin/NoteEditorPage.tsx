import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import ContentEditor from '@/components/admin/ContentEditor';
import NoteRelationsPanel from '@/components/admin/NoteRelationsPanel';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AUTOSAVE_INTERVAL_MS = 30_000; // 30 seconds

export default function NoteEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { session, role, loading: authLoading } = useAuth();

  // Only fetch once on mount — never re-fetches, so DB data never stomps on local state
  const { data: note, isLoading } = useQuery({
    queryKey: ['admin-note', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('notes').select('*').eq('id', id!).single();
      if (error) throw error;
      return data;
    },
    staleTime: Infinity,   // don't re-fetch in background
    refetchOnWindowFocus: false,
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const hasInitialized = useRef(false);

  // Initialize local state from DB exactly once
  useEffect(() => {
    if (note && !hasInitialized.current) {
      hasInitialized.current = true;
      setTitle(note.draft_title ?? note.title);
      setContent(note.draft_content_md ?? note.content_md ?? '');
      setPublished(note.published);
      if (note.draft_saved_at) setLastSaved(new Date(note.draft_saved_at));
    }
  }, [note]);

  // Keep latest title/content in a ref so the interval always reads current values
  // without needing them as dependencies (avoids resetting the timer on every keystroke)
  const latestTitle = useRef(title);
  const latestContent = useRef(content);
  useEffect(() => { latestTitle.current = title; }, [title]);
  useEffect(() => { latestContent.current = content; }, [content]);

  const saveDraft = useCallback(async () => {
    if (!id || !hasInitialized.current) return;
    setIsSaving(true);
    try {
      await supabase.from('notes').update({
        draft_title: latestTitle.current,
        draft_content_md: latestContent.current,
        draft_saved_at: new Date().toISOString(),
      }).eq('id', id);
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
    // No queryClient.invalidateQueries here — that would cause a re-fetch
    // and overwrite local state with whatever is in the DB
  }, [id]);

  // Fixed-interval autosave — completely independent of keystrokes
  useEffect(() => {
    if (!note) return;
    const interval = setInterval(saveDraft, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [note, saveDraft]);

  const publishMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('notes')
        .update({
          title: latestTitle.current,
          content_md: latestContent.current,
          draft_title: latestTitle.current,
          draft_content_md: latestContent.current,
          published: true,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id!);
      if (error) throw error;
    },
    onSuccess: () => {
      setLastSaved(new Date());
      // Only invalidate the list, not the individual note — keep local state intact
      queryClient.invalidateQueries({ queryKey: ['admin-notes'] });
    },
  });

  // Auth guard — mirrors AdminLayout (must be below all hooks)
  if (authLoading) return <div className="min-h-screen pt-20"><ContentSkeleton /></div>;
  if (!session) return <Navigate to="/auth" state={{ from: location }} replace />;
  if (role !== 'admin') return <Navigate to="/" replace />;

  if (isLoading) return <div className="p-6"><ContentSkeleton /></div>;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Slim top bar */}
      <header className="h-14 shrink-0 border-b flex items-center justify-between px-4 gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Button variant="ghost" size="icon" onClick={() => {
            saveDraft(); // save on navigate away
            navigate('/admin/notes');
          }}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-none text-lg font-semibold h-9 px-2 max-w-md w-full"
            placeholder="Note Title"
          />
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1">
            {isSaving ? 'Saving…' : lastSaved ? (
              <><CheckCircle className="w-3 h-3 text-green-500" /> Saved {lastSaved.toLocaleTimeString()}</>
            ) : ''}
          </span>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Switch checked={published} onCheckedChange={async (v) => {
              setPublished(v);
              if (v) {
                // Turn ON: publish draft → live (same as the Publish button)
                publishMutation.mutate();
              } else {
                // Turn OFF: unpublish without touching content
                await supabase.from('notes').update({ published: false }).eq('id', id!);
              }
            }} /> Published
          </label>
          <Button variant="outline" onClick={saveDraft} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Draft'}
          </Button>
          <Button onClick={() => publishMutation.mutate()} disabled={publishMutation.isPending} className="gap-2">
            <Save className="w-4 h-4" /> {note?.published ? 'Publish Changes' : 'Publish'}
          </Button>
        </div>
      </header>

      {/* Relations bar */}
      <NoteRelationsPanel noteId={id!} />

      {/* Editor fills all remaining height */}
      <div className="flex-1 min-h-0 overflow-hidden p-3 bg-muted/20">
        <ContentEditor content={content} onChange={setContent} minHeight="h-full" />
      </div>
    </div>
  );
}
