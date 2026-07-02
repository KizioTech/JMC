import Layout from "@/components/layout/Layout";
import { BookOpen, Clock, Layers } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { getPublishedCourses } from "@/services/courseService";
import { NoteCardSkeleton } from "@/components/ui/Skeletons";
import { cn } from "@/lib/utils";

const getLevelStyle = (level: string | null) => {
  switch (level) {
    case "Beginner":
      return { pill: "bg-beginner-green text-white", label: "Beginner" };
    case "Intermediate":
      return { pill: "bg-intermediate-yellow text-white", label: "Intermediate" };
    case "Advanced":
      return { pill: "bg-advanced-red text-white", label: "Advanced" };
    default:
      return { pill: "bg-primary-fixed text-on-primary-fixed", label: level || "Course" };
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

      <main className="flex flex-col min-h-screen">
        {/* Header Section */}
        <header className="w-full bg-surface-container py-16 relative overflow-hidden">
          {/* Floating Particle Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-secondary rounded-full animate-ping"></div>
            <div className="absolute bottom-10 left-1/3 w-2 h-2 bg-primary-container rounded-full"></div>
          </div>
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <h1 className="font-headline-h1 text-headline-h1 text-on-background mb-4">Advance Your Mathematical Journey</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Rigorous coursework designed for clarity and depth. From foundational calculus to abstract analysis, master the language of the universe.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
          {/* Sort Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-gutter mb-stack-md">
            <div className="flex flex-wrap gap-stack-sm">
              <button className="px-5 py-2 rounded-full bg-primary text-on-primary font-body-sm font-semibold">All Subjects</button>
              <button className="px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-outline-variant transition-colors font-body-sm">Calculus</button>
              <button className="px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-outline-variant transition-colors font-body-sm">Linear Algebra</button>
              <button className="px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-outline-variant transition-colors font-body-sm">Analysis</button>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="font-body-sm">Sort by:</span>
              <select className="bg-transparent border-none font-bold focus:ring-0 cursor-pointer text-on-surface">
                <option>Most Popular</option>
                <option>Difficulty: Low to High</option>
                <option>Difficulty: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <NoteCardSkeleton key={i} />)
            ) : courses.length === 0 ? (
              <p className="col-span-full text-center text-on-surface-variant py-12 font-body-md text-body-md">
                No courses are currently available. Check back soon!
              </p>
            ) : (
              courses.map((course) => {
                const { pill, label } = getLevelStyle(course.level);
                return (
                  <div key={course.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="h-48 relative group overflow-hidden">
                      {course.cover_image ? (
                        <img
                          src={course.cover_image}
                          alt={course.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                          <BookOpen className="w-12 h-12 text-outline/40" />
                        </div>
                      )}
                      {course.level && (
                        <div className={cn("absolute top-4 right-4 px-3 py-1 rounded-full font-label-caps text-label-caps shadow-sm", pill)}>
                          {label}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all"></div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-headline-h3 text-headline-h3 text-primary mb-2">{course.title}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 line-clamp-2">{course.description}</p>
                      <div className="mt-auto flex items-center text-on-surface-variant gap-4">
                        {course.duration_weeks && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-body-sm">{course.duration_weeks} Weeks</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Layers className="w-4 h-4" />
                          <span className="text-body-sm">Course</span>
                        </div>
                      </div>
                      <button
                        className="w-full mt-6 bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 transition-colors active:scale-95 duration-200"
                        onClick={() => alert("Enrollment feature coming soon!")}
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </main>
    </Layout>
  );
};

export default Courses;
