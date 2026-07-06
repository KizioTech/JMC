import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/PageHeader";
import { socialLinks } from "@/components/ui/social-icons";
import {
  ExternalLink,
  MapPin,
  GraduationCap,
  Code2,
  Palette,
  Users,
  BookOpen,
  Microscope,
  Globe,
  ChevronRight,
  Building2,
  Music2,
  Calculator,
  BarChart3,
  Newspaper,
  Database,
  Rocket,
  BookMarked,
  Trophy,
  Radio,
  PenLine,
  type LucideIcon,
} from "lucide-react";

// ─── Photo data ───────────────────────────────────────────────────────────────
const PHOTOS = [
  "/assets/images/about/jmc1.jpg",
  "/assets/images/about/jmc2.jpg",
  "/assets/images/about/jmc3.jpg",
  "/assets/images/about/jmc4.jpg",
];

function useRotatingPhoto(intervalMs = 8000) {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * PHOTOS.length)
  );
  const [fading, setFading] = useState(false);

  const advance = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setIndex((i) => (i + 1) % PHOTOS.length);
      setFading(false);
    }, 400);
  }, []);

  useEffect(() => {
    const timer = setInterval(advance, intervalMs);
    return () => clearInterval(timer);
  }, [advance, intervalMs]);

  return { src: PHOTOS[index], fading };
}

// ─── Projects ─────────────────────────────────────────────────────────────────
const projects: {
  icon: LucideIcon;
  iconBg: string;
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  github: string | null;
  live?: string;
  tagColor: string;
  inDev?: boolean;
}[] = [
  {
    icon: Building2,
    iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    name: "UCOCSA",
    subtitle: "University of Malawi Church of Christ Student Association",
    description:
      "Official digital platform — a Christ-centred community hub for faith, fellowship, and academic life at UNIMA. Full hymn library, prayer wall, events calendar, rich Markdown blog, photo gallery, real-time notifications, and admin dashboard.",
    tags: ["React 18", "TypeScript", "Supabase", "PWA", "Vercel"],
    github: "https://github.com/KizioTech/ucocsa",
    live: "https://ucocsa.vercel.app",
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    icon: Music2,
    iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    name: "Sing Unto The Lord",
    subtitle: "Digital Hymnbook PWA",
    description:
      "A modern, responsive Progressive Web App hymnbook for the UNIMA Church of Christ. Full hymn database with advanced search, favourites, dark/light theme, presentation mode with auto-scroll, YouTube integration, and keyboard shortcuts.",
    tags: ["React 18", "Tailwind CSS", "PWA", "v1.7.0"],
    github: "https://github.com/KizioTech/sing-unto-the-lord",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
 
  {
    icon: Calculator,
    iconBg: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    name: "TrigAndCalculus",
    subtitle: "Notes & Exercises",
    description:
      "Worked examples, practice problems, and conceptual notes covering trigonometric identities, limits, derivatives, and integrals. Useful for self-study and exam preparation.",
    tags: ["Mathematics", "Trigonometry", "Calculus"],
    github: "https://github.com/KizioTech/TrigAndCalculus",
    tagColor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  {
    icon: Newspaper,
    iconBg: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    name: "Mountain Fashion Magazine",
    subtitle: "Digital Fashion Magazine Platform",
    description:
      "A visually driven publication platform featuring fashion editorials, cultural stories, and lifestyle content from the mountain regions of Malawi — combining web development with creative media production.",
    tags: ["Web", "Digital Magazine", "Fashion & Culture"],
    github: "https://github.com/KizioTech/MFM",
    tagColor: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  },
  {
    icon: Database,
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    name: "Survey Builder",
    subtitle: "Offline-first Mobile Data Collection — In Development",
    description:
      "An open, flexible offline-first mobile data collection platform — a free alternative to SurveyCTO built for African researchers and NGOs. React-driven, designed for low-connectivity field environments.",
    tags: ["React", "In Development", "African Researchers"],
    github: null,
    tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    inDev: true,
  },
];

// ─── Tech stack ───────────────────────────────────────────────────────────────
const techStack = [
  {
    group: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "R", "LaTeX", "PHP"],
  },
  {
    group: "Frameworks & Libraries",
    items: ["React", "Tailwind CSS", "Node.js", "Express"],
  },
  {
    group: "Data & Research",
    items: ["SPSS", "Recharts", "D3.js", "Chart.js"],
  },
  {
    group: "Tools",
    items: ["Git", "Linux", "Figma", "VS Code"],
  },
];

// ─── Goals ────────────────────────────────────────────────────────────────────
const goals: { shortIcon: LucideIcon; shortTerm: string; longIcon: LucideIcon; longTerm: string }[] = [
  {
    shortIcon: Rocket,
    shortTerm: "Launch Survey Builder beta",
    longIcon: BookMarked,
    longTerm: "Mathematics-based author & researcher",
  },
  {
    shortIcon: PenLine,
    shortTerm: "Publish mathematical modelling papers",
    longIcon: Database,
    longTerm: "Sustainable software for African researchers",
  },
  {
    shortIcon: Trophy,
    shortTerm: "Complete Bachelor of Science in Mathematics",
    longIcon: Globe,
    longTerm: "Meaningful open-source contributions globally",
  },
  {
    shortIcon: Radio,
    shortTerm: "Expand Sing Unto The Lord",
    longIcon: Building2,
    longTerm: "R&D consultancy in Malawi",
  },
  {
    shortIcon: BookOpen,
    shortTerm: "Publish my first book",
    longIcon: Palette,
    longTerm: "Fusion of mathematics, art & technology",
  },
];

// ─── Focus areas ──────────────────────────────────────────────────────────────
const focusAreas = [
  {
    icon: Microscope,
    title: "Survey Builder",
    desc: "Offline-first open alternative to SurveyCTO for African researchers and NGOs",
  },
  {
    icon: BookOpen,
    title: "Teaching",
    desc: "Teaching diploma students research design, survey methods & SPSS",
  },
  {
    icon: Globe,
    title: "Sing Unto The Lord",
    desc: "Maintaining and enhancing the digital hymnbook PWA",
  },
  {
    icon: GraduationCap,
    title: "JMC Calculus Notes",
    desc: "Expanding calculus lecture notes series for student use",
  },
  {
    icon: Users,
    title: "matstat Society",
    desc: "Growing the UNIMA Mathematics & Statistics Society platform",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const About = () => {
  const { src: photoSrc, fading } = useRotatingPhoto(8000);

  return (
    <Layout>
      <main className="min-h-screen">
        <PageHeader
          index="003"
          eyebrow="About JMC"
          title={
            <>
              Mathematician ·<br />Developer · Artist
            </>
          }
          description="Building at the intersection of math, code & creativity — from Zomba, Malawi 🇲🇼"
        />

        {/* ── Hero / Portrait ─────────────────────────────────────────── */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface">
          <div className="max-w-container-max mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
              {/* Photo */}
        <div className="flex justify-center lg:justify-start lg:h-full">
          <div className="relative w-full max-w-[400px] lg:max-w-none lg:h-full">
            {/* Decorative frame */}
            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-primary/30 via-secondary/20 to-primary/10 blur-sm" />
            <div className="relative w-full aspect-[3/4] lg:aspect-auto lg:h-full min-h-[320px] rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl">
              <img
                src={photoSrc}
                alt="Josophat Makawa Chifundo — JMC"
                className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
                style={{ opacity: fading ? 0 : 1 }}
              />
              {/* Photo index dots */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {PHOTOS.map((p, i) => (
                  <span
                    key={p}
                    className={`block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      photoSrc === p ? "bg-white scale-125" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

              {/* Bio */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h1 className="font-headline-h1 text-headline-h1 text-on-surface">
                    Josophat Makawa Chifundo
                  </h1>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    <GraduationCap className="w-3.5 h-3.5" />
                    BSc Mathematics · UNIMA
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-surface-container text-on-surface-variant border border-outline-variant">
                    <MapPin className="w-3.5 h-3.5" />
                    Zomba, Malawi
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary">
                    <Code2 className="w-3.5 h-3.5" />
                    KizioTech
                  </span>
                </div>

                <div className="space-y-4 text-on-surface-variant font-body-md text-body-md leading-relaxed mb-8">
                  <p>
                    I'm a Mathematics student at <strong className="text-on-surface">UNIMA</strong> with a deep
                    interest in computational thinking, mathematical modelling, and building digital tools
                    that solve real-world problems — especially in research, education, and humanitarian
                    contexts across Africa.
                  </p>
                  <p>
                    My work spans <strong className="text-on-surface">analytical mathematics</strong>,{" "}
                    <strong className="text-on-surface">web development</strong>,{" "}
                    <strong className="text-on-surface">digital publishing</strong>, and{" "}
                    <strong className="text-on-surface">community tools</strong>. I build things that matter:
                    survey platforms for researchers, worship tools for church communities, fashion media,
                    academic lecture notes, and mathematical study resources.
                  </p>
                </div>

                {/* Social Links */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-3">
                    Connect with me
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map(({ name, href, Icon, color }) => (
                      <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={name}
                        title={name}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface-variant text-sm font-medium transition-all duration-200 hover:border-primary/40 hover:bg-surface-container-high ${color}`}
                      >
                        <Icon size={16} />
                        <span>{name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Currently Focused On ────────────────────────────────────── */}
        <section className="py-14 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-h2 text-headline-h2 text-primary mb-2">
              Right Now I'm Focused On
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              Active projects and commitments shaping my days in 2025.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {focusAreas.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-surface border border-outline-variant rounded-xl p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                  </div>
                  <h3 className="font-headline-h3 text-headline-h3 text-on-surface leading-tight">
                    {title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Quote ───────────────────────────────────────────────────── */}
        <section className="py-10 px-margin-mobile md:px-margin-desktop bg-primary-container relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#dae2fd_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative z-10 max-w-container-max mx-auto text-center">
            <p className="font-headline-h2 text-headline-h2 text-on-primary-fixed italic leading-relaxed max-w-3xl mx-auto">
              "Numbers sharpen my mind, art softens it, and code brings both to life."
            </p>
            <p className="mt-4 font-label-caps text-label-caps text-on-primary-container/70">
              — Josophat Makawa · KizioTech · Zomba, Malawi
            </p>
          </div>
        </section>

        {/* ── Projects ────────────────────────────────────────────────── */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-h2 text-headline-h2 text-primary mb-2">
              Projects & Repositories
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-10">
              Things I've built — or am building — that matter.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((p) => {
                const ProjectIcon = p.icon;
                return (
                  <div
                    key={p.name}
                    className={`relative bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${
                      p.inDev ? "border-dashed" : ""
                    }`}
                  >
                    {p.inDev && (
                      <span className="absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-semibold">
                        In Development
                      </span>
                    )}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${p.iconBg}`}>
                          <ProjectIcon className="w-[18px] h-[18px]" />
                        </div>
                        <h3 className="font-headline-h3 text-headline-h3 text-on-surface">
                          {p.name}
                        </h3>
                      </div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant mb-3 mt-1">
                        {p.subtitle}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${p.tagColor}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-auto pt-2">
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          GitHub
                        </a>
                      )}
                      {p.live && (
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          Live Site
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Tech Stack ──────────────────────────────────────────────── */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-h2 text-headline-h2 text-primary mb-2">
              Tech Stack
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-10">
              Tools and technologies I work with regularly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {techStack.map(({ group, items }) => (
                <div
                  key={group}
                  className="bg-surface border border-outline-variant rounded-xl p-5"
                >
                  <h3 className="font-label-caps text-label-caps text-primary mb-4">
                    {group}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface border border-outline-variant font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Goals ───────────────────────────────────────────────────── */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-h2 text-headline-h2 text-primary mb-2">
              Goals
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-10">
              Where I'm headed — near and far.
            </p>
            <div className="overflow-x-auto rounded-xl border border-outline-variant">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary-container">
                    <th className="text-left px-6 py-4 font-label-caps text-label-caps text-on-primary-container">
                      2025 — Short-term
                    </th>
                    <th className="text-left px-6 py-4 font-label-caps text-label-caps text-on-primary-container border-l border-outline-variant">
                      Long-term Vision
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {goals.map((g, i) => (
                    <tr
                      key={i}
                      className="border-t border-outline-variant hover:bg-surface-container-low transition-colors"
                    >
                      <td className="px-6 py-4 text-on-surface font-body-sm text-body-sm">
                        <span className="inline-flex items-center gap-2">
                          <g.shortIcon className="w-4 h-4 text-primary shrink-0" />
                          {g.shortTerm}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-body-sm text-body-sm border-l border-outline-variant">
                        <span className="inline-flex items-center gap-2">
                          <g.longIcon className="w-4 h-4 text-secondary shrink-0" />
                          {g.longTerm}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Beyond Code ─────────────────────────────────────────────── */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-h2 text-headline-h2 text-primary mb-10">
              Beyond Code
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: GraduationCap,
                  title: "Mathematics",
                  color: "text-primary bg-primary/10",
                  body: "Differential equations, numerical analysis, contraction mappings, series convergence, and the beauty of rigorous proof.",
                },
                {
                  icon: Palette,
                  title: "Art & Design",
                  color: "text-secondary bg-secondary/10",
                  body: "Digital art, visual storytelling, and UI/UX that blends mathematical precision with aesthetic elegance. Fashion and media production through MFM.",
                },
                {
                  icon: Users,
                  title: "Community",
                  color: "text-tertiary bg-tertiary/10",
                  body: "Active in UNIMA Church of Christ · Mentoring diploma students in research skills · Running the UNIMA Maths & Stats Society · Advocating for digital literacy in African academia.",
                },
              ].map(({ icon: Icon, title, color, body }) => (
                <div
                  key={title}
                  className="bg-surface border border-outline-variant rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-headline-h3 text-headline-h3 text-on-surface mb-3">
                    {title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Connect ─────────────────────────────────────────────────── */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface text-center">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-h2 text-headline-h2 text-primary mb-3">
              Let's Connect
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-lg mx-auto">
              Whether you're a student, researcher, collaborator, or just curious — I'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {socialLinks.map(({ name, href, Icon, color }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  title={name}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border border-outline-variant bg-surface-container text-on-surface-variant text-sm font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40 ${color}`}
                >
                  <Icon size={18} />
                  <span>{name}</span>
                </a>
              ))}
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-on-primary font-headline-h3 text-headline-h3 rounded-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Send a Message
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default About;