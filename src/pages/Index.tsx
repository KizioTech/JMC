import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Particles from "@/components/ui/Particles";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Trophy, 
  Calculator, 
  FileText, 
  Video, 
  Award,
  ChevronRight,
  Star
} from "lucide-react";

const Index = () => {
  const stats = [
    { number: "50+", label: "Free Courses", icon: GraduationCap },
    { number: "10K+", label: "Students", icon: Users },
    { number: "200+", label: "Resources", icon: BookOpen },
    { number: "95%", label: "Success Rate", icon: Trophy },
  ];

  const features = [
    {
      icon: Calculator,
      title: "Comprehensive Curriculum",
      description: "From basic algebra to advanced calculus, our structured courses cover every mathematical concept you need.",
    },
    {
      icon: FileText,
      title: "Practice Materials",
      description: "Thousands of practice problems with detailed solutions to reinforce your understanding.",
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video explanations that make complex topics easy to understand.",
    },
    {
      icon: Award,
      title: "Expert Content",
      description: "Created by experienced educators with deep expertise in mathematics education.",
    },
  ];

  const testimonials = [
    {
      text: "JMC Academics transformed my understanding of calculus. The notes are incredibly clear and well-organized.",
      author: "Sarah M.",
      role: "University Student",
    },
    {
      text: "As a teacher, I recommend JMC to all my students. The quality of content is unmatched.",
      author: "Prof. James K.",
      role: "Mathematics Teacher",
    },
    {
      text: "The step-by-step tutorials helped me ace my exams. I went from struggling to top of my class!",
      author: "David L.",
      role: "High School Student",
    },
  ];

  const learningPath = [
    { level: "Beginner", topics: "Algebra, Geometry, Basic Trigonometry" },
    { level: "Intermediate", topics: "Pre-Calculus, Statistics, Advanced Algebra" },
    { level: "Advanced", topics: "Calculus I & II, Linear Algebra, Differential Equations" },
    { level: "Expert", topics: "Real Analysis, Abstract Algebra, Complex Analysis" },
  ];

  return (
    <Layout>
      <Particles />
      
      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground py-20 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="math-bg absolute inset-0" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 gradient-text animate-title-glow leading-tight motion-reduce:animate-none">
            Master Mathematics with Expert-Crafted Resources
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in-up motion-reduce:animate-none" style={{ animationDelay: "0.5s" }}>
            Free online courses, textbooks, and tutorials designed to transform your mathematical journey. 
            From fundamentals to advanced topics — learn at your own pace.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up motion-reduce:animate-none" style={{ animationDelay: "1s" }}>
            <Link to="/library">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden btn-shimmer">
                <BookOpen className="mr-2 w-5 h-5" />
                Explore Library
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-hero-dark transition-all">
                <GraduationCap className="mr-2 w-5 h-5" />
                View Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card py-16 relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
            Trusted by Learners Worldwide
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-12 rounded-full" />
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center p-6 hover:-translate-y-2 focus-visible:-translate-y-2 focus-visible:ring-2 outline-none transition-transform"
                tabIndex={0}
              >
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <span className="block text-4xl md:text-5xl font-extrabold text-primary mb-2">
                  {stat.number}
                </span>
                <span className="text-lg text-muted-foreground font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-muted to-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Why Choose JMC Academics?
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 focus-visible:ring-2 focus-visible:-translate-y-2 outline-none border border-primary/10 relative overflow-hidden group"
                tabIndex={0}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-focus-visible:bg-primary group-hover:scale-110 group-focus-visible:scale-110 transition-all will-change-transform">
                  <feature.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground group-focus-visible:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Your Learning Journey
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
            <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
              Progress through our structured curriculum designed to take you from basics to mastery
            </p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary -translate-y-1/2 rounded-full" />
            <div className="grid lg:grid-cols-4 gap-8 relative z-10">
              {learningPath.map((stage, index) => (
                <div 
                  key={stage.level}
                  className="bg-background border-2 border-primary/20 rounded-2xl p-6 text-center relative hover:border-primary transition-colors focus-visible:ring-2 outline-none"
                  tabIndex={0}
                >
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">{stage.level}</h3>
                  <p className="text-muted-foreground text-sm">{stage.topics}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 hero-gradient text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold gradient-text-gold mb-4">
              What Our Students Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-primary-foreground/5 dark:bg-muted/50 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-8 hover:-translate-y-2 focus-visible:-translate-y-2 focus-visible:ring-2 transition-all outline-none"
                tabIndex={0}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-lg italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-bold" aria-hidden="true">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
            Ready to Start Your Mathematical Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of students who have transformed their understanding of mathematics with JMC Academics.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/library">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full animate-glow-pulse">
                Get Started Free
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/jmc-plus">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full">
                Learn About JMC Plus
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
