import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Suspense, lazy, useEffect, useMemo, useState, useCallback } from 'react';
import { getTutorialBySlug, getTutorialsForSubject, type TutorialRow } from '@/services/contentService';
import Layout from '@/components/layout/Layout';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import MobileToolFab, { type FabMode } from '@/components/MobileToolFab';
import {
  ClipboardList,
  Timer,
  BarChart3,
  Target,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Wrench
} from 'lucide-react';

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
  const [progress, setProgress] = useState({ solved: 0, total: 0 });

  const { data: tutorial, isLoading, error } = useQuery({
    queryKey: ['tutorial', subject, slug],
    queryFn: () => getTutorialBySlug(subject!, slug!),
    enabled: !!subject && !!slug,
  });

  const { data: subjectTutorials = [] } = useQuery({
    queryKey: ['tutorials', subject],
    queryFn: () => getTutorialsForSubject(subject!),
    enabled: !!subject,
  });

  const cleanContent = useMemo(
    () => (tutorial ? stripLeadingDuplicateTitle(tutorial.content_md, tutorial.title) : ''),
    [tutorial]
  );

  useEffect(() => {
    setProgress({ solved: 0, total: 0 });
  }, [slug]);

  const handleProgress = useCallback((solved: number, total: number) => {
    setProgress({ solved, total });
  }, []);

  const navigationTutorials = useMemo(() => {
    const currentIndex = subjectTutorials.findIndex(t => t.slug === slug);
    return {
      currentIndex,
      prevTutorial: currentIndex > 0 ? subjectTutorials[currentIndex - 1] : null,
      nextTutorial: currentIndex > -1 && currentIndex < subjectTutorials.length - 1 ? subjectTutorials[currentIndex + 1] : null,
    };
  }, [subjectTutorials, slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-20 pb-12 max-w-[1400px] mx-auto px-6">
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
            <h1 className="text-3xl font-bold text-destructive">Tutorial not found</h1>
            <p className="text-muted-foreground">
              The tutorial <strong>{subject}/{slug}</strong> does not exist or has not been published.
            </p>
            <Link to="/tutorials" className="text-primary hover:underline">
              ← Back to Tutorials
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const pct = progress.total > 0 ? Math.round((progress.solved / progress.total) * 100) : 0;
  const questionsArray = Array.from({ length: progress.total }, (_, i) => i + 1);

  const renderProgressCard = () => (
    <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
      <h3 className="text-sm font-semibold">Overall Progress</h3>
      <div className="mt-5 flex items-center justify-center">
        <div className="relative h-28 w-28">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="8"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="var(--success)"
              strokeWidth="8"
              strokeDasharray="213.6"
              strokeDashoffset={213.6 - (pct / 100) * 213.6}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold leading-none">{pct}%</div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {progress.solved} of {progress.total} questions completed
      </div>
    </div>
  );

  const renderQuestionIndexCard = () => (
    <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
      <h3 className="text-sm font-semibold">Question Index</h3>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {questionsArray.map((q) => (
          <a
            key={q}
            href={`#problem-${q}`}
            className="flex h-9 items-center justify-center rounded-md border border-border text-xs font-semibold hover:bg-secondary/60 transition-colors"
          >
            {q}
          </a>
        ))}
      </div>
    </div>
  );

  const renderLessonCard = () =>
    tutorial.notes && (
      <div className="rounded-2xl bg-primary-soft p-5 ring-1 ring-primary/20">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <BookOpen className="h-4 w-4" />
          Review Lesson
        </div>
        <p className="mt-2 text-sm text-foreground/80">
          Stuck? Review the core concepts in the main notes before trying again.
        </p>
        <Link
          to={`/notes/${tutorial.subjects?.slug}/${tutorial.notes.slug}`}
          className="mt-3 inline-flex items-center justify-center w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Go to Notes
        </Link>
      </div>
    );

  const fabModes: [FabMode, FabMode] = [
    {
      key: 'progress',
      label: 'Progress',
      icon: <Target className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          {renderProgressCard()}
          {renderQuestionIndexCard()}
        </div>
      ),
    },
    {
      key: 'tools',
      label: 'Tools',
      icon: <Wrench className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          {renderLessonCard()}
          {!tutorial.notes && (
            <p className="text-sm text-muted-foreground">No linked lesson for this tutorial.</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="bg-background lg:h-[calc(100vh-5rem)] lg:overflow-hidden">
        <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-margin-mobile md:px-margin-desktop py-8 lg:h-full lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          {/* MAIN (independent scroll) */}
          <section className="space-y-6 min-w-0 lg:h-full lg:overflow-y-auto custom-scrollbar lg:pb-16 lg:pr-1">
            {/* Header */}
            <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    <ClipboardList className="h-4 w-4" />
                    Practice Tutorial
                  </div>
                  <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
                    {tutorial.title}
                  </h1>
                  <p className="mt-2 max-w-2xl text-muted-foreground">
                    {tutorial.description || "Apply what you learned. Attempt each question first, then reveal the worked solution to check your reasoning."}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Timer className="h-4 w-4 text-primary" /> {tutorial.duration_text || "~20 min"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BarChart3 className="h-4 w-4 text-primary" /> {tutorial.difficulty || "Mixed difficulty"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-primary" /> {progress.total} questions
                    </span>
                  </div>
                </div>

                {tutorial.notes && (
                  <Link
                    to={`/notes/${tutorial.subjects?.slug}/${tutorial.notes.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-soft px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/15 whitespace-nowrap"
                  >
                    <BookOpen className="h-4 w-4" />
                    Back to Notes
                  </Link>
                )}
              </div>
            </div>

            {/* Content Article (TutorialRenderer maps the questions) */}
            <Suspense fallback={<ContentSkeleton />}>
              <TutorialRenderer content={cleanContent} onProgress={handleProgress} />
            </Suspense>

            {/* Prev/Next Navigation */}
            <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
              {navigationTutorials.prevTutorial ? (
                <Link
                  to={`/tutorials/${subject}/${navigationTutorials.prevTutorial.slug}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-secondary/60 border border-border bg-card w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Previous Tutorial</div>
                    <div className="text-sm font-semibold line-clamp-1">{navigationTutorials.prevTutorial.title}</div>
                  </div>
                </Link>
              ) : (
                <div className="w-full sm:w-auto" />
              )}

              {navigationTutorials.nextTutorial && (
                <Link
                  to={`/tutorials/${subject}/${navigationTutorials.nextTutorial.slug}`}
                  className="flex items-center justify-end gap-3 rounded-lg px-3 py-2 text-right hover:bg-secondary/60 border border-border bg-card w-full sm:w-auto"
                >
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Next Tutorial</div>
                    <div className="text-sm font-semibold line-clamp-1">{navigationTutorials.nextTutorial.title}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              )}
            </nav>
          </section>

          {/* RIGHT SIDEBAR (independent scroll, hidden on mobile in favor of the floating button) */}
          <aside className="hidden lg:flex lg:h-full lg:flex-col lg:gap-4 lg:overflow-y-auto custom-scrollbar lg:pb-8 lg:pl-1">
            {renderProgressCard()}
            {renderQuestionIndexCard()}
            {renderLessonCard()}
          </aside>
        </main>
      </div>

      <MobileToolFab modes={fabModes} />
    </Layout>
  );
};

export default TutorialPage;
