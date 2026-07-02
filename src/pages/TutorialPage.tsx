import { useParams, Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { getTutorialBySlug, getTutorialsForSubject, TutorialRow } from '@/services/contentService';
import Layout from '@/components/layout/Layout';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';

const TutorialRenderer = lazy(() => import('@/components/TutorialRenderer'));

function stripLeadingDuplicateTitle(content: string, title: string) {
  if (!content) return content;
  const firstLine = content.trimStart().split('\n')[0]?.trim();
  if (firstLine && firstLine.replace(/^#+\s*/, '').trim().toLowerCase() === title.trim().toLowerCase()) {
    return content.trimStart().split('\n').slice(1).join('\n').trimStart();
  }
  return content;
}

const TutorialPage = () => {
  const { subject, slug } = useParams<{ subject: string; slug: string }>();

  // Fetch the current tutorial
  const { data: tutorial, isLoading, error } = useQuery({
    queryKey: ['tutorial', subject, slug],
    queryFn: () => getTutorialBySlug(subject!, slug!),
    enabled: !!subject && !!slug,
  });

  // Fetch all tutorials in this subject to determine prev/next
  const { data: subjectTutorials = [] } = useQuery({
    queryKey: ['tutorials', subject],
    queryFn: () => getTutorialsForSubject(subject!),
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

  if (error || !tutorial) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-red-500">Tutorial not found</h1>
            <p className="text-muted-foreground">
              The tutorial <strong>{subject}/{slug}</strong> does not exist or has not been published.
            </p>
            <Link to="/tutorials" className="text-blue-600 hover:underline">← Back to Tutorials</Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Determine Prev/Next
  const currentIndex = subjectTutorials.findIndex(t => t.slug === slug);
  const prevTutorial = currentIndex > 0 ? subjectTutorials[currentIndex - 1] : null;
  const nextTutorial = currentIndex !== -1 && currentIndex < subjectTutorials.length - 1 ? subjectTutorials[currentIndex + 1] : null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <Link to="/tutorials" className="hover:text-primary transition-colors flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            Tutorials
          </Link>
          <span>/</span>
          <span className="capitalize">{tutorial.subjects?.name || subject}</span>
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">{tutorial.title}</span>
        </div>

        {/* Action Header */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
           <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">{tutorial.title}</h1>
           
           <div className="flex gap-3">
             {tutorial.notes && (
               <Link to={`/notes/${tutorial.subjects?.slug}/${tutorial.notes.slug}`}>
                 <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm font-medium">
                   <BookOpen className="w-4 h-4" />
                   Read Note
                 </div>
               </Link>
             )}
             {/* Note: We could fetch if a quiz exists dynamically in the future, for now link to standard ID format */}
             <Link to={`/quiz/${tutorial.slug}`}>
               <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                 Take Quiz
                 <ExternalLink className="w-4 h-4" />
               </div>
             </Link>
           </div>
        </div>

        {/* Content */}
        <Suspense fallback={<ContentSkeleton />}>
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
            <TutorialRenderer content={stripLeadingDuplicateTitle(tutorial.content_md, tutorial.title)} />
          </div>
        </Suspense>

        {/* Footer Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-8">
          {prevTutorial ? (
            <Link to={`/tutorials/${subject}/${prevTutorial.slug}`} className="w-full sm:w-auto">
              <div className="flex items-center gap-2 px-6 py-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group h-full">
                <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Previous Tutorial</div>
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{prevTutorial.title}</div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="w-full sm:w-auto"></div>
          )}

          {nextTutorial && (
            <Link to={`/tutorials/${subject}/${nextTutorial.slug}`} className="w-full sm:w-auto">
              <div className="flex items-center gap-2 px-6 py-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group h-full">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Next Tutorial</div>
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{nextTutorial.title}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default TutorialPage;
