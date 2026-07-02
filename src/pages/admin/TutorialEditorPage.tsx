import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import ContentEditor from '@/components/admin/ContentEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

const AUTOSAVE_INTERVAL_MS = 30_000; // 30 seconds

export default function TutorialEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Only fetch once on mount — never re-fetches, so DB data never stomps on local state
  const { data: tutorial, isLoading } = useQuery({
    queryKey: ['admin-tutorial', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('tutorials').select('*').eq('id', id!).single();
      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
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
    if (tutorial && !hasInitialized.current) {
      hasInitialized.current = true;
      setTitle(tutorial.draft_title ?? tutorial.title);
      setContent(tutorial.draft_content_md ?? tutorial.content_md ?? '');
      setPublished(tutorial.published);
      if (tutorial.draft_saved_at) setLastSaved(new Date(tutorial.draft_saved_at));
    }
  }, [tutorial]);

  // Keep latest values in refs so the interval always reads current without being a dep
  const latestTitle = useRef(title);
  const latestContent = useRef(content);
  useEffect(() => { latestTitle.current = title; }, [title]);
  useEffect(() => { latestContent.current = content; }, [content]);

  const saveDraft = useCallback(async () => {
    if (!id || !hasInitialized.current) return;
    setIsSaving(true);
    try {
      await supabase.from('tutorials').update({
        draft_title: latestTitle.current,
        draft_content_md: latestContent.current,
        draft_saved_at: new Date().toISOString(),
      }).eq('id', id);
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  }, [id]);

  // Fixed-interval autosave — completely independent of keystrokes
  useEffect(() => {
    if (!tutorial) return;
    const interval = setInterval(saveDraft, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [tutorial, saveDraft]);

  const publishMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('tutorials')
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
      queryClient.invalidateQueries({ queryKey: ['admin-tutorials'] });
    },
  });

  if (isLoading) return <div className="p-6">Loading…</div>;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Slim top bar */}
      <header className="h-14 shrink-0 border-b flex items-center justify-between px-4 gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Button variant="ghost" size="icon" onClick={() => {
            saveDraft();
            navigate('/admin/tutorials');
          }}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-none text-lg font-semibold h-9 px-2 max-w-md w-full"
            placeholder="Tutorial Title"
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
              if (!v) {
                await supabase.from('tutorials').update({ published: false }).eq('id', id!);
              }
            }} /> Published
          </label>
          <Button variant="outline" onClick={saveDraft} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Draft'}
          </Button>
          <Button onClick={() => publishMutation.mutate()} disabled={publishMutation.isPending} className="gap-2">
            <Save className="w-4 h-4" /> {tutorial?.published ? 'Publish Changes' : 'Publish'}
          </Button>
        </div>
      </header>

      {/* Editor fills all remaining height */}
      <div className="flex-1 min-h-0 overflow-hidden p-3 bg-muted/20">
        <ContentEditor content={content} onChange={setContent} minHeight="h-full" />
      </div>
    </div>
  );
}
