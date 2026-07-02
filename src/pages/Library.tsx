import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, ChevronDown, ChevronUp, SortAsc, SortDesc } from "lucide-react";
import { NoteCardSkeleton } from "@/components/ui/Skeletons";
import { useQuery } from "@tanstack/react-query";
import { getAllNotes, getAllSubjects, NoteRow, SubjectRow } from "@/services/contentService";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<"title" | "date">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch subjects for categories
  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: getAllSubjects
  });

  // Fetch all published notes
  const { data: notes = [], isLoading: loadingNotes, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: getAllNotes
  });

  // Realtime subscription for notes
  useEffect(() => {
    const channel = supabase.channel('public:notes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => {
        refetch();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const loading = loadingSubjects || loadingNotes;

  // Group notes by subject
  const groupedNotes = subjects.reduce((acc, subject) => {
    acc[subject.slug] = notes.filter(n => n.subject_id === subject.id);
    return acc;
  }, {} as Record<string, NoteRow[]>);

  const filteredDocuments = Object.entries(groupedNotes).reduce((acc, [category, docs]) => {
    if (activeCategory === "all" || activeCategory === category) {
      let filtered = docs.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.subjects?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Sort the filtered results
      filtered = filtered.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortBy) {
          case "date":
            aValue = new Date(a.updated_at || 0).getTime();
            bValue = new Date(b.updated_at || 0).getTime();
            break;
          default: // title
            aValue = a.title || "";
            bValue = b.title || "";
        }

        const comparison = sortBy === "title" 
          ? aValue.localeCompare(bValue)
          : aValue > bValue ? 1 : -1;
        
        return sortOrder === "asc" ? comparison : -comparison;
      });

      if (filtered.length > 0) {
        acc[category] = filtered;
      }
    }
    return acc;
  }, {} as Record<string, NoteRow[]>);

  const renderDocumentCard = (doc: NoteRow, categorySlug: string) => {
    const subjectName = doc.subjects?.name || categorySlug;
    return (
      <Card key={doc.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20 flex flex-col h-full">
        <div className="aspect-[16/9] bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 flex items-center justify-center p-4 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative">
            <BookOpen className="w-12 h-12 text-primary/70" />
            <div className="absolute -inset-8 bg-primary/5 blur-2xl rounded-full" />
          </div>
        </div>

        <CardHeader className="pb-3 flex-none">
          <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
            {doc.title}
          </CardTitle>
          <CardDescription className="text-xs">
            {subjectName}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 flex-1 flex flex-col justify-end">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              Note
            </Badge>
          </div>

          <div className="flex gap-2 pt-2 mt-auto">
            <Link to={`/notes/${doc.subjects?.slug}/${doc.slug}`} className="w-full">
              <Button
                size="sm"
                variant="default"
                className="w-full text-xs h-8"
              >
                Read Note
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground py-16 relative overflow-hidden">
        <div className="math-bg absolute inset-0" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">
            Digital Library
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Your gateway to a vast collection of mathematical resources. Explore study notes categorised by subject.
          </p>

          {/* Search and Sort */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search for notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/90 backdrop-blur-sm"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "title" | "date")}
                className="px-3 py-1 text-sm border border-border rounded-md bg-background"
              >
                <option value="title">Title</option>
                <option value="date">Date Updated</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-background min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="flex flex-wrap w-full justify-start h-auto mb-8 gap-2 bg-transparent">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border">All</TabsTrigger>
              {subjects.map(subject => (
                <TabsTrigger key={subject.slug} value={subject.slug} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border">
                  {subject.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Individual Category Views */}
            {subjects.map(subject => (
              <TabsContent key={subject.slug} value={subject.slug} className="mt-0">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-8 h-8 text-primary/70" />
                    <h2 className="text-2xl font-bold">{subject.name}</h2>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 align-stretch">
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <div key={i}><NoteCardSkeleton /></div>
                      ))
                    ) : filteredDocuments[subject.slug]?.length > 0 ? (
                      filteredDocuments[subject.slug].map((doc) => renderDocumentCard(doc, subject.slug))
                    ) : (
                      <p className="text-muted-foreground col-span-full">No notes found matching your criteria.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}

            {/* All Categories View */}
            <TabsContent value="all" className="mt-0">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i}><NoteCardSkeleton /></div>
                  ))}
                </div>
              ) : Object.keys(filteredDocuments).length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No notes found matching your search.</p>
              ) : (
                Object.entries(filteredDocuments).map(([categorySlug, docs]) => {
                  const subjectName = subjects.find(s => s.slug === categorySlug)?.name || categorySlug;
                  const isExpanded = expanded[categorySlug] || false;
                  const docsToShow = isExpanded ? docs : docs.slice(0, 6);
                  
                  return (
                    <div key={categorySlug} className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="w-8 h-8 text-primary/70" />
                        <h2 className="text-2xl font-bold">{subjectName}</h2>
                      </div>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 align-stretch">
                        {docsToShow.map((doc) => renderDocumentCard(doc, categorySlug))}
                      </div>
                      
                      {docs.length > 6 && (
                        <div className="flex justify-center mt-6">
                          <Button
                            onClick={() => setExpanded(prev => ({ ...prev, [categorySlug]: !isExpanded }))}
                            variant="outline"
                            className="gap-2"
                          >
                            {isExpanded ? (
                              <>Show Less <ChevronUp className="w-4 h-4" /></>
                            ) : (
                              <>See More <ChevronDown className="w-4 h-4" /></>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Library;