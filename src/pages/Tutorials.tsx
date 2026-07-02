import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllTutorials } from "@/services/contentService";
import { TutorialCardSkeleton } from "@/components/ui/Skeletons";
import { cn } from "@/lib/utils";

const getDifficultyStyle = (difficulty?: string | null) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-beginner-green text-white";
    case "Intermediate":
      return "bg-intermediate-yellow text-white";
    case "Advanced":
      return "bg-advanced-red text-white";
    default:
      return "bg-primary-fixed text-on-primary-fixed";
  }
};

const Tutorials = () => {
  const { data: tutorials = [], isLoading } = useQuery({
    queryKey: ['tutorials'],
    queryFn: getAllTutorials
  });

  const featuredTutorial = tutorials.length > 0 ? tutorials[0] : null;

  return (
    <Layout>
      <main className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full bg-primary-container py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#dae2fd_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <span className="font-label-caps text-label-caps text-primary-fixed uppercase tracking-widest mb-2 block">Step-by-Step Learning</span>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary-fixed mb-4">Mathematics Tutorials</h1>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl">
              Step-by-step guides to help you master mathematical concepts at your own pace, from basics to advanced proofs.
            </p>
          </div>
        </header>

        {/* Featured Tutorial */}
        {(isLoading || featuredTutorial) && (
          <section className="py-stack-lg bg-surface border-b border-outline-variant">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
              <h2 className="font-headline-h2 text-headline-h2 mb-gutter">Featured Tutorial</h2>
              {isLoading ? (
                <div className="animate-pulse bg-surface-container-high rounded-xl h-48 w-full"></div>
              ) : featuredTutorial ? (
                <div className="bg-surface-container-low border border-outline-variant rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps rounded-full mb-4">
                      Most Popular
                    </span>
                    <h3 className="font-headline-h1 text-headline-h1 mb-3 text-primary">{featuredTutorial.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6">{featuredTutorial.description || "Learn this topic in depth."}</p>
                    <div className="flex flex-wrap gap-4 mb-6 text-on-surface-variant">
                      {featuredTutorial.duration_text && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="font-body-sm text-body-sm">{featuredTutorial.duration_text}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-body-sm text-body-sm">{featuredTutorial.subjects?.name}</span>
                      </div>
                      {featuredTutorial.rating && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-intermediate-yellow text-intermediate-yellow" />
                          <span className="font-body-sm text-body-sm">{featuredTutorial.rating}</span>
                        </div>
                      )}
                    </div>
                    <Link to={`/tutorials/${featuredTutorial.subjects?.slug}/${featuredTutorial.slug}`}>
                      <button className="px-8 py-3 bg-primary text-on-primary font-headline-h3 text-headline-h3 rounded-lg hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center gap-2">
                        Start Learning
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </Link>
                  </div>
                  <div className="hidden md:flex justify-center shrink-0">
                    <div className="w-52 h-52 bg-primary-fixed/30 rounded-full flex items-center justify-center">
                      <BookOpen className="w-24 h-24 text-primary/30" />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        )}

        {/* All Tutorials */}
        <section className="py-stack-lg flex-grow bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-h2 text-headline-h2 mb-gutter">All Tutorials</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <TutorialCardSkeleton key={i} />)
              ) : tutorials.length === 0 ? (
                <p className="col-span-full text-center text-on-surface-variant py-12 font-body-md text-body-md">No tutorials published yet.</p>
              ) : (
                tutorials.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
                  >
                    <div className="h-2 bg-primary shrink-0" />
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-label-caps text-label-caps text-on-surface-variant">{tutorial.subjects?.name}</span>
                        {tutorial.difficulty && (
                          <span className={cn("px-3 py-1 rounded-full font-label-caps text-label-caps shadow-sm", getDifficultyStyle(tutorial.difficulty))}>
                            {tutorial.difficulty}
                          </span>
                        )}
                      </div>
                      <h3 className="font-headline-h3 text-headline-h3 mb-2 group-hover:text-secondary transition-colors">{tutorial.title}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 line-clamp-2">{tutorial.description}</p>

                      {tutorial.topics && tutorial.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tutorial.topics.slice(0, 3).map((topic) => (
                            <span key={topic} className="px-2 py-1 bg-surface-container text-on-surface-variant text-xs rounded-md font-label-caps">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center text-on-surface-variant gap-4 mb-4 mt-auto">
                        {tutorial.duration_text && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-body-sm text-body-sm">{tutorial.duration_text}</span>
                          </div>
                        )}
                        {tutorial.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-intermediate-yellow text-intermediate-yellow" />
                            <span className="font-body-sm text-body-sm">{tutorial.rating}</span>
                          </div>
                        )}
                      </div>

                      <Link to={`/tutorials/${tutorial.subjects?.slug}/${tutorial.slug}`} className="w-full">
                        <button className="w-full bg-primary text-on-primary py-2.5 rounded-lg font-body-sm font-bold hover:opacity-90 transition-colors flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          View Tutorial
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Tutorials;