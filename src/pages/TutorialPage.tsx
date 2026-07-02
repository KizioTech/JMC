import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Suspense, lazy, useMemo } from 'react';
import { getTutorialBySlug, getTutorialsForSubject } from '@/services/contentService';
import Layout from '@/components/layout/Layout';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Crown, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const TutorialRenderer = lazy(() => import('@/components/TutorialRenderer'));

// Configuration
const UPGRADE_PATH = '/JMCPlus';

// Utility Functions
function stripLeadingDuplicateTitle(content: string, title: string) {
  if (!content) return content;
  const firstLine = content.trimStart().split('\n')[0]?.trim();
  if (firstLine && firstLine.replace(/^#+\s*/, '').trim().toLowerCase() === title.trim().toLowerCase()) {
    return content.trimStart().split('\n').slice(1).join('\n').trimStart();
  }
  return content;
}

const getDifficultyStyle = (difficulty?: string | null) => {
  switch (difficulty) {
    case "Beginner": return "bg-beginner-green text-white";
    case "Intermediate": return "bg-intermediate-yellow text-white";
    case "Advanced": return "bg-advanced-red text-white";
    default: return "bg-primary-fixed text-on-primary-fixed";
  }
};

// Sub-components
interface MetadataBadgeProps {
  difficulty?: string | null;
  duration?: string;
}

const MetadataBadge = ({ difficulty, duration }: MetadataBadgeProps) => (
  <div className="flex items-center gap-stack-sm flex-wrap">
    {difficulty && (
      <span 
        className={cn("px-3 py-1 rounded-full font-label-caps text-[10px] tracking-widest uppercase", getDifficultyStyle(difficulty))}
        aria-label={`Difficulty: ${difficulty}`}
      >
        {difficulty}
      </span>
    )}
    {duration && (
      <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
        <Clock className="w-4 h-4" aria-hidden="true" />
        <span>{duration}</span>
      </div>
    )}
  </div>
);

interface SidebarProps {
  subject?: string;
  slug?: string;
  subjectName?: string;
  tutorials: any[];
}

const TutorialSidebar = ({ subject, slug, subjectName, tutorials }: SidebarProps) => (
  <aside className="hidden md:flex flex-col gap-stack-sm p-gutter h-[calc(100vh-64px)] sticky top-16 w-64 bg-surface-container-low border-r border-outline-variant overflow-y-auto">
    <div className="mb-stack-md">
      <h2 className="font-headline-h3 text-headline-h3 text-primary">{subjectName}</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Tutorials</p>
    </div>
    <nav className="flex flex-col gap-1 flex-1">
      {tutorials.map((t) => (
        <Link
          key={t.slug}
          to={`/tutorials/${subject}/${t.slug}`}
          aria-current={t.slug === slug ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group font-label-caps text-label-caps",
            t.slug === slug
              ? "bg-primary-fixed text-on-primary-fixed font-bold"
              : "text-on-surface-variant hover:bg-surface-container-high"
          )}
        >
          <BookOpen className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">{t.title}</span>
        </Link>
      ))}
    </nav>
    <div className="pt-stack-md mt-auto border-t border-outline-variant">
      <Link to={UPGRADE_PATH}>
        <button 
          className="w-full bg-secondary text-on-secondary px-4 py-3 rounded-xl font-label-caps text-label-caps hover:opacity-80 transition-all flex items-center justify-center gap-2"
          aria-label="Upgrade to JMC Plus for premium features"
        >
          <Crown className="w-4 h-4" aria-hidden="true" />
          Upgrade to Plus
        </button>
      </Link>
    </div>
  </aside>
);

interface NavigationTutorialProps {
  tutorial: any;
  subject?: string;
  direction: 'prev' | 'next';
}

const NavigationTutorial = ({ tutorial, subject, direction }: NavigationTutorialProps) => {
  const isPrev = direction === 'prev';
  const label = isPrev ? 'Previous' : 'Next';
  const ariaLabel = `${label} tutorial: ${tutorial.title}`;

  return (
    <Link 
      to={`/tutorials/${subject}/${tutorial.slug}`} 
      className={cn("w-full sm:w-auto", !isPrev && "ml-auto")}
      aria-label={ariaLabel}
    >
      <div className={cn(
        "flex items-center gap-2 p-4 rounded-xl hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant group",
        !isPrev && "flex-row-reverse text-right"
      )}>
        {isPrev ? (
          <ArrowLeft className="w-5 h-5 text-on-surface-variant group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
        ) : (
          <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        )}
        <div>
          <div className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">{label}</div>
          <div className="font-headline-h3 text-headline-h3 text-primary line-clamp-1">{tutorial.title}</div>
        </div>
      </div>
    </Link>
  );
};

// Main Component
const TutorialPage = () => {
  const { subject, slug } = useParams<{ subject: string; slug: string }>();

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

  // Memoize navigation calculations
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
        <div className="pt-20 pb-12">
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
            <h1 className="font-headline-h1 text-headline-h1 text-error">Tutorial not found</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              The tutorial <strong>{subject}/{slug}</strong> does not exist or has not been published.
            </p>
            <Link to="/tutorials" className="text-secondary hover:underline font-body-md">
              ← Back to Tutorials
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-primary text-on-primary px-4 py-2 rounded">
        Skip to main content
      </a>
      <div className="flex max-w-container-max mx-auto">
        {/* Sidebar */}
        <TutorialSidebar 
          subject={subject}
          slug={slug}
          subjectName={tutorial.subjects?.name}
          tutorials={subjectTutorials}
        />

        {/* Main Content */}
        <main 
          id="main-content"
          className="flex-1 px-4 md:px-margin-desktop py-stack-md min-h-screen relative overflow-hidden"
        >
          {/* Dot grid background */}
          <div 
            className="absolute inset-0 -z-10" 
            style={{ 
              backgroundImage: "radial-gradient(#3f465c 0.5px, transparent 0.5px)", 
              backgroundSize: "24px 24px", 
              opacity: 0.1 
            }}
            aria-hidden="true"
          />

          {/* Breadcrumbs */}
          <nav 
            className="flex items-center gap-2 mb-stack-sm text-on-surface-variant font-body-sm text-body-sm flex-wrap"
            aria-label="Breadcrumb"
          >
            <Link className="hover:text-primary transition-colors" to="/tutorials">Tutorials</Link>
            <span aria-hidden="true">›</span>
            <Link 
              className="hover:text-primary transition-colors capitalize" 
              to={`/tutorials/${subject}`}
            >
              {tutorial.subjects?.name || subject}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="text-primary font-semibold line-clamp-1">{tutorial.title}</span>
          </nav>

          {/* Content Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter mb-stack-lg">
            <div>
              <h1 className="font-headline-h1 text-headline-h1 text-primary mb-2">{tutorial.title}</h1>
              <MetadataBadge 
                difficulty={tutorial.difficulty}
                duration={tutorial.duration_text}
              />
            </div>
            <div className="flex gap-3">
              {tutorial.notes && (
                <Link to={`/notes/${tutorial.subjects?.slug}/${tutorial.notes.slug}`}>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg font-label-caps text-label-caps text-on-surface hover:bg-surface-container-high transition-colors"
                    aria-label="Read accompanying note"
                  >
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    Read Note
                  </button>
                </Link>
              )}
              <Link to={`/quiz/${tutorial.slug}`}>
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-caps text-label-caps hover:opacity-90 transition-colors"
                  aria-label="Take quiz to test your knowledge"
                >
                  Take Quiz
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </button>
              </Link>
            </div>
          </div>

          {/* Article Body */}
          <article className="max-w-3xl">
            <Suspense fallback={<ContentSkeleton />}>
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
                <TutorialRenderer 
                  content={stripLeadingDuplicateTitle(tutorial.content_md, tutorial.title)} 
                />
              </div>
            </Suspense>
          </article>

          {/* Prev/Next Navigation */}
          <nav 
            className="flex flex-col sm:flex-row items-center justify-between gap-gutter border-t border-outline-variant pt-stack-lg mt-stack-lg max-w-3xl"
            aria-label="Tutorial navigation"
          >
            {navigationTutorials.prevTutorial ? (
              <NavigationTutorial 
                tutorial={navigationTutorials.prevTutorial}
                subject={subject}
                direction="prev"
              />
            ) : (
              <div className="w-full sm:w-auto" />
            )}

            {navigationTutorials.nextTutorial && (
              <NavigationTutorial 
                tutorial={navigationTutorials.nextTutorial}
                subject={subject}
                direction="next"
              />
            )}
          </nav>
        </main>
      </div>
    </Layout>
  );
};

export default TutorialPage;
