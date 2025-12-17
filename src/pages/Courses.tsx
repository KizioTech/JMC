import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";

const Courses = () => {
  const courses = [
    {
      id: "advanced-calculus",
      title: "Advanced Calculus",
      description: "Master the fundamentals of differential and integral calculus with our comprehensive course.",
      level: "Advanced",
      duration: "12 weeks",
      image: "/assets/images/calculus.jpg",
      alt: "Advanced Calculus Course"
    },
    {
      id: "linear-algebra",
      title: "Linear Algebra",
      description: "Learn vectors, matrices, and linear transformations in this essential mathematics course.",
      level: "Intermediate",
      duration: "10 weeks",
      image: "/assets/images/linear-algebra.jpg",
      alt: "Linear Algebra Course"
    },
    {
      id: "algebra-fundamentals",
      title: "Algebra Fundamentals",
      description: "Build a solid foundation in algebra with step-by-step explanations and practice problems.",
      level: "Beginner",
      duration: "8 weeks",
      image: "/assets/images/algebra.jpg",
      alt: "Algebra Fundamentals Course"
    },
    {
      id: "statistics-probability",
      title: "Statistics & Probability",
      description: "Understand data analysis, probability distributions, and statistical inference.",
      level: "Intermediate",
      duration: "14 weeks",
      image: "/assets/images/statistics.jfif",
      alt: "Statistics & Probability Course"
    },
    {
      id: "geometry-mastery",
      title: "Geometry Mastery",
      description: "Explore shapes, angles, and spatial relationships in this comprehensive geometry course.",
      level: "Beginner",
      duration: "10 weeks",
      image: "/assets/images/geometry.jfif",
      alt: "Geometry Mastery Course"
    },
    {
      id: "trigonometry",
      title: "Trigonometry",
      description: "Master sine, cosine, tangent, and their applications in real-world problems.",
      level: "Intermediate",
      duration: "9 weeks",
      image: "/assets/images/trig.jfif",
      alt: "Trigonometry Course"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground py-16 relative overflow-hidden">
        <div className="math-bg absolute inset-0" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">
            Our Courses
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive range of courses designed to help you master mathematics and academics.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.alt}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full gap-2"
                    onClick={() => alert('Enrollment feature coming soon!')}
                  >
                    <BookOpen className="w-4 h-4" />
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
