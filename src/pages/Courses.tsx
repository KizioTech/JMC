import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { getPublishedCourses } from "@/services/courseService";
import { NoteCardSkeleton } from "@/components/ui/Skeletons";

const getLevelColor = (level: string | null) => {
  switch (level) {
    case "Beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const Courses = () => {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getPublishedCourses,
  });

  return (
    <Layout>
      <Helmet>
        <title>Free Mathematics Courses - JMC Academics | Learn Math Online</title>
        <meta name="description" content="Explore free comprehensive mathematics courses covering calculus, algebra, geometry, statistics, and more. Expert-crafted learning materials for all levels." />
        <meta name="keywords" content="free mathematics courses, online math courses, calculus courses, algebra courses, geometry courses, statistics courses, JMC Academics" />
        <link rel="canonical" href="https://jmcacademics.netlify.app/courses" />
      </Helmet>

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
      <section className="py-12 bg-background min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i}><NoteCardSkeleton /></div>
              ))
            ) : courses.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground py-12">No courses are currently available. Check back soon!</p>
            ) : (
              courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                  <div className="aspect-video overflow-hidden bg-muted shrink-0">
                    {course.cover_image ? (
                      <img
                        src={course.cover_image}
                        alt={course.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="flex-none">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <div className="flex items-center justify-between mb-4 mt-auto">
                      {course.level && (
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                      )}
                      {course.duration_weeks && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration_weeks} weeks</span>
                        </div>
                      )}
                    </div>
                    <Button
                      className="w-full gap-2"
                      onClick={() => alert("Enrollment feature coming soon!")}
                    >
                      <BookOpen className="w-4 h-4" />
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
