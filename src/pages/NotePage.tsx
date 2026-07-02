import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { getNoteBySlug, getNotesForSubject } from '@/services/contentService';
import Layout from '@/components/layout/Layout';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import { ArrowLeft, ArrowRight, BookOpen, Crown, ListTree, Paperclip, FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const MarkdownRenderer = lazy(() => import('@/components/MarkdownRenderer'));
// Reuse the exact same slugger the renderer uses to generate heading ids,
// so the Table of Contents links always resolve.
import { slugify } from '@/components/MarkdownRenderer';

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

// Pulls h2/h3 headings out of the raw markdown (skipping fenced code blocks)
// to build a Table of Contents before the markdown has even rendered.
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

// Optional attached resources for a note (worksheets, slides, datasets, etc).
// Wire this up to whatever field contentService actually returns —
// falls back to an empty list so the sidebar section just hides itself.
interface NoteResource {
  title: string;
  url: string;
  kind?: string;
}

const NotePage = () => {
  const { subject, slug } = useParams<{ subject: string; slug: string }>();
  const [activeId, setActiveId] = useState<string>('');

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

  const resources: NoteResource[] = (note as unknown as { resources?: NoteResource[] })?.resources ?? [];

  const readingMinutes = useMemo(() => {
    const words = cleanContent.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }, [cleanContent]);

  // Scrollspy: highlight whichever heading is currently in view.
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

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-20 pb-12">
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
            <h1 className="font-headline-h1 text-headline-h1 text-error">Note not found</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              The note <strong>{subject}/{slug}</strong> does not exist or has not been published.
            </p>
            <Link to="/library" className="text-secondary hover:underline font-body-md">← Back to Library</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const currentIndex = subjectNotes.findIndex((n) => n.slug === slug);
  const prevNote = currentIndex > 0 ? subjectNotes[currentIndex - 1] : null;
  const nextNote = currentIndex !== -1 && currentIndex < subjectNotes.length - 1 ? subjectNotes[currentIndex + 1] : null;

  const difficultyClass =
    note.difficulty === 'Beginner'
      ? 'bg-beginner-green text-white'
      : note.difficulty === 'Advanced'
      ? 'bg-advanced-red text-white'
      : 'bg-intermediate-yellow text-white';

  const SidebarNav = (
    <>
      {toc.length > 0 && (
        <div className="mb-stack-md">
          <div className="flex items-center gap-2 mb-3 text-on-surface-variant">
            <ListTree className="w-4 h-4" />
            <h3 className="font-label-caps text-label-caps tracking-widest uppercase">On this page</h3>
          </div>
          <nav className="flex flex-col gap-0.5 border-l border-outline-variant">
            {toc.map((entry) => (
              <a
                key={entry.id}
                href={`#${entry.id}`}
                className={cn(
                  'font-body-sm text-body-sm py-1.5 border-l-2 -ml-px transition-colors leading-snug',
                  entry.level === 3 ? 'pl-7' : 'pl-4',
                  activeId === entry.id
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-on-surface-variant hover:text-primary hover:border-outline'
                )}
              >
                {entry.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      <div className="mb-stack-md">
        <div className="flex items-center gap-2 mb-3 text-on-surface-variant">
          <BookOpen className="w-4 h-4" />
          <h3 className="font-label-caps text-label-caps tracking-widest uppercase">{note.subjects?.name || subject}</h3>
        </div>
        <nav className="flex flex-col gap-1">
          {subjectNotes.map((n) => (
            <Link
              key={n.slug}
              to={`/notes/${subject}/${n.slug}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-body-sm text-body-sm',
                n.slug === slug
                  ? 'bg-primary-fixed text-on-primary-fixed font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              <span className="line-clamp-1">{n.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {resources.length > 0 && (
        <div className="mb-stack-md">
          <div className="flex items-center gap-2 mb-3 text-on-surface-variant">
            <Paperclip className="w-4 h-4" />
            <h3 className="font-label-caps text-label-caps tracking-widest uppercase">Linked files</h3>
          </div>
          <div className="flex flex-col gap-2">
            {resources.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:border-primary hover:bg-surface-container-high transition-all group"
              >
                <FileText className="w-4 h-4 shrink-0 text-primary" />
                <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary line-clamp-1">
                  {r.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <Layout>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden border-b border-outline-variant bg-surface-container-low">
        <div
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: 'radial-gradient(#3f465c 0.5px, transparent 0.5px)', backgroundSize: '22px 22px', opacity: 0.12 }}
        />
        {/* Decorative plotted curve — the one signature flourish on the page */}
        <svg
          className="absolute -right-10 -bottom-16 w-[420px] h-[220px] -z-10 opacity-[0.07] pointer-events-none hidden sm:block"
          viewBox="0 0 420 220"
          fill="none"
        >
          <path d="M0 180 C 60 20, 120 220, 180 90 S 300 -10, 420 120" stroke="#1e3a8a" strokeWidth="2.5" />
          <line x1="0" y1="200" x2="420" y2="200" stroke="#1e3a8a" strokeWidth="1" />
          <line x1="20" y1="0" x2="20" y2="220" stroke="#1e3a8a" strokeWidth="1" />
        </svg>

        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop pt-10 pb-12 md:pt-14 md:pb-16">
          <nav className="flex items-center gap-2 mb-stack-sm text-on-surface-variant font-body-sm text-body-sm flex-wrap">
            <Link className="hover:text-primary transition-colors" to="/library">Library</Link>
            <span>›</span>
            <Link className="hover:text-primary transition-colors capitalize" to="/library">{note.subjects?.name || subject}</Link>
            <span>›</span>
            <span className="text-primary font-semibold line-clamp-1">{note.title}</span>
          </nav>

          <div className="flex items-center gap-stack-sm flex-wrap mb-4">
            <span className="font-label-caps text-label-caps tracking-widest uppercase text-primary">
              {note.subjects?.name || subject}
            </span>
            {note.difficulty && (
              <>
                <span className="text-outline">·</span>
                <span className={cn('px-3 py-1 rounded-full font-label-caps text-[10px] tracking-widest uppercase', difficultyClass)}>
                  {note.difficulty}
                </span>
              </>
            )}
            <span className="text-outline">·</span>
            <span className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
              <Clock className="w-3.5 h-3.5" />
              {readingMinutes} min read
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-primary leading-[1.05] max-w-3xl">
            {note.title}
          </h1>
        </div>
      </section>

      {/* ---------------- Body ---------------- */}
      <div className="flex max-w-container-max mx-auto">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col gap-stack-sm p-gutter h-[calc(100vh-64px)] sticky top-16 w-72 shrink-0 bg-surface-container-low border-r border-outline-variant overflow-y-auto">
          <div className="flex-1">{SidebarNav}</div>
          <div className="pt-stack-md mt-auto border-t border-outline-variant">
            <Link to="/JMCPlus">
              <button className="w-full bg-secondary text-on-secondary px-4 py-3 rounded-xl font-label-caps text-label-caps hover:opacity-80 transition-all flex items-center justify-center gap-2">
                <Crown className="w-4 h-4" />
                Upgrade to Plus
              </button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-margin-desktop py-stack-md min-h-screen relative">
          {/* Mobile-only TOC + linked files, collapsed by default */}
          <details className="md:hidden mb-stack-md rounded-xl border border-outline-variant bg-surface-container-low open:pb-4">
            <summary className="cursor-pointer list-none px-4 py-3 font-label-caps text-label-caps tracking-widest uppercase text-primary flex items-center gap-2">
              <ListTree className="w-4 h-4" />
              Contents &amp; files
            </summary>
            <div className="px-4">{SidebarNav}</div>
          </details>

          {/* Article Body */}
          <article className="max-w-3xl">
            <Suspense fallback={<ContentSkeleton />}>
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden p-6 sm:p-8">
                <MarkdownRenderer content={cleanContent} />
              </div>
            </Suspense>
          </article>

          {/* Prev/Next Navigation */}
          <nav className="flex flex-col sm:flex-row items-center justify-between gap-gutter border-t border-outline-variant pt-stack-lg mt-stack-lg max-w-3xl">
            {prevNote ? (
              <Link to={`/notes/${subject}/${prevNote.slug}`} className="w-full sm:w-auto">
                <div className="flex items-center gap-2 p-4 rounded-xl hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant group">
                  <ArrowLeft className="w-5 h-5 text-on-surface-variant group-hover:-translate-x-1 transition-transform" />
                  <div>
                    <div className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Previous</div>
                    <div className="font-headline-h3 text-headline-h3 text-primary line-clamp-1">{prevNote.title}</div>
                  </div>
                </div>
              </Link>
            ) : <div className="w-full sm:w-auto" />}

            {nextNote && (
              <Link to={`/notes/${subject}/${nextNote.slug}`} className="w-full sm:w-auto">
                <div className="flex items-center gap-2 p-4 rounded-xl hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant text-right group justify-end">
                  <div>
                    <div className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Next</div>
                    <div className="font-headline-h3 text-headline-h3 text-primary line-clamp-1">{nextNote.title}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )}
          </nav>
        </main>
      </div>
    </Layout>
  );
};

export default NotePage;
