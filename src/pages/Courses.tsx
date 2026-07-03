import { useState } from "react";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/PageHeader";
import CourseCard from "@/components/courses/CourseCard";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { getPublishedCourses } from "@/services/courseService";
import { NoteCardSkeleton } from "@/components/ui/Skeletons";
import { cn } from "@/lib/utils";

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

const Courses = () => {
  const [activeLevel, setActiveLevel] = useState<string>("all");
  const [sort, setSort] = useState<"newest" | "az">("newest");

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getPublishedCourses,
  });

  const filtered = courses
    .filter((c) => activeLevel === "all" || c.level === activeLevel)
    .sort((a, b) => (sort === "az" ? a.title.localeCompare(b.title) : 0));

  return (
    <Layout>
      <Helmet>
        <title>Free Mathematics Courses - JMC Academics | Learn Math Online</title>
        <meta name="description" content="Explore free comprehensive mathematics courses covering calculus, algebra, geometry, statistics, and more. Expert-crafted learning materials for all levels." />
        <meta name="keywords" content="free mathematics courses, online math courses, calculus courses, algebra courses, geometry courses, statistics courses, JMC Academics" />
        <link rel="canonical" href="https://jmcacademics.netlify.app/courses" />
      </Helmet>

      <main className="min-h-screen bg-[#F5F6FA]">
        <PageHeader
          index="003"
          eyebrow="Courses"
          title={
            <>
              Structured paths,<br />start to mastery.
            </>
          }
          description="Full courses built from JMC's notes and tutorials — sequenced so each topic builds on the last."
        />

        {/* Filter row */}
        <div className="sticky top-16 z-10 bg-[#F5F6FA]/95 backdrop-blur-sm border-b border-[#0A0A0F]/12">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <button
                  onClick={() => setActiveLevel("all")}
                  className={cn(
                    "shrink-0 font-code text-[11px] font-bold uppercase tracking-wider px-4 py-4 border-b-2 transition-colors whitespace-nowrap",
                    activeLevel === "all"
                      ? "border-[#4338FF] text-[#0A0A0F]"
                      : "border-transparent text-[#0A0A0F]/40 hover:text-[#0A0A0F]"
                  )}
                >
                  All
                </button>
                {LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => setActiveLevel(level)}
                    className={cn(
                      "shrink-0 font-code text-[11px] font-bold uppercase tracking-wider px-4 py-4 border-b-2 transition-colors whitespace-nowrap",
                      activeLevel === level
                        ? "border-[#4338FF] text-[#0A0A0F]"
                        : "border-transparent text-[#0A0A0F]/40 hover:text-[#0A0A0F]"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 shrink-0 py-2">
                <span className="font-code text-[10px] uppercase tracking-wider text-[#0A0A0F]/40">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as "newest" | "az")}
                  className="bg-transparent border-none font-code text-[11px] font-bold uppercase tracking-wider text-[#0A0A0F] focus:outline-none focus:ring-0 cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="az">A–Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Course grid */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-14">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <NoteCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-[#0A0A0F]/15">
              <p className="font-inter text-xl font-bold text-[#0A0A0F] mb-1">No courses yet.</p>
              <p className="font-code text-[12px] text-[#0A0A0F]/50">Check back soon, or try a different level.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((course, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  position={i + 1}
                  onEnroll={() => alert("Enrollment feature coming soon!")}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Courses;