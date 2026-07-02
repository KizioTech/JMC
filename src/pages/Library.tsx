import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, ChevronDown, ChevronUp, Crown } from "lucide-react";
import { NoteCardSkeleton } from "@/components/ui/Skeletons";
import { useQuery } from "@tanstack/react-query";
import { getAllNotes, getAllSubjects, NoteRow } from "@/services/contentService";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const getDifficultyStyle = (difficulty?: string | null) => {
  switch (difficulty) {
    case "Beginner":
      return { pill: "bg-beginner-green/10 text-beginner-green", label: "BEGINNER" };
    case "Intermediate":
      return { pill: "bg-intermediate-yellow/10 text-intermediate-yellow", label: "INTERMEDIATE" };
    case "Advanced":
      return { pill: "bg-advanced-red/10 text-advanced-red", label: "ADVANCED" };
    default:
      return { pill: "bg-primary-fixed/30 text-on-primary-fixed", label: "NOTE" };
  }
};

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: getAllSubjects
  });

  const { data: notes = [], isLoading: loadingNotes, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: getAllNotes
  });

  useEffect(() => {
    const channel = supabase.channel('public:notes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => {
        refetch();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refetch]);

  const loading = loadingSubjects || loadingNotes;

  const groupedNotes = subjects.reduce((acc, subject) => {
    const subjectNotes = notes.filter(n =>
      n.subject_id === subject.id &&
      (searchTerm === "" ||
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    if (subjectNotes.length > 0) acc[subject.slug] = subjectNotes;
    return acc;
  }, {} as Record<string, NoteRow[]>);

  const filteredGroups = activeCategory === "all"
    ? groupedNotes
    : Object.fromEntries(
        Object.entries(groupedNotes).filter(([slug]) => slug === activeCategory)
      );

  const renderNoteCard = (doc: NoteRow) => {
    const { pill, label } = getDifficultyStyle(doc.difficulty);
    const subjectSlug = doc.subjects?.slug;
    const date = doc.updated_at ? new Date(doc.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

    return (
      <Link
        to={`/notes/${subjectSlug}/${doc.slug}`}
        key={doc.id}
        className="note-card-hover group bg-surface-container-lowest border border-outline-variant p-gutter rounded-xl transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-md"
      >
        <div className="h-40 w-full rounded-lg mb-4 bg-surface-container overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-fixed/30 to-surface-container-high group-hover:scale-105 transition-transform duration-500">
            <BookOpen className="w-12 h-12 text-primary/40" />
          </div>
        </div>
        <div className="flex items-start justify-between mb-2">
          <span className={cn("px-2 py-0.5 rounded-full font-label-caps text-[10px]", pill)}>{label}</span>
          {date && <span className="font-body-sm text-body-sm text-outline">{date}</span>}
        </div>
        <h3 className="font-headline-h3 text-headline-h3 mb-1 group-hover:text-secondary transition-colors line-clamp-2">{doc.title}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{doc.subjects?.name}</p>
      </Link>
    );
  };

  return (
    <Layout>
      <main className="min-h-screen" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)", backgroundSize: "32px 32px" }}>
        {/* Header */}
        <header className="bg-surface-container-lowest py-stack-lg border-b border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter">
              <div>
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-2 block">Resource Center</span>
                <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">Academic Library</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                  Access curated mathematical proofs, technical documentation, and comprehensive notes designed for rigorous academic mastery.
                </p>
              </div>
              <div className="w-full md:w-96">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-surface font-body-md text-on-surface shadow-sm focus:outline-none placeholder:text-outline"
                    placeholder="Search notes by title or topic..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-md flex flex-col md:flex-row gap-gutter">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-stack-md">
              <div>
                <h3 className="font-label-caps text-label-caps text-outline mb-4">SUBJECTS</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-body-sm text-body-sm",
                      activeCategory === "all"
                        ? "bg-primary-fixed text-on-primary-fixed font-bold"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    )}
                  >
                    <BookOpen className="w-5 h-5" />
                    All Subjects
                  </button>
                  {subjects.map(subject => (
                    <button
                      key={subject.slug}
                      onClick={() => setActiveCategory(subject.slug)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-body-sm text-body-sm",
                        activeCategory === subject.slug
                          ? "bg-primary-fixed text-on-primary-fixed font-bold"
                          : "text-on-surface-variant hover:bg-surface-container-high"
                      )}
                    >
                      <BookOpen className="w-5 h-5 group-hover:translate-x-1 duration-200" />
                      {subject.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* JMC Plus CTA */}
              <div className="p-stack-md bg-secondary text-on-secondary rounded-xl shadow-lg">
                <Crown className="w-6 h-6 mb-2" />
                <h4 className="font-headline-h3 text-headline-h3 mb-2">JMC Plus</h4>
                <p className="font-body-sm text-body-sm opacity-90 mb-4">Unlock advanced proofs and exclusive practice problem sets.</p>
                <Link to="/JMCPlus">
                  <button className="w-full py-2 bg-white text-secondary font-bold rounded-lg hover:bg-surface-container-lowest transition-colors">
                    Upgrade Now
                  </button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Notes Grid */}
          <div className="flex-grow flex flex-col gap-stack-lg">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {Array.from({ length: 6 }).map((_, i) => <NoteCardSkeleton key={i} />)}
              </div>
            ) : Object.keys(filteredGroups).length === 0 ? (
              <div className="text-center py-24">
                <BookOpen className="w-16 h-16 text-outline/30 mx-auto mb-4" />
                <p className="font-body-md text-body-md text-on-surface-variant">No notes found matching your criteria.</p>
              </div>
            ) : (
              Object.entries(filteredGroups).map(([categorySlug, docs]) => {
                const subjectName = subjects.find(s => s.slug === categorySlug)?.name || categorySlug;
                const isExpanded = expanded[categorySlug] || false;
                const docsToShow = isExpanded ? docs : docs.slice(0, 6);

                return (
                  <section key={categorySlug}>
                    <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-gutter">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <h2 className="font-headline-h2 text-headline-h2">{subjectName}</h2>
                      </div>
                      {docs.length > 6 && (
                        <button
                          onClick={() => setExpanded(prev => ({ ...prev, [categorySlug]: !isExpanded }))}
                          className="font-label-caps text-label-caps text-secondary flex items-center gap-1 hover:underline"
                        >
                          {isExpanded ? (<>Show Less <ChevronUp className="w-4 h-4" /></>) : (<>See More <ChevronDown className="w-4 h-4" /></>)}
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                      {docsToShow.map(doc => renderNoteCard(doc))}
                    </div>
                  </section>
                );
              })
            )}

            {/* Newsletter Callout */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-stack-lg flex flex-col md:flex-row items-center gap-stack-lg shadow-sm mt-4">
              <div className="flex-grow">
                <h2 className="font-headline-h2 text-headline-h2 mb-2">Stay intellectually sharp.</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Get the latest mathematical proofs and library updates delivered to your inbox weekly.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input className="px-4 py-2 rounded-lg border border-outline-variant focus:border-primary w-full md:w-64 focus:outline-none text-on-surface" placeholder="Email address" type="email" />
                <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-colors whitespace-nowrap">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Library;