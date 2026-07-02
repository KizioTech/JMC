import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { getNoteBySlug, getNotesForSubject } from '@/services/contentService';
import Layout from '@/components/layout/Layout';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import { ArrowLeft, ArrowRight, BookOpen, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const MarkdownRenderer = lazy(() => import('@/components/MarkdownRenderer'));

function stripLeadingDuplicateTitle(content: string, title: string) {
  if (!content) return content;
  const firstLine = content.trimStart().split('\n')[0]?.trim();
  if (firstLine && firstLine.replace(/^#+\s*/, '').trim().toLowerCase() === title.trim().toLowerCase()) {
    return content.trimStart().split('\n').slice(1).join('\n').trimStart();
  }
  return content;
}

const NotePage = () => {
  const { subject, slug } = useParams<{ subject: string; slug: string }>();

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

  const currentIndex = subjectNotes.findIndex(n => n.slug === slug);
  const prevNote = currentIndex > 0 ? subjectNotes[currentIndex - 1] : null;
  const nextNote = currentIndex !== -1 && currentIndex < subjectNotes.length - 1 ? subjectNotes[currentIndex + 1] : null;

  return (
    <Layout>
      <div className="flex max-w-container-max mx-auto">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col gap-stack-sm p-gutter h-[calc(100vh-64px)] sticky top-16 w-64 bg-surface-container-low border-r border-outline-variant overflow-y-auto">
          <div className="mb-stack-md">
            <h2 className="font-headline-h3 text-headline-h3 text-primary">{note.subjects?.name || subject}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Library Notes</p>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            {subjectNotes.map((n) => (
              <Link
                key={n.slug}
                to={`/notes/${subject}/${n.slug}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group font-label-caps text-label-caps",
                  n.slug === slug
                    ? "bg-primary-fixed text-on-primary-fixed font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                <BookOpen className="w-5 h-5 shrink-0" />
                <span className="line-clamp-1">{n.title}</span>
              </Link>
            ))}
          </nav>
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
        <main className="flex-1 px-4 md:px-margin-desktop py-stack-md min-h-screen relative overflow-hidden">
          <div className="absolute inset-0 -z-10" style={{ backgroundImage: "radial-gradient(#3f465c 0.5px, transparent 0.5px)", backgroundSize: "24px 24px", opacity: 0.1 }}></div>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-stack-sm text-on-surface-variant font-body-sm text-body-sm flex-wrap">
            <Link className="hover:text-primary transition-colors" to="/library">Library</Link>
            <span>›</span>
            <Link className="hover:text-primary transition-colors capitalize" to="/library">{note.subjects?.name || subject}</Link>
            <span>›</span>
            <span className="text-primary font-semibold line-clamp-1">{note.title}</span>
          </nav>

          {/* Content Header */}
          <div className="mb-stack-lg">
            <h1 className="font-headline-h1 text-headline-h1 text-primary mb-3">{note.title}</h1>
            <div className="flex items-center gap-stack-sm flex-wrap">
              <span className="font-label-caps text-label-caps text-on-surface-variant">{note.subjects?.name}</span>
              {note.difficulty && (
                <>
                  <span className="text-outline">·</span>
                  <span className={cn("px-3 py-1 rounded-full font-label-caps text-[10px] tracking-widest uppercase",
                    note.difficulty === 'Beginner' ? "bg-beginner-green text-white" :
                    note.difficulty === 'Advanced' ? "bg-advanced-red text-white" :
                    "bg-intermediate-yellow text-white"
                  )}>
                    {note.difficulty}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Article Body */}
          <article className="max-w-3xl">
            <Suspense fallback={<ContentSkeleton />}>
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <MarkdownRenderer content={stripLeadingDuplicateTitle(note.content_md, note.title)} />
                </div>
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
