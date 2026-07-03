import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { Search, ArrowRight } from "lucide-react";
import { NoteCardSkeleton } from "@/components/ui/Skeletons";
import { useQuery } from "@tanstack/react-query";
import { getAllNotes, getAllSubjects, NoteRow } from "@/services/contentService";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import NoteCard from "@/components/library/NoteCard";

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

  const totalShown = Object.values(filteredGroups).reduce((n, docs) => n + docs.length, 0);

  return (
    <Layout>
      <main className="min-h-screen bg-[#F5F6FA]">
        {/* Masthead */}
        <header className="border-b-2 border-[#0A0A0F] pt-14 pb-8">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="font-code text-[11px] font-bold tracking-wide text-white bg-[#4338FF] px-2 py-1">001</span>
              <span className="font-code text-[11px] font-bold tracking-[0.25em] text-[#0A0A0F]/50 uppercase">Library Index</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <h1 className="font-inter text-[40px] sm:text-[52px] leading-[0.98] font-bold text-[#0A0A0F] mb-4">
                  Study notes,<br />indexed by subject.
                </h1>
                <p className="text-[15px] text-[#0A0A0F]/60 max-w-md">
                  Every proof, derivation, and worked identity JMC has published — sorted, searchable, and numbered like a catalog.
                </p>
              </div>

              <div className="w-full lg:w-80 shrink-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0A0F]/40 w-4 h-4" />
                  <input
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-[#0A0A0F] bg-white font-code text-[13px] text-[#0A0A0F] placeholder:text-[#0A0A0F]/35 focus:outline-none focus:border-[#4338FF] transition-colors"
                    placeholder="search notes..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Subject filter — horizontal, underline-indicated */}
        <div className="sticky top-16 z-10 bg-[#F5F6FA]/95 backdrop-blur-sm border-b border-[#0A0A0F]/12">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "shrink-0 font-code text-[11px] font-bold uppercase tracking-wider px-4 py-4 border-b-2 transition-colors whitespace-nowrap",
                  activeCategory === "all"
                    ? "border-[#4338FF] text-[#0A0A0F]"
                    : "border-transparent text-[#0A0A0F]/40 hover:text-[#0A0A0F]"
                )}
              >
                All
              </button>
              {subjects.map(subject => (
                <button
                  key={subject.slug}
                  onClick={() => setActiveCategory(subject.slug)}
                  className={cn(
                    "shrink-0 font-code text-[11px] font-bold uppercase tracking-wider px-4 py-4 border-b-2 transition-colors whitespace-nowrap",
                    activeCategory === subject.slug
                      ? "border-[#4338FF] text-[#0A0A0F]"
                      : "border-transparent text-[#0A0A0F]/40 hover:text-[#0A0A0F]"
                  )}
                >
                  {subject.name}
                </button>
              ))}
              <span className="ml-auto shrink-0 font-code text-[10px] text-[#0A0A0F]/35 pl-4 hidden sm:inline">
                {loading ? "" : `${totalShown} ${totalShown === 1 ? "note" : "notes"}`}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-14">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <NoteCardSkeleton key={i} />)}
            </div>
          ) : Object.keys(filteredGroups).length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-[#0A0A0F]/15">
              <p className="font-inter text-xl font-bold text-[#0A0A0F] mb-1">No matches.</p>
              <p className="font-code text-[12px] text-[#0A0A0F]/50">Try a different subject or search term.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-14">
              {Object.entries(filteredGroups).map(([categorySlug, docs]) => {
                const subjectName = subjects.find(s => s.slug === categorySlug)?.name || categorySlug;
                const isExpanded = expanded[categorySlug] || false;
                const docsToShow = isExpanded ? docs : docs.slice(0, 8);

                return (
                  <section key={categorySlug}>
                    <div className="flex items-baseline justify-between mb-5">
                      <h2 className="font-inter text-2xl font-bold text-[#0A0A0F]">
                        {subjectName}
                      </h2>
                      {docs.length > 8 && (
                        <button
                          onClick={() => setExpanded(prev => ({ ...prev, [categorySlug]: !isExpanded }))}
                          className="font-code text-[11px] font-bold uppercase tracking-wider text-[#4338FF] flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          {isExpanded ? "Show less" : `All ${docs.length}`}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {docsToShow.map((doc, i) => (
                        <NoteCard key={doc.id} doc={doc} position={i + 1} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {/* JMC Plus / newsletter band */}
          <div className="mt-16 bg-[#0A0A0F] text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="font-code text-[10px] font-bold tracking-[0.25em] text-[#4338FF] uppercase">JMC Plus</span>
              <h2 className="font-inter text-2xl font-bold mt-2 mb-1">Stay intellectually sharp.</h2>
              <p className="text-sm text-white/60 max-w-md">Advanced proofs, exclusive problem sets, and library updates — weekly.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
              <input
                className="px-4 py-3 bg-white/10 border border-white/20 font-code text-[13px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#4338FF] w-full sm:w-64"
                placeholder="email address"
                type="email"
              />
              <Link to="/JMCPlus">
                <button className="w-full sm:w-auto px-6 py-3 bg-[#4338FF] text-white font-code text-[11px] font-bold uppercase tracking-wider hover:bg-[#3730E8] transition-colors whitespace-nowrap">
                  Subscribe →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Library;