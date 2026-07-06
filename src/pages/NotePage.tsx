import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { getNoteBySlug, getNotesForSubject } from '@/services/contentService';
import Layout from '@/components/layout/Layout';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import MobileToolFab, { type FabMode } from '@/components/MobileToolFab';
import {
  Menu,
  ChevronRight,
  Clock,
  BarChart3,
  CalendarDays,
  Bookmark,
  Star,
  Printer,
  Download,
  Share2,
  Moon,
  Pencil,
  Plus,
  Lightbulb,
  Bot,
  ArrowLeft,
  ArrowRight,
  Grid3x3,
  ListTree,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { slugify } from '@/components/MarkdownRenderer';

const MarkdownRenderer = lazy(() => import('@/components/MarkdownRenderer'));

function stripLeadingDuplicateTitle(content: string, title: string) {
  if (!content) return content;
  const firstLine = content.trimStart().split('\n')[0]?.trim();
  if (firstLine && firstLine.replace(/^#+\s*/, '').trim().toLowerCase() === title.trim().toLowerCase()) {
    return content.trimStart().split('\n').slice(1).join('\n').trimStart();
  }
  return content;
}

interface TocEntry {
  level: 2 | 3;
  text: string;
  id: string;
}

interface TocNode extends TocEntry {
  children: TocEntry[];
}

function extractToc(md: string): TocEntry[] {
  if (!md) return [];
  const entries: TocEntry[] = [];
  let inFence = false;
  for (const rawLine of md.split('\n')) {
    const line = rawLine.trim();
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (match) {
      const level = match[1].length as 2 | 3;
      const text = match[2].replace(/[*_`$]/g, '').trim();
      if (text) entries.push({ level, text, id: slugify(text) });
    }
  }
  return entries;
}

// Groups the flat heading list into h2 sections with their h3 children
// nested underneath, so the sidebar TOC can be collapsed section-by-section.
function buildTocTree(flat: TocEntry[]): TocNode[] {
  const tree: TocNode[] = [];
  let current: TocNode | null = null;
  for (const item of flat) {
    if (item.level === 2) {
      current = { ...item, children: [] };
      tree.push(current);
    } else if (current) {
      current.children.push(item);
    } else {
      // An h3 with no preceding h2 — surface it as its own top-level entry.
      tree.push({ ...item, children: [] });
    }
  }
  return tree;
}

function NotePage() {
  const { subject, slug } = useParams<{ subject: string; slug: string }>();
  const [activeId, setActiveId] = useState<string>('');
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', subject, slug],
    queryFn: () => getNoteBySlug(subject!, slug!),
    enabled: !!subject && !!slug,
  });

  const { data: subjectNotes = [] } = useQuery({
    queryKey: ['notes', subject],
    queryFn: () => getNotesForSubject(subject!),
    enabled: !!subject,
  });

  const cleanContent = useMemo(
    () => (note ? stripLeadingDuplicateTitle(note.content_md, note.title) : ''),
    [note]
  );

  const toc = useMemo(() => extractToc(cleanContent), [cleanContent]);
  const tocTree = useMemo(() => buildTocTree(toc), [toc]);

  // Maps an h3 id to its parent h2 id, so we can auto-expand a collapsed
  // section when scrollspy activates one of its children.
  const tocParentMap = useMemo(() => {
    const map: Record<string, string> = {};
    let currentParent = '';
    for (const item of toc) {
      if (item.level === 2) currentParent = item.id;
      else if (currentParent) map[item.id] = currentParent;
    }
    return map;
  }, [toc]);

  const toggleTocSection = (id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const heroImage = (note as any)?.cover_image || (note as any)?.hero_image;

  const readingMinutes = useMemo(() => {
    const words = cleanContent.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }, [cleanContent]);

  // Scrollspy
  useEffect(() => {
    if (!toc.length) return;
    const headingEls = toc
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => !!el);
    if (!headingEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-112px 0px -70% 0px', threshold: 0 }
    );

    headingEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc, note]);

  // Keep the active heading's section expanded even if the user had
  // collapsed it earlier.
  useEffect(() => {
    if (!activeId) return;
    const parentId = tocParentMap[activeId];
    if (!parentId) return;
    setCollapsedIds((prev) => {
      if (!prev.has(parentId)) return prev;
      const next = new Set(prev);
      next.delete(parentId);
      return next;
    });
  }, [activeId, tocParentMap]);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-20 pb-12 max-w-7xl mx-auto px-4">
          <ContentSkeleton />
        </div>
      </Layout>
    );
  }

  if (error || !note) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-destructive">Note not found</h1>
            <p className="text-muted-foreground">The note <strong>{subject}/{slug}</strong> does not exist or has not been published.</p>
            <Link to="/library" className="text-primary hover:underline">← Back to Library</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const currentIndex = subjectNotes.findIndex((n) => n.slug === slug);
  const prevNote = currentIndex > 0 ? subjectNotes[currentIndex - 1] : null;
  const nextNote = currentIndex !== -1 && currentIndex < subjectNotes.length - 1 ? subjectNotes[currentIndex + 1] : null;

  const renderTocList = () => (
    <ul className="space-y-0.5 text-sm">
      {tocTree.map((node) => {
        const isActive = node.id === activeId;
        const hasChildren = node.children.length > 0;
        const isCollapsed = collapsedIds.has(node.id);
        return (
          <li key={node.id}>
            <div className="flex items-center gap-0.5">
              <a
                href={`#${node.id}`}
                className={
                  "flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors " +
                  (isActive
                    ? "border-l-2 border-primary bg-primary-soft font-semibold text-primary"
                    : "text-foreground hover:bg-secondary/60")
                }
              >
                <span className="flex-1 line-clamp-2">{node.text}</span>
              </a>
              {hasChildren && (
                <button
                  type="button"
                  onClick={() => toggleTocSection(node.id)}
                  aria-expanded={!isCollapsed}
                  aria-label={isCollapsed ? `Expand ${node.text}` : `Collapse ${node.text}`}
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                >
                  <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", !isCollapsed && "rotate-90")} />
                </button>
              )}
            </div>
            {hasChildren && !isCollapsed && (
              <ul className="ml-4 space-y-0.5 border-l border-border pl-2">
                {node.children.map((child) => {
                  const childActive = child.id === activeId;
                  return (
                    <li key={child.id}>
                      <a
                        href={`#${child.id}`}
                        className={
                          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors " +
                          (childActive
                            ? "border-l-2 border-primary bg-primary-soft font-semibold text-primary"
                            : "text-foreground hover:bg-secondary/60")
                        }
                      >
                        <span className="flex-1 line-clamp-2">{child.text}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
      {tocTree.length === 0 && (
        <li className="text-muted-foreground text-xs italic">No headings found.</li>
      )}
    </ul>
  );

  const renderToolsPanel = () => (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Lesson Progress
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: toc.length > 0 ? `${(toc.findIndex(t => t.id === activeId) + 1) / toc.length * 100}%` : '0%' }}
          />
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Pencil className="h-4 w-4 text-primary" />
            My Notes
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">You haven't added any notes yet.</p>
        <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Note
        </button>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-semibold">Quick Actions</h3>
        <ul className="mt-3 space-y-1 text-sm">
          <ActionRow icon={<Star className="h-4 w-4" />} label="Bookmark this lesson" />
          <ActionRow icon={<Printer className="h-4 w-4" />} label="Print" />
          <ActionRow icon={<Download className="h-4 w-4 text-success" />} label="Download PDF" />
          <ActionRow icon={<Share2 className="h-4 w-4" />} label="Share" />
          <ActionRow icon={<Moon className="h-4 w-4" />} label="Toggle Dark Mode" />
        </ul>
      </div>

      {subjectNotes.length > 0 && (
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold">Continue Learning</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {subjectNotes.slice(0, 6).map((n) => (
              <li key={n.slug}>
                <Link to={`/notes/${subject}/${n.slug}`} className="flex w-full items-center gap-3 rounded-md px-2 py-2 hover:bg-secondary/60 group">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                    <Bookmark className="h-3 w-3" />
                  </span>
                  <span className="flex-1 text-left line-clamp-1 group-hover:text-primary transition-colors">{n.title}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl bg-warning-soft p-4 ring-1 ring-warning/30">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Lightbulb className="h-4 w-4 text-warning" />
          Tip of the Day
        </div>
        <p className="mt-2 text-sm text-foreground/80">
          Regularly practice with tutorials after reading notes to reinforce your learning!
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ai-soft to-card p-4 ring-1 ring-ai/20">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div className="text-sm font-semibold">AI Study Companion</div>
          <span className="ml-auto rounded-full bg-ai px-2 py-0.5 text-[9px] font-bold text-white">
            BETA
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Ask questions, get examples, or generate practice questions.
        </p>
        <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Bot className="h-4 w-4" /> Start Chat
        </button>
        <Bot className="absolute -bottom-4 -right-4 h-20 w-20 text-ai/20" />
      </div>
    </div>
  );

  const fabModes: [FabMode, FabMode] = [
    { key: 'contents', label: 'Contents', icon: <Menu className="h-4 w-4" />, content: renderTocList() },
    { key: 'tools', label: 'Tools', icon: <Wrench className="h-4 w-4" />, content: renderToolsPanel() },
  ];

  return (
    <Layout>
      <div className="bg-background lg:h-[calc(100vh-5rem)] lg:overflow-hidden">
        <main className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 px-margin-mobile md:px-margin-desktop py-6 lg:h-full lg:grid-cols-[260px_minmax(0,1fr)_320px] lg:items-start">
          {/* LEFT SIDEBAR — TOC (independent scroll, hidden on mobile in favor of the floating button) */}
          <aside className="hidden lg:flex lg:h-full lg:flex-col lg:gap-4 lg:overflow-y-auto custom-scrollbar lg:pb-8 lg:pr-1">
            <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Menu className="h-4 w-4" />
                Table of Contents
              </div>
              {renderTocList()}
            </div>

            <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Lesson Progress
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: toc.length > 0 ? `${(toc.findIndex(t => t.id === activeId) + 1) / toc.length * 100}%` : '0%' }}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Pencil className="h-4 w-4 text-primary" />
                  My Notes
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">You haven't added any notes yet.</p>
              <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Add Note
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT (independent scroll) */}
          <section className="space-y-6 lg:h-full lg:overflow-y-auto custom-scrollbar lg:pb-8">
            {/* Header */}
            <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_260px]">
                <div>
                  <h1 className="text-3xl font-bold leading-tight md:text-4xl">{note.title}</h1>
                  <p className="mt-2 text-muted-foreground">
                    Comprehensive study material on {note.title}.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" /> {readingMinutes} min read
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BarChart3 className="h-4 w-4 text-primary" /> {note.difficulty || "Beginner"}
                    </span>
                    {note.updated_at && (
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-primary" /> 
                        Updated: {new Date(note.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="rounded-xl bg-primary-soft p-3 relative flex items-center justify-center overflow-hidden min-h-[140px]">
                  {heroImage ? (
                    <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                  ) : (
                    <ListTree className="w-16 h-16 text-primary/30" />
                  )}
                </div>
              </div>
            </div>

            {/* Content Article */}
            <article className="space-y-4 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
              <Suspense fallback={<ContentSkeleton />}>
                <MarkdownRenderer content={cleanContent} />
              </Suspense>
              
              <Link
                to={`/tutorials/${subject}/${slug}`}
                className="mt-8 flex items-center justify-between gap-4 rounded-xl bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                    Ready to Practice?
                  </div>
                  <div className="mt-1 text-lg font-bold">
                    Try the {note.title} tutorial
                  </div>
                  <div className="mt-1 text-sm opacity-90">
                    Practice questions with worked solutions.
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 shrink-0" />
              </Link>
            </article>

            {/* Bottom Nav */}
            <div className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3">
              {prevNote ? (
                <Link to={`/notes/${subject}/${prevNote.slug}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-secondary/60">
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Previous Topic</div>
                    <div className="text-sm font-semibold line-clamp-1">{prevNote.title}</div>
                  </div>
                </Link>
              ) : <div />}
              
              <Link to={`/library`} className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-soft">
                <Grid3x3 className="h-4 w-4" />
                Library
              </Link>

              {nextNote ? (
                <Link to={`/notes/${subject}/${nextNote.slug}`} className="flex items-center justify-end gap-3 rounded-lg px-3 py-2 text-right hover:bg-secondary/60">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Next Topic</div>
                    <div className="text-sm font-semibold line-clamp-1">{nextNote.title}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ) : <div />}
            </div>
          </section>

          {/* RIGHT SIDEBAR (independent scroll, hidden on mobile in favor of the floating button) */}
          <aside className="hidden lg:flex lg:h-full lg:flex-col lg:gap-4 lg:overflow-y-auto custom-scrollbar lg:pb-8 lg:pl-1">
            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <h3 className="text-sm font-semibold">Quick Actions</h3>
              <ul className="mt-3 space-y-1 text-sm">
                <ActionRow icon={<Star className="h-4 w-4" />} label="Bookmark this lesson" />
                <ActionRow icon={<Printer className="h-4 w-4" />} label="Print" />
                <ActionRow
                  icon={<Download className="h-4 w-4 text-success" />}
                  label="Download PDF"
                />
                <ActionRow icon={<Share2 className="h-4 w-4" />} label="Share" />
                <ActionRow icon={<Moon className="h-4 w-4" />} label="Toggle Dark Mode" />
              </ul>
            </div>

            {subjectNotes.length > 0 && (
              <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
                <h3 className="text-sm font-semibold">Continue Learning</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {subjectNotes.slice(0, 6).map((n) => (
                    <li key={n.slug}>
                      <Link to={`/notes/${subject}/${n.slug}`} className="flex w-full items-center gap-3 rounded-md px-2 py-2 hover:bg-secondary/60 group">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                          <Bookmark className="h-3 w-3" />
                        </span>
                        <span className="flex-1 text-left line-clamp-1 group-hover:text-primary transition-colors">{n.title}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl bg-warning-soft p-5 ring-1 ring-warning/30">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-warning" />
                Tip of the Day
              </div>
              <p className="mt-2 text-sm text-foreground/80">
                Regularly practice with tutorials after reading notes to reinforce your learning!
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ai-soft to-card p-5 ring-1 ring-ai/20">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="text-sm font-semibold">AI Study Companion</div>
                <span className="ml-auto rounded-full bg-ai px-2 py-0.5 text-[9px] font-bold text-white">
                  BETA
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Ask questions, get examples, or generate practice questions.
              </p>
              <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Bot className="h-4 w-4" /> Start Chat
              </button>
              <Bot className="absolute -bottom-4 -right-4 h-20 w-20 text-ai/20" />
            </div>
          </aside>
        </main>
      </div>

      <MobileToolFab modes={fabModes} />
    </Layout>
  );
}

function ActionRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li>
      <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-secondary/60">
        <span className="text-primary">{icon}</span>
        <span>{label}</span>
      </button>
    </li>
  );
}

export default NotePage;
