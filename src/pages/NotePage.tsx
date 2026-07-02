import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { getNoteBySlug, getNotesForSubject, NoteRow } from '@/services/contentService';
import Layout from '@/components/layout/Layout';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import NotesSidebar from '@/components/NotesSidebar';

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

  // Fetch the current note
  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', subject, slug],
    queryFn: () => getNoteBySlug(subject!, slug!),
    enabled: !!subject && !!slug,
  });

  // Fetch all notes in this subject to determine prev/next
  const { data: subjectNotes = [] } = useQuery({
    queryKey: ['notes', subject],
    queryFn: () => getNotesForSubject(subject!),
    enabled: !!subject,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-24 pb-12">
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
            <h1 className="text-2xl font-bold text-red-500">Note not found</h1>
            <p className="text-muted-foreground">
              The note <strong>{subject}/{slug}</strong> does not exist or has not been published.
            </p>
            <Link to="/library" className="text-blue-600 hover:underline">← Back to Library</Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Determine Prev/Next
  const currentIndex = subjectNotes.findIndex(n => n.slug === slug);
  const prevNote = currentIndex > 0 ? subjectNotes[currentIndex - 1] : null;
  const nextNote = currentIndex !== -1 && currentIndex < subjectNotes.length - 1 ? subjectNotes[currentIndex + 1] : null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 flex gap-8">
        
        <NotesSidebar
          subjectName={note.subjects?.name || subject!}
          notes={subjectNotes}
          currentSlug={slug!}
          subjectSlug={subject!}
        />

        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/library" className="hover:text-primary transition-colors flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Library
            </Link>
            <span>/</span>
            <span className="capitalize">{note.subjects?.name || subject}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{note.title}</span>
          </div>

        {/* Content */}
        <Suspense fallback={<ContentSkeleton />}>
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6 sm:p-10">
             <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-foreground">{note.title}</h1>
             <div className="prose prose-slate dark:prose-invert max-w-none">
               <MarkdownRenderer content={stripLeadingDuplicateTitle(note.content_md, note.title)} />
             </div>
          </div>
        </Suspense>

        {/* Footer Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-8">
          {prevNote ? (
            <Link to={`/notes/${subject}/${prevNote.slug}`} className="w-full sm:w-auto">
              <div className="flex items-center gap-2 px-6 py-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group">
                <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Previous Note</div>
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{prevNote.title}</div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="w-full sm:w-auto"></div>
          )}

          {nextNote && (
            <Link to={`/notes/${subject}/${nextNote.slug}`} className="w-full sm:w-auto">
              <div className="flex items-center gap-2 px-6 py-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Next Note</div>
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{nextNote.title}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          )}
        </div>

        </div>
      </div>
    </Layout>
  );
};

export default NotePage;
