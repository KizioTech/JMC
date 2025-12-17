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

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lessons: number;
  rating: number;
  topics: string[];
  notesUrl?: string;
}

const Tutorials = () => {
  const tutorials: Tutorial[] = [
    {
      id: "transcendental-functions-tutorial",
      title: "Calculus II: Transcendental Functions",
      description: "Master exponential, logarithmic, and trigonometric functions in calculus with comprehensive tutorials and practice problems.",
      category: "Calculus",
      duration: "4 hours",
      difficulty: "Intermediate",
      lessons: 12,
      rating: 4.9,
      topics: ["Exponential Functions", "Logarithmic Differentiation", "Integration"],
      notesUrl: "/tutorials/calculus/transcendental-functions-tutorial",
    },
    {
      id: "hyperbolic-functions-tutorial",
      title: "Calculus II: Hyperbolic Functions",
      description: "Learn hyperbolic functions, their properties, derivatives, and applications in calculus with step-by-step examples.",
      category: "Calculus",
      duration: "3 hours",
      difficulty: "Intermediate",
      lessons: 10,
      rating: 4.8,
      topics: ["Hyperbolic Functions", "Derivatives", "Identities"],
      notesUrl: "/tutorials/calculus/hyperbolic-functions-tutorial",
    },
    {
      id: "trigonometric-functions-tutorial",
      title: "Calculus II: Inverse Trigonometric Functions",
      description: "Master inverse trigonometric functions with comprehensive coverage of derivatives, integrals, and applications.",
      category: "Calculus",
      duration: "3 hours",
      difficulty: "Intermediate",
      lessons: 9,
      rating: 4.7,
      topics: ["Inverse Trig", "Differentiation", "Integration"],
      notesUrl: "/tutorials/calculus/trigonometric-functions-tutorial",
    },
    {
      id: "quadratic-equations-tutorial",
      title: "Solving Quadratic Equations - Interactive",
      description: "Master quadratic equations with step-by-step tutorials, practice problems, and interactive solutions that you can reveal as you work.",
      category: "Algebra",
      duration: "2 hours",
      difficulty: "Beginner",
      lessons: 8,
      rating: 4.9,
      topics: ["Factoring", "Quadratic Formula", "Discriminant", "Practice Problems"],
      notesUrl: "/tutorials/algebra/quadratic-equations-tutorial",
    },
    {
      id: "counting-techniques-tutorial",
      title: "Counting Techniques Tutorial",
      description: "This tutorial covers fundamental counting principles and techniques used in discrete mathematics.",
      category: "Discrete Math",
      duration: "3 hours",
      difficulty: "Intermediate",
      lessons: 10,
      rating: 4.8,
      topics: ["Permutations", "Combinations", "Binomial Theorem"],
      notesUrl: "/tutorials/discrete/counting-techniques-tutorial",
    },
    {
      id: "pigeonhole-principle-tutorial",
      title: "Pigeonhole Principle Tutorial",
      description: "Learn the pigeonhole principle and its applications in discrete mathematics and computer science.",
      category: "Discrete Math",
      duration: "2.5 hours",
      difficulty: "Intermediate",
      lessons: 8,
      rating: 4.7,
      topics: ["Pigeonhole Principle", "Combinatorics", "Proof Techniques"],
      notesUrl: "/tutorials/discrete/pigeonhole-principle-tutorial",
    },
    {
      id: "recurrence-relations-tutorial",
      title: "Recurrence Relations Tutorial",
      description: "Study recurrence relations, including solving techniques and applications in algorithm analysis.",
      category: "Discrete Math",
      duration: "4 hours",
      difficulty: "Advanced",
      lessons: 12,
      rating: 4.8,
      topics: ["Recurrence Relations", "Generating Functions", "Algorithm Analysis"],
      notesUrl: "/tutorials/discrete/recurrence-relations-tutorial",
    },
    {
      id: "angular-measure-tutorial",
      title: "Angular Measure Tutorial",
      description: "Comprehensive coverage of angular measure including degrees, radians, and conversion techniques.",
      category: "Trigonometry",
      duration: "2 hours",
      difficulty: "Beginner",
      lessons: 6,
      rating: 4.6,
      topics: ["Degrees", "Radians", "Unit Circle"],
      notesUrl: "/tutorials/trigonometry/angular-measure-tutorial",
    },
     {
      id: "arcs-and-sectors",
      title: "Arcs and Sectors Tutorial",
      description: "Comprehensive approach towards Length or arcs and Areas of sectors",
      category: "Trigonometry",
      duration: "2 hours",
      difficulty: "Beginner",
      lessons: 2,
      rating: 4.6,
      topics: ["Degrees", "Radians", "Unit Circle"],
      notesUrl: "/tutorials/trigonometry/arcs-and-sectors-tutorial",
    },
  ];

  const difficultyColors = {
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
          <div className="bg-gradient-to-r from-hero-dark to-hero-mid rounded-2xl p-8 text-primary-foreground">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="px-3 py-1 bg-primary/20 rounded-full text-sm font-medium mb-4 inline-block">
                  Most Popular
                </span>
                <h3 className="text-3xl font-bold mb-4">{tutorials[0].title}</h3>
                <p className="text-muted-foreground mb-6">{tutorials[0].description}</p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{tutorials[0].duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>{tutorials[0].lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span>{tutorials[0].rating}</span>
                  </div>
                </div>
                {tutorials[0].notesUrl ? (
                  <Link to={tutorials[0].notesUrl}>
                    <Button size="lg" className="gap-2">
                      Start Learning
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" disabled>
                    Coming Soon
                  </Button>
                )}
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="w-64 h-64 bg-primary/10 rounded-full flex items-center justify-center">
                  <BookOpen className="w-32 h-32 text-primary-foreground/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Tutorials */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">All Tutorials</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">{tutorial.category}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[tutorial.difficulty]}`}>
                      {tutorial.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tutorial.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{tutorial.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutorial.topics.slice(0, 3).map((topic) => (
                      <span key={topic} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{tutorial.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{tutorial.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      <span>{tutorial.rating}</span>
                    </div>
                  </div>

                  {tutorial.notesUrl ? (
                    <Link to={tutorial.notesUrl}>
                      <Button variant="default" className="w-full gap-2">
                        <CheckCircle className="w-4 h-4" />
                        View Tutorial
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Tutorials;