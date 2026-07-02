// NotePage.tsx
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Suspense, lazy, useEffect, useMemo, useState, useRef } from 'react';
import { getNoteBySlug, getNotesForSubject } from '@/services/contentService';
import Layout from '@/components/layout/Layout';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Crown, 
  ListTree, 
  Paperclip, 
  FileText, 
  Clock,
  ChevronRight,
  ChevronDown,
  Calendar,
  Share2,
  Bookmark,
  Eye,
  ThumbsUp,
  MessageCircle,
  ChevronUp,
  Copy,
  Check,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MarkdownRenderer = lazy(() => import('@/components/MarkdownRenderer'));
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

interface NoteResource {
  title: string;
  url: string;
  kind?: string;
}

// Used on the hero's right side whenever a note has no hero_image set —
// keeps the layout visually balanced instead of showing empty space.
const HeroFallbackIllustration = () => (
  <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center">
    <svg viewBox="0 0 400 300" className="w-4/5 h-4/5" fill="none">
      <path
        d="M20 220 C 80 40, 140 280, 200 150 S 320 40, 380 150"
        stroke="#93c5fd"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M20 150 C 90 260, 150 20, 220 150 S 330 260, 380 60"
        stroke="#fbbf24"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="200" cy="150" r="5" fill="#ffffff" />
      <circle cx="80" cy="120" r="3" fill="#93c5fd" opacity="0.7" />
      <circle cx="320" cy="90" r="3" fill="#fbbf24" opacity="0.7" />
      <text x="200" y="150" dy="-18" textAnchor="middle" fill="#e2e8f0" fontSize="15" fontFamily="serif" fontStyle="italic">
        f(x)
      </text>
    </svg>
  </div>
);

const NotePage = () => {
  const { subject, slug } = useParams<{ subject: string; slug: string }>();
  const [activeId, setActiveId] = useState<string>('');
  const [isTocFloatingOpen, setIsTocFloatingOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const tocButtonRef = useRef<HTMLButtonElement>(null);

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
  const heroImage = (note as unknown as { hero_image?: string })?.hero_image;

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

  // Scroll listener for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close TOC on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isTocFloatingOpen && tocButtonRef.current && !tocButtonRef.current.contains(e.target as Node)) {
        setIsTocFloatingOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isTocFloatingOpen]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      ? 'bg-emerald-500 text-white'
      : note.difficulty === 'Advanced'
      ? 'bg-rose-500 text-white'
      : 'bg-amber-500 text-white';

  // TOC Component
  const TocContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className="flex flex-col gap-0.5">
      {toc.map((entry) => (
        <a
          key={entry.id}
          href={`#${entry.id}`}
          onClick={() => setIsTocFloatingOpen(false)}
          className={cn(
            'group flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 text-sm',
            entry.level === 3 && 'ml-6',
            activeId === entry.id
              ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          )}
        >
          <span className={cn(
            'w-1 h-1 rounded-full transition-all duration-200',
            activeId === entry.id 
              ? 'bg-blue-600 w-2 h-2' 
              : 'bg-slate-300 group-hover:bg-slate-400'
          )} />
          <span className="flex-1 line-clamp-2">{entry.text}</span>
          {activeId === entry.id && (
            <ChevronRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          )}
        </a>
      ))}
    </nav>
  );

  const SidebarNav = (
    <>
      {toc.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-slate-600">
            <ListTree className="w-4 h-4" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Contents</h3>
          </div>
          <TocContent />
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 text-slate-600">
          <BookOpen className="w-4 h-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">{note.subjects?.name || subject}</h3>
        </div>
        <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {subjectNotes.map((n) => (
            <Link
              key={n.slug}
              to={`/notes/${subject}/${n.slug}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm',
                n.slug === slug
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <span className={cn(
                'w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all',
                n.slug === slug ? 'bg-white' : 'bg-slate-300 group-hover:bg-slate-400'
              )} />
              <span className="line-clamp-1 flex-1">{n.title}</span>
              {n.slug === slug && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
            </Link>
          ))}
        </div>
      </div>

      {resources.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-slate-600">
            <Paperclip className="w-4 h-4" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Resources</h3>
          </div>
          <div className="space-y-2">
            {resources.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all duration-200 group"
              >
                <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700 group-hover:text-blue-700 line-clamp-1 flex-1">
                  {r.title}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-blue-600">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <Layout>
      {/* Hero Section - Centered in viewport */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-b border-slate-200">
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
            <path d="M0 300 C 200 100, 400 500, 600 200 S 1000 450, 1200 150" stroke="#1e3a8a" strokeWidth="2" />
            <path d="M0 400 C 250 150, 450 550, 700 300 S 1100 500, 1200 250" stroke="#1e3a8a" strokeWidth="1.5" opacity="0.5" />
            <circle cx="200" cy="150" r="4" fill="#1e3a8a" opacity="0.3" />
            <circle cx="500" cy="450" r="3" fill="#1e3a8a" opacity="0.2" />
            <circle cx="800" cy="200" r="5" fill="#1e3a8a" opacity="0.3" />
            <circle cx="1050" cy="400" r="3" fill="#1e3a8a" opacity="0.2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-center">
            {/* Left: text content */}
            <div>
              {/* Meta Tags */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                  <BookOpen className="w-3.5 h-3.5" />
                  {note.subjects?.name || subject}
                </span>
                {note.difficulty && (
                  <span className={cn('px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider', difficultyClass)}>
                    {note.difficulty}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                  <Clock className="w-3.5 h-3.5" />
                  {readingMinutes} min read
                </span>
                {note.updated_at && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(note.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1]">
                {note.title}
              </h1>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 mt-6">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy link'}
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Right: hero image — fills the space that was reading as empty/off-center */}
            <div className="hidden lg:block">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg shadow-slate-900/10 border border-slate-200/70">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt={note.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <HeroFallbackIllustration />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ 
              width: toc.length > 0 
                ? `${(toc.findIndex(t => t.id === activeId) + 1) / toc.length * 100}%` 
                : '0%' 
            }}
          />
        </div>
      </section>

      {/* Main Content - Sidebar docked flush to the left edge of the viewport */}
      <div className="flex relative">
        {/* Desktop Sidebar - flush left, no centering wrapper around it */}
        <aside className="hidden lg:flex flex-col gap-6 p-6 h-[calc(100vh-4rem)] sticky top-16 w-72 shrink-0 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="flex-1 custom-scrollbar">
            {SidebarNav}
          </div>
          <div className="pt-6 mt-auto border-t border-slate-200">
            <Link to="/JMCPlus">
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                <Crown className="w-4 h-4" />
                Upgrade to Plus
              </button>
            </Link>
          </div>
        </aside>

        {/* Main Content Area - takes remaining space; reading content is centered within it, not the whole row */}
        <main className="flex-1 min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          {/* Mobile TOC Dropdown */}
          <div className="lg:hidden mb-6">
            <details className="group">
              <summary className="flex items-center justify-between w-full px-4 py-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <ListTree className="w-4 h-4 text-blue-600" />
                  Table of Contents
                  <span className="ml-2 text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {toc.length}
                  </span>
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl">
                <TocContent isMobile />
              </div>
            </details>
          </div>

          {/* Article */}
          <article ref={contentRef} className="max-w-3xl mx-auto">
            <Suspense fallback={<ContentSkeleton />}>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 sm:p-8 md:p-10">
                <MarkdownRenderer content={cleanContent} />
              </div>
            </Suspense>

            {/* Engagement Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700 transition-colors">
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmark</span>
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {Math.floor(Math.random() * 1000) + 100} views
                </span>
              </div>
            </div>

            {/* Prev/Next Navigation */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-200">
              {prevNote ? (
                <Link 
                  to={`/notes/${subject}/${prevNote.slug}`}
                  className="group flex flex-col p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all duration-200"
                >
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-blue-600 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Previous
                  </span>
                  <span className="font-medium text-slate-800 group-hover:text-blue-700 line-clamp-1 mt-1">
                    {prevNote.title}
                  </span>
                </Link>
              ) : <div />}
              
              {nextNote && (
                <Link 
                  to={`/notes/${subject}/${nextNote.slug}`}
                  className="group flex flex-col items-end p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all duration-200 sm:col-start-2"
                >
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-blue-600 transition-colors">
                    Next
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-medium text-slate-800 group-hover:text-blue-700 line-clamp-1 mt-1">
                    {nextNote.title}
                  </span>
                </Link>
              )}
            </nav>
          </article>
        </main>
      </div>

      {/* Floating TOC Button - Mobile */}
      {toc.length > 0 && (
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <button
            ref={tocButtonRef}
            onClick={() => setIsTocFloatingOpen(!isTocFloatingOpen)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200',
              isTocFloatingOpen && 'bg-blue-700'
            )}
          >
            <ListTree className="w-4 h-4" />
            <span className="text-sm font-medium">Contents</span>
          </button>

          {/* Floating TOC Popup */}
          {isTocFloatingOpen && (
            <div className="absolute bottom-16 right-0 w-72 max-h-[60vh] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-slide-up">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">On this page</span>
                  <button 
                    onClick={() => setIsTocFloatingOpen(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3 overflow-y-auto max-h-[calc(60vh-4rem)] custom-scrollbar">
                <TocContent isMobile />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          'fixed bottom-24 right-6 z-50 p-2.5 bg-white border border-slate-200 rounded-full shadow-md hover:shadow-lg hover:bg-slate-50 transition-all duration-300',
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <ChevronUp className="w-4 h-4 text-slate-600" />
      </button>

      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-slide-up {
            animation: slide-up 0.2s ease-out forwards;
          }
        `
      }} />
    </Layout>
  );
};

export default NotePage;