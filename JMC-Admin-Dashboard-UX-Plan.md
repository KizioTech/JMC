# JMC Admin Dashboard — UX Overhaul Plan

Reviewed against the current code: `AdminLayout.tsx`, `NotesManager.tsx`, `NoteEditor.tsx`,
`ContentEditor.tsx`, `MathRichTextEditor.tsx`, `contentService.ts`. This plan builds on what's
already there rather than replacing it — the split editor/preview and mobile write/preview
toggle **already exist** inside `MathRichTextEditor.tsx`; they just need to be freed from the
cramped card layout and wired into a proper two-step flow.

---

## 1. Two-step note creation

**Current state:** `NotesManager.tsx` links straight to `/admin/notes/new`, which loads the full
editor form (title, slug, subject, content, publish switch) all at once — you're writing content
before the note even has an identity, and there's no way to link a tutorial or set prev/next
neighbors at all.

**New flow:**
- **Step 1 — Create dialog** (small modal, not a full page): Title → auto-slug → Subject. Submit
  creates a minimal row in `notes` and immediately navigates to the full-page editor.
- **Step 2 — Full-page editor**: everything else — content, tutorial link, previous/next note,
  publish state — happens here, autosave-friendly, no need to fill it all in one sitting.

This mirrors how most real CMSs (WordPress, Notion, Contentful) work: give the item an identity
first, then let editing be an open-ended session.

### Schema change needed

`notes` currently has no way to express "this note comes after that one" — only `sort_order`
within a subject, which is too blunt for an explicit series. Add:

```sql
-- migration: 20260703000000_note_series_links.sql
alter table notes
  add column if not exists previous_note_id uuid references notes(id) on delete set null,
  add column if not exists next_note_id     uuid references notes(id) on delete set null;

create index if not exists notes_previous_idx on notes (previous_note_id);
create index if not exists notes_next_idx     on notes (next_note_id);
```

Tutorial linking already has a home in the schema — `tutorials.note_id` — so no new column is
needed there. The editor just needs a UI that lets you pick from existing tutorials and writes to
*their* `note_id`, or leaves it null.

### Step 1 — Create dialog

```tsx
// src/components/admin/CreateNoteDialog.tsx
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

export default function CreateNoteDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const { data: subjects } = useQuery({ queryKey: ['subjects'], queryFn: getAllSubjects });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ title, slug, subject_id: subjectId, content_md: '', published: false }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: ['admin-notes'] });
      onOpenChange(false);
      navigate(`/admin/notes/${note.id}/edit`); // straight into the full-page editor
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Create Note</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => { setTitle(e.target.value); setSlug(slugify(e.target.value)); }} placeholder="e.g. Angular Measure" />
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!title || !slug || !subjectId || createMutation.isPending} onClick={() => createMutation.mutate()}>
            {createMutation.isPending ? 'Creating…' : 'Create & Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

`NotesManager.tsx` changes from a plain `<Link>` to opening this dialog:

```diff
- <Link to="/admin/notes/new">
-   <Button className="gap-2"><Plus className="w-4 h-4" /> Create Note</Button>
- </Link>
+ <Button className="gap-2" onClick={() => setCreateOpen(true)}>
+   <Plus className="w-4 h-4" /> Create Note
+ </Button>
+ <CreateNoteDialog open={createOpen} onOpenChange={setCreateOpen} />
```

---

## 2. Full-page editor (step 2)

**Current state:** `NoteEditor.tsx` renders inside `AdminLayout`'s padded `<Outlet />`, sharing
screen space with the sidebar and a `max-w-6xl` cap — the editor never gets more than roughly half
the viewport, on top of the split view `MathRichTextEditor` already tries to do internally.

**Change:** give the editor its own route, **outside** `AdminLayout`, so it can use the full
viewport. It keeps its own minimal header (back button, note title, save, publish) instead of the
dashboard chrome.

```tsx
// src/App.tsx — add as a top-level route, sibling to the /admin nested block, not inside it
const NoteEditorPage = lazy(() => import("./pages/admin/NoteEditorPage"));
...
<Route path="/admin/notes/:id/edit" element={<NoteEditorPage />} />
```

(Keep `/admin/notes/:id` pointing at a lightweight redirect or drop it — `/edit` is now the only
real editor route, reached via the create dialog or an "Edit" button in `NotesManager`.)

```tsx
// src/pages/admin/NoteEditorPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { getAllSubjects, getAllAdminNotes } from '@/services/contentService';
import ContentEditor from '@/components/admin/ContentEditor';
import NoteRelationsPanel from '@/components/admin/NoteRelationsPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';

export default function NoteEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: note, isLoading } = useQuery({
    queryKey: ['admin-note', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('notes').select('*').eq('id', id!).single();
      if (error) throw error;
      return data;
    },
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (note) { setTitle(note.title); setContent(note.content_md || ''); setPublished(note.published); }
  }, [note]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('notes')
        .update({ title, content_md: content, published, updated_at: new Date().toISOString() })
        .eq('id', id!);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-notes', 'admin-note', id] }),
  });

  if (isLoading) return <div className="p-6">Loading…</div>;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Slim top bar — not the dashboard chrome */}
      <header className="h-14 shrink-0 border-b flex items-center justify-between px-4 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/notes')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-none text-lg font-semibold h-9 px-2 max-w-md"
          />
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={published} onCheckedChange={setPublished} /> Published
          </label>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-2">
            <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </header>

      {/* Relations bar: subject / tutorial link / prev / next — collapsible, sits above the editor */}
      <NoteRelationsPanel noteId={id!} />

      {/* Editor fills all remaining height; MathRichTextEditor already does
          split-pane on desktop and a write/preview toggle on mobile — it just
          needs full height now instead of a `min-h-[600px]` cap inside a card. */}
      <div className="flex-1 min-h-0 overflow-hidden p-3">
        <ContentEditor content={content} onChange={setContent} minHeight="h-full" />
      </div>
    </div>
  );
}
```

`ContentEditor`/`MathRichTextEditor` already accept `minHeight` — passing `"h-full"` and making
sure the wrapping container has a real height (`flex-1 min-h-0`) is enough for the existing
split-view and mobile-toggle logic to fill the page properly. No changes needed inside
`MathRichTextEditor.tsx` for this part.

### Relations panel (tutorial link + prev/next)

```tsx
// src/components/admin/NoteRelationsPanel.tsx
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
```

Each dropdown saves immediately on change (no separate "save relations" step) — content is saved
via the main Save button, but relations are cheap single-column updates so there's no reason to
make the user remember to save those too.

---

## 3. Image / link / video tools on the editor toolbar

**Current state:** `MathRichTextEditor.tsx`'s `mainButtons` array covers headings, bold, lists,
quote, and a table dialog — no image, link, or video insertion at all.

Add three buttons using the same `insertSyntax`/Dialog pattern the table button already uses:

```tsx
// inside MathRichTextEditor.tsx, near the existing table dialog state
const [linkOpen, setLinkOpen] = useState(false);
const [linkUrl, setLinkUrl] = useState('');
const [linkText, setLinkText] = useState('');

const [imageOpen, setImageOpen] = useState(false);
const [imageUrl, setImageUrl] = useState('');
const [imageAlt, setImageAlt] = useState('');

const [videoOpen, setVideoOpen] = useState(false);
const [videoUrl, setVideoUrl] = useState('');

const insertLink = () => { insertSyntax(`[${linkText || 'link'}](${linkUrl})`); setLinkOpen(false); setLinkUrl(''); setLinkText(''); };
const insertImage = () => { insertSyntax(`![${imageAlt}](${imageUrl})`); setImageOpen(false); setImageUrl(''); setImageAlt(''); };
const insertVideo = () => { insertSyntax(`\n\n<!-- video: ${videoUrl} -->\n\n`); setVideoOpen(false); setVideoUrl(''); };
```

```tsx
// add to mainButtons, alongside Heading2/Bold/List/etc.
{ icon: Link, label: "Link", tooltip: "Insert link", action: () => setLinkOpen(true) },
{ icon: Image, label: "Image", tooltip: "Insert image", action: () => setImageOpen(true) },
{ icon: Video, label: "Video", tooltip: "Embed video", action: () => setVideoOpen(true) },
```

Import `Link, Image, Video` from `lucide-react` alongside the existing icon imports.

Videos need one small addition to `MarkdownRenderer.tsx` — plain markdown has no video embed
syntax, so the `<!-- video: URL -->` marker inserted above needs to be turned into a real embed.
Cheapest approach: a small pre-processing regex before the markdown gets rendered, converting
YouTube/Vimeo links into an iframe:

```tsx
// src/components/MarkdownRenderer.tsx — add near the top of the render function
function embedVideoMarkers(md: string) {
  return md.replace(/<!--\s*video:\s*(\S+)\s*-->/g, (_, url) => {
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
    const embedUrl = yt ? `https://www.youtube.com/embed/${yt[1]}` : url;
    return `<div class="aspect-video my-4"><iframe src="${embedUrl}" class="w-full h-full rounded-lg" allowfullscreen></iframe></div>`;
  });
}
```

...and pass the result through `rehype-raw` (already a common pairing with `react-markdown`) so
the injected `<div>/<iframe>` actually renders instead of showing as literal text. If
`rehype-raw` isn't already a dependency, `npm install rehype-raw` and add it to the existing
`rehypePlugins` array in `MarkdownRenderer.tsx`.

**Media picker (optional but cheap given `media_assets` already exists):** in the Image dialog,
add a second tab that lists rows from `media_assets` (already backing `MediaManager.tsx`) so
editors can reuse previously uploaded images instead of pasting a URL each time:

```tsx
const { data: media } = useQuery({
  queryKey: ['media-assets'],
  queryFn: async () => {
    const { data, error } = await supabase.from('media_assets').select('*').eq('type', 'image');
    if (error) throw error;
    return data;
  },
});
// render `media` as a clickable thumbnail grid inside the image dialog; clicking sets imageUrl
```

---

## 4. Collapsible sidebar (icons-only) + mobile hamburger

**Current state:** `AdminLayout.tsx`'s sidebar is a fixed block (`w-full md:w-64`) that just
stacks full-width above the content on mobile — no hamburger, no collapse, and it eats a big
chunk of the small viewport permanently on phones. The project already ships a `Sheet` component
(`src/components/ui/sheet.tsx`, used nowhere yet) which is the natural fit for the mobile drawer.

```tsx
// src/pages/admin/AdminLayout.tsx (relevant changes only)
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronsLeft, ChevronsRight } from 'lucide-react';

const AdminLayout = () => {
  const { session, role, loading } = useAuth(); // role check per earlier fix
  const [collapsed, setCollapsed] = useState(false); // desktop icon-only mode
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return <div className="min-h-screen pt-20"><ContentSkeleton /></div>;
  if (!session) return <Navigate to="/auth" replace />;
  if (role !== 'admin') return <Navigate to="/" replace />;

  const Nav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-1 px-3">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
        return (
          <Link key={item.name} to={item.path} onClick={onNavigate}
            title={collapsed ? item.name : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            } ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar — collapsible to icons */}
      <aside className={`hidden md:flex flex-col border-r bg-card shrink-0 transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
        <div className="h-16 flex items-center px-4 border-b font-bold text-lg gap-2 justify-between">
          {!collapsed && <span><span className="text-primary">∑</span> Admin</span>}
          <button onClick={() => setCollapsed(c => !c)} className="text-muted-foreground hover:text-foreground">
            {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4"><Nav /></div>
      </aside>

      {/* Mobile: hamburger + slide-in Sheet drawer, no permanent sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="h-16 flex items-center px-6 border-b font-bold text-lg gap-2">
            <span className="text-primary">∑</span> Admin
          </div>
          <div className="py-4"><Nav onNavigate={() => setMobileOpen(false)} /></div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <SheetTrigger asChild className="md:hidden">
              <button onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
            </SheetTrigger>
            <h1 className="font-semibold text-lg">{/* ...unchanged title lookup... */}</h1>
          </div>
          {/* ...unchanged theme selector + user chip... */}
        </header>
        <div className="flex-1 overflow-auto bg-muted/20 p-4 md:p-6"><Outlet /></div>
      </main>
    </div>
  );
};
```

Note the `role !== 'admin'` check is folded in here — this is the same fix flagged in the
previous review (`AdminLayout` currently only checks `session`, not `role`), so implementing this
sidebar rework is a good moment to land that fix too, since you're touching this file anyway.

---

## 5. Draft saving

**Problem today:** `NoteEditorPage`'s single `saveMutation` writes straight to `content_md` —
the column the public site reads via `getNoteBySlug`. Editing an already-published note pushes
half-finished changes live the moment you click Save, with no way to work on a draft separately.

**Fix:** split live content from draft content at the schema level. The editor always reads and
writes the draft columns; publishing is an explicit action that copies draft → live.

```sql
-- migration: 20260704000000_note_drafts.sql
alter table notes
  add column if not exists draft_content_md text,
  add column if not exists draft_title      text,
  add column if not exists draft_saved_at   timestamptz,
  add column if not exists published_at     timestamptz;

-- backfill: existing notes start with their draft equal to their live content
update notes set draft_content_md = content_md, draft_title = title
  where draft_content_md is null;
```

`content_md` / `title` are untouched — that's what visitors see. `draft_content_md` /
`draft_title` is what the editor works against.

```tsx
// src/pages/admin/NoteEditorPage.tsx — two mutations instead of one

useEffect(() => {
  if (note) {
    setTitle(note.draft_title ?? note.title);
    setContent(note.draft_content_md ?? note.content_md ?? '');
  }
}, [note]);

const saveDraftMutation = useMutation({
  mutationFn: async () => {
    const { error } = await supabase.from('notes')
      .update({ draft_title: title, draft_content_md: content, draft_saved_at: new Date().toISOString() })
      .eq('id', id!);
    if (error) throw error;
  },
});

const publishMutation = useMutation({
  mutationFn: async () => {
    const { error } = await supabase.from('notes')
      .update({
        title, content_md: content,               // draft becomes live
        draft_title: title, draft_content_md: content,
        published: true, published_at: new Date().toISOString(),
      })
      .eq('id', id!);
    if (error) throw error;
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-notes', 'admin-note', id] }),
});

// Autosave: debounced draft save, 2s after typing stops
useEffect(() => {
  if (!note) return;
  const t = setTimeout(() => saveDraftMutation.mutate(), 2000);
  return () => clearTimeout(t);
}, [title, content]);
```

Header UI gets two distinct actions plus a save-status indicator, instead of one "Save" button:

```tsx
<div className="flex items-center gap-3 shrink-0">
  <span className="text-xs text-muted-foreground">
    {saveDraftMutation.isPending ? 'Saving draft…' :
     note?.draft_saved_at ? `Draft saved ${new Date(note.draft_saved_at).toLocaleTimeString()}` : ''}
  </span>
  <Button variant="outline" onClick={() => saveDraftMutation.mutate()} disabled={saveDraftMutation.isPending}>
    Save Draft
  </Button>
  <Button onClick={() => publishMutation.mutate()} disabled={publishMutation.isPending} className="gap-2">
    <Save className="w-4 h-4" /> {note?.published ? 'Publish Changes' : 'Publish'}
  </Button>
</div>
```

Behavior change to be aware of: a **published** note being edited keeps serving its old live
content to visitors until "Publish Changes" is clicked — intentional (no half-finished edits
leaking out), but different from today's instant-write behavior.

Apply the identical pattern to `TutorialEditor` (same `draft_content_md`/`draft_title` columns on
`tutorials`, same two-mutation split).

---

## 6. Public note-page regressions

Spotted from a live screenshot of `/notes/calculus/hyperbolic-functions` — these are bugs in the
**public-facing** `NotePage`/`TutorialPage`, not the admin dashboard, but worth fixing alongside
this work since they came up in the same review pass.

### 6a. Missing chapter sidebar

**Before the migration**, notes had a sidebar for navigating other notes in the same subject.
`NotePage.tsx` today is a single centered column (`max-w-4xl mx-auto`) with only a prev/next
footer — there's no persistent list of the subject's other notes, so orientation within a chapter
is lost. Nothing needs restoring from old code (the old static loader didn't build this either),
this needs to be built fresh, reusing the "group notes by subject" pattern already written in
`Library.tsx`.

```tsx
// src/components/NotesSidebar.tsx
import { Link } from 'react-router-dom';
import { NoteRow } from '@/services/contentService';

export default function NotesSidebar({
  subjectName, notes, currentSlug, subjectSlug,
}: { subjectName: string; notes: NoteRow[]; currentSlug: string; subjectSlug: string }) {
  return (
    <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{subjectName}</div>
      <nav className="space-y-1">
        {notes.map(n => (
          <Link
            key={n.id}
            to={`/notes/${subjectSlug}/${n.slug}`}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              n.slug === currentSlug
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {n.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

Wire it into `NotePage.tsx` — it already fetches `subjectNotes`, just needs a layout change from
one centered column to a sidebar + content row:

```diff
- <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
-   {/* breadcrumb, content, footer nav */}
- </div>
+ <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 flex gap-8">
+   <NotesSidebar
+     subjectName={note.subjects?.name || subject!}
+     notes={subjectNotes}
+     currentSlug={slug!}
+     subjectSlug={subject!}
+   />
+   <div className="flex-1 min-w-0">
+     {/* breadcrumb, content, footer nav — unchanged */}
+   </div>
+ </div>
```

On mobile, drop the sidebar (already handled by `hidden lg:block` above) and rely on the existing
prev/next footer buttons, or reuse the `Sheet` component from the admin sidebar work for a
"Chapter contents" drawer if you want mobile parity later.

### 6b. Breadcrumb/title showing the wrong note — data bug, not code

In the screenshot, the URL is `/notes/calculus/hyperbolic-functions` but both the breadcrumb and
the rendered content are for **Transcendental Functions**. `getNoteBySlug` filters correctly by
`slug` and `subjects.slug`, so this isn't a routing bug — it means the `notes` row whose `slug` is
`hyperbolic-functions` actually has `title`/`content_md` belonging to a different note (most
likely a copy-paste mistake while entering content in the admin editor, or a mixup during the
original migration script). This needs a manual data fix: open `/admin/notes`, find the
`hyperbolic-functions` row, and check whether its title/content match its slug — same for any
other note that might have been mismatched at the same time.

### 6c. Duplicate title heading

The rendered content also repeats the title twice ("Calculus II - Transcendental Functions"
appears as the page `<h1>` and again as a heading inside the card, underlined in red). That's
because the source markdown starts with its own `# Title` line, and `NotePage.tsx` *also* renders
`note.title` as a separate `<h1>` above the content. Strip a leading H1 from the markdown before
rendering if it duplicates the title, rather than editing every markdown file by hand:

```tsx
// src/pages/NotePage.tsx — before passing content_md to MarkdownRenderer
function stripLeadingDuplicateTitle(content: string, title: string) {
  const firstLine = content.trimStart().split('\n')[0]?.trim();
  if (firstLine && firstLine.replace(/^#+\s*/, '').trim().toLowerCase() === title.trim().toLowerCase()) {
    return content.trimStart().split('\n').slice(1).join('\n').trimStart();
  }
  return content;
}

// usage:
<MarkdownRenderer content={stripLeadingDuplicateTitle(note.content_md, note.title)} />
```

Apply the same helper in `TutorialPage.tsx`, since `TutorialLoader`'s old markdown files likely
have the same leading-`#`-title pattern.

---

## 7. Rollout order

1. Fix the two public-page bugs first (6b data check, 6c duplicate-title strip) — they're visible
   to every visitor right now and are quick, isolated fixes.
2. Add the `NotesSidebar` (6a) — pure UI addition, no schema change.
3. Run the `previous_note_id`/`next_note_id` migration.
4. Run the `draft_content_md`/`draft_title` migration (section 5).
5. Add the `role` field to `AuthContext` (per the earlier security review) and wire the check into
   `AdminLayout` while you're already restructuring it for the sidebar.
6. Ship the collapsible sidebar + mobile `Sheet` drawer — pure UI, no data changes.
7. Add `CreateNoteDialog`, point `NotesManager`'s "Create Note" button at it.
8. Build `NoteEditorPage` + `NoteRelationsPanel` with the draft/publish split, add the new
   `/admin/notes/:id/edit` route.
9. Add the link/image/video toolbar buttons and the `MarkdownRenderer` video-embed handling.
10. Repeat steps 7–9 for `TutorialEditor` — same shape as `NoteEditor`, same two-step pattern,
    full-page layout, and draft/publish split apply directly (minus the prev/next note fields,
    which are specific to notes).
