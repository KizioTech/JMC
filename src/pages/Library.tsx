import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, FileText, Calculator, Download, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { getAllDocuments } from "@/services/documentService";

interface Document {
  id: string;
  title: string;
  author: string;
  type: string;
  description: string;
  tags: string[];
  viewUrl?: string;
  downloadUrl?: string;
  isPremium?: boolean;
  size?: string;
  publisher?: string;
  coverImage?: string;
  year?: string;
  semester?: string;
}

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [documents, setDocuments] = useState<Record<string, any[]>>({
    lectures: [],
    textbooks: [],
    exams: [],
    practice: []
  });

  useEffect(() => {
    const loadDocuments = async () => {
      const data = await getAllDocuments();
      setDocuments(data);
    };
    loadDocuments();
  }, []);

  const filteredDocuments = Object.entries(documents).reduce((acc, [category, docs]) => {
    if (activeCategory === "all" || activeCategory === category) {
      const filtered = docs.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
    }
    return acc;
  }, {} as Record<string, Document[]>);

  const handleView = (doc: Document) => {
    if (doc.viewUrl) {
      window.open(doc.viewUrl, '_blank');
    }
  };

  const handleDownload = (doc: Document) => {
    if (doc.downloadUrl && doc.downloadUrl !== '#') {
      const link = document.createElement('a');
      link.href = doc.downloadUrl;
      link.download = doc.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconClass = "w-12 h-12 text-primary/70";
    switch (category) {
      case 'lectures': return <BookOpen className={iconClass} />;
      case 'textbooks': return <FileText className={iconClass} />;
      case 'exams': return <Calculator className={iconClass} />;
      case 'practice': return <Search className={iconClass} />;
      default: return <BookOpen className={iconClass} />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'lectures': return 'Study Notes';
      case 'textbooks': return 'Textbooks';
      case 'exams': return 'Past Exams';
      case 'practice': return 'Practice Materials';
      default: return category;
    }
  };

  const renderDocumentCard = (doc: Document, category: string) => (
    <Card key={doc.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20">
      <div className="aspect-[16/9] bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="relative">
          {getCategoryIcon(category)}
          <div className="absolute -inset-8 bg-primary/5 blur-2xl rounded-full" />
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
          {doc.title}
        </CardTitle>
        <CardDescription className="text-xs">
          {doc.type} • {doc.author}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {doc.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {doc.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {doc.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          {doc.viewUrl && (
            <Button
              size="sm"
              variant="default"
              onClick={() => handleView(doc)}
              className="flex-1 text-xs h-8"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              View
            </Button>
          )}

          {doc.downloadUrl && doc.downloadUrl !== '#' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload(doc)}
              className="flex-1 text-xs h-8"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download
            </Button>
          )}
        </div>

        {doc.size && (
          <p className="text-xs text-muted-foreground pt-1 border-t">
            {doc.size}
            {doc.publisher && ` • ${doc.publisher}`}
          </p>
        )}
      </CardContent>
    </Card>
  );

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
            Your gateway to a vast collection of mathematical resources. Explore lecture notes, textbooks, past exams, and practice materials.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for textbooks, notes, exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/90 backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="lectures">Study Notes</TabsTrigger>
              <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
            </TabsList>

            {/* Individual Category Views */}
            {Object.entries(filteredDocuments).map(([category, docs]) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    {getCategoryIcon(category)}
                    <h2 className="text-2xl font-bold">{getCategoryTitle(category)}</h2>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docs.map((doc) => renderDocumentCard(doc, category))}
                  </div>
                </div>
              </TabsContent>
            ))}

            {/* All Categories View */}
            <TabsContent value="all" className="mt-0">
              {Object.entries(filteredDocuments).map(([category, docs]) => (
                <div key={category} className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    {getCategoryIcon(category)}
                    <h2 className="text-2xl font-bold">{getCategoryTitle(category)}</h2>
                  </div>

                  {(() => {
                    const isExpanded = expanded[category] || false;
                    const docsToShow = isExpanded ? docs : docs.slice(0, 6);
                    return (
                      <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {docsToShow.map((doc) => renderDocumentCard(doc, category))}
                        </div>
                        {docs.length > 6 && (
                          <div className="flex justify-center mt-6">
                            <Button
                              onClick={() => setExpanded(prev => ({ ...prev, [category]: !isExpanded }))}
                              variant="outline"
                              className="gap-2"
                            >
                              {isExpanded ? (
                                <>
                                  Show Less
                                  <ChevronUp className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  See More
                                  <ChevronDown className="w-4 h-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Library;