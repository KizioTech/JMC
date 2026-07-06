import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getCourseBySlug } from "@/services/courseService";
import Layout from "@/components/layout/Layout";
import { ContentSkeleton } from "@/components/ui/Skeletons";
import {
  Play,
  Clock,
  CalendarDays,
  BarChart3,
  Check,
  Lock,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Award,
} from "lucide-react";

function CoursePage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => getCourseBySlug(slug!),
    enabled: !!slug,
  });

  const [open, setOpen] = useState<Record<number, boolean>>({ 1: true });
  const toggle = (n: number) => setOpen((o) => ({ ...o, [n]: !o[n] }));

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop py-8">
          <ContentSkeleton />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Course not found</h1>
            <p className="mt-2 text-muted-foreground">The course you are looking for does not exist.</p>
            <Link to="/courses" className="mt-4 inline-block text-primary hover:underline">
              Back to Courses
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Map course modules to a single section for now, since DB is flat
  const modules = [
    {
      n: 1,
      title: "Course Curriculum",
      desc: "All lessons and tutorials in this course.",
      lessons: course.course_modules.length,
      length: course.duration_weeks ? `${course.duration_weeks} weeks` : "Self-paced",
      items: course.course_modules.map((m) => ({
        id: m.id,
        title: m.title,
        status: "locked" as const, // For UI purposes
        type: m.tutorial_id ? "tutorial" : "note",
      })),
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-margin-mobile md:px-margin-desktop py-8 pb-16 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* HERO */}
            <section className="rounded-2xl bg-primary-soft p-6 md:p-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
                <div>
                  <div className="flex items-start gap-5">
                    <div className="min-w-0">
                      <span className="inline-block rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                        Course
                      </span>
                      <h1 className="mt-3 text-3xl font-bold leading-tight text-foreground md:text-4xl">
                        {course.title}
                      </h1>
                      <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                        {course.description || "Comprehensive course material for your studies."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <Stat icon={<BarChart3 className="h-4 w-4" />} value={course.level || "All Levels"} label="Level" />
                    <Stat icon={<Clock className="h-4 w-4" />} value={course.duration_weeks ? `${course.duration_weeks}w` : "Self-paced"} label="Duration" />
                    <Stat icon={<CalendarDays className="h-4 w-4" />} value={course.course_modules.length.toString()} label="Lessons" />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
                      <Play className="h-4 w-4 fill-current" />
                      Start Learning
                    </button>
                  </div>
                </div>

                <div className="relative rounded-xl bg-card p-4 shadow-sm overflow-hidden flex items-center justify-center min-h-[200px]">
                  {course.cover_image ? (
                    <img src={course.cover_image} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  ) : (
                    <div className="absolute inset-0 bg-secondary/30" />
                  )}
                  <div className="relative z-10 rounded-lg border border-border bg-secondary/80 backdrop-blur-sm px-3 py-2 text-center text-xs font-medium text-foreground">
                    {course.title}
                  </div>
                </div>
              </div>
            </section>

            {/* COURSE CONTENT */}
            <section className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold">Course Content</h2>
              </div>

              <ul className="divide-y divide-border">
                {modules.map((m) => (
                  <li key={m.n} className="py-3 first:pt-0 last:pb-0">
                    <button
                      onClick={() => toggle(m.n)}
                      className="flex w-full items-center gap-4 rounded-lg px-2 py-2 text-left hover:bg-secondary/60"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {m.n}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-foreground">{m.title}</div>
                        <div className="truncate text-sm text-muted-foreground">{m.desc}</div>
                      </div>
                      <div className="hidden shrink-0 items-center gap-4 text-xs text-muted-foreground sm:flex">
                        <span>{m.lessons} Lessons</span>
                      </div>
                      {open[m.n] ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>

                    {open[m.n] && m.items && (
                      <ul className="mt-2 space-y-1 pl-14">
                        {m.items.map((l, i) => (
                          <li
                            key={l.id}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-secondary/60"
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-locked">
                              {l.type === "tutorial" ? <ClipboardList className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                            </span>
                            <span className="flex-1 text-foreground">
                              <span className="mr-2 text-muted-foreground">{i + 1}.</span>
                              {l.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* FOOTER STRIP */}
            <section className="grid grid-cols-2 gap-3 rounded-2xl bg-secondary/60 p-4 md:grid-cols-4">
              <Feature icon={<BookOpen className="h-5 w-5" />} title="Learn at Your Pace" sub="Study anytime, anywhere" />
              <Feature icon={<ClipboardList className="h-5 w-5" />} title="Practice & Improve" sub="Test your understanding" />
              <Feature icon={<TrendingUp className="h-5 w-5" />} title="Track Progress" sub="See how you're doing" />
              <Feature icon={<Award className="h-5 w-5" />} title="Earn Certificate" sub="Showcase your achievement" />
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-4">
            {/* Progress */}
            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <h3 className="text-sm font-semibold text-foreground">Your Progress</h3>
              <div className="mt-4 flex items-center gap-5">
                <ProgressRing pct={0} />
                <ul className="flex-1 space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success-soft text-success">
                        <Check className="h-3 w-3" />
                      </span>
                      Completed
                    </span>
                    <span className="font-semibold">0</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-locked">
                        <Lock className="h-3 w-3" />
                      </span>
                      Locked
                    </span>
                    <span className="font-semibold">{course.course_modules.length}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Resources */}
            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 hover:bg-secondary/50">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-soft text-primary">
                    <FileText className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm font-medium">Course Syllabus</span>
                  <span className="text-xs text-muted-foreground">PDF</span>
                </li>
              </ul>
              <button className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline">
                <Download className="h-4 w-4" />
                Download Resources
              </button>
            </div>
            
            {/* Instructor */}
            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <h3 className="text-sm font-semibold">Instructor</h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  JMC
                </div>
                <div>
                  <div className="font-semibold">JMC Academics</div>
                  <div className="text-xs text-muted-foreground">Expert Instructors</div>
                </div>
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">
                <MessageSquare className="h-4 w-4" />
                Message Instructor
              </button>
            </div>
          </aside>
        </main>
      </div>
    </Layout>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-start gap-1 rounded-xl bg-card/80 px-3 py-2.5 ring-1 ring-border/60">
      <span className="text-primary">{icon}</span>
      <span className="text-sm font-bold leading-none text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

function Feature({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-card text-primary ring-1 ring-border">
        {icon}
      </span>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--secondary)" strokeWidth="8" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-lg font-bold leading-none">{pct}%</div>
        <div className="text-[10px] text-muted-foreground">Completed</div>
      </div>
    </div>
  );
}

export default CoursePage;
