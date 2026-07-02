import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Video,
  FileText,
  Clock,
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllTutorials, TutorialRow } from "@/services/contentService";
import { TutorialCardSkeleton } from "@/components/ui/Skeletons";

const Tutorials = () => {
  const { data: tutorials = [], isLoading } = useQuery({
    queryKey: ['tutorials'],
    queryFn: getAllTutorials
  });

  const featuredTutorial = tutorials.length > 0 ? tutorials[0] : null;

  const difficultyColors: Record<string, string> = {
    Beginner: "bg-theorem-bg text-theorem-border",
    Intermediate: "bg-example-bg text-example-border",
    Advanced: "bg-warning-bg text-warning-border",
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground py-16 relative overflow-hidden">
        <div className="math-bg absolute inset-0" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">
            Mathematics Tutorials
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Step-by-step video tutorials and guides to help you master mathematical concepts. 
            Learn at your own pace with our structured curriculum.
          </p>
        </div>
      </section>

      {/* Featured Tutorial */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Featured Tutorial</h2>
          <div className="bg-gradient-to-r from-hero-dark to-hero-mid rounded-2xl p-8 text-primary-foreground min-h-[300px]">
            {isLoading ? (
               <div className="animate-pulse space-y-4">
                 <div className="h-6 w-32 bg-primary/20 rounded-full mb-4"></div>
                 <div className="h-8 w-3/4 bg-primary/20 rounded-md"></div>
                 <div className="h-4 w-5/6 bg-primary/20 rounded-md"></div>
                 <div className="h-10 w-40 bg-primary/20 rounded-md mt-6"></div>
               </div>
            ) : featuredTutorial ? (
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="px-3 py-1 bg-primary/20 rounded-full text-sm font-medium mb-4 inline-block">
                    Most Popular
                  </span>
                  <h3 className="text-3xl font-bold mb-4">{featuredTutorial.title}</h3>
                  <p className="text-muted-foreground mb-6">{featuredTutorial.description || "Learn this topic in depth."}</p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    {featuredTutorial.duration_text && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{featuredTutorial.duration_text}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      <span>{featuredTutorial.subjects?.name}</span>
                    </div>
                    {featuredTutorial.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-secondary text-secondary" />
                        <span>{featuredTutorial.rating}</span>
                      </div>
                    )}
                  </div>
                  <Link to={`/tutorials/${featuredTutorial.subjects?.slug}/${featuredTutorial.slug}`}>
                    <Button size="lg" className="gap-2">
                      Start Learning
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="hidden lg:flex justify-center">
                  <div className="w-64 h-64 bg-primary/10 rounded-full flex items-center justify-center">
                    <BookOpen className="w-32 h-32 text-primary-foreground/30" />
                  </div>
                </div>
              </div>
            ) : (
              <p>No featured tutorial available.</p>
            )}
          </div>
        </div>
      </section>

      {/* All Tutorials */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">All Tutorials</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i}><TutorialCardSkeleton /></div>
              ))
            ) : tutorials.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground py-12">No tutorials published yet.</p>
            ) : (
              tutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="h-2 bg-gradient-to-r from-primary to-secondary shrink-0" />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">{tutorial.subjects?.name}</span>
                      {tutorial.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[tutorial.difficulty] || "bg-muted text-muted-foreground"}`}>
                          {tutorial.difficulty}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{tutorial.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{tutorial.description}</p>
                    
                    {tutorial.topics && tutorial.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tutorial.topics.slice(0, 3).map((topic) => (
                          <span key={topic} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 mt-auto">
                      {tutorial.duration_text && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{tutorial.duration_text}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Tutorial</span>
                      </div>
                      {tutorial.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-secondary text-secondary" />
                          <span>{tutorial.rating}</span>
                        </div>
                      )}
                    </div>

                    <Link to={`/tutorials/${tutorial.subjects?.slug}/${tutorial.slug}`} className="w-full">
                      <Button variant="default" className="w-full gap-2">
                        <CheckCircle className="w-4 h-4" />
                        View Tutorial
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Tutorials;