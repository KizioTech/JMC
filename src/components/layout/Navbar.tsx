import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, ChevronDown, Crown, User, ExternalLink, FileText, BookOpen, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { searchContent, getTypeLabel, getTypeColor, type SearchResult } from "@/services/searchService";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Contact", path: "/contact" },
  ];

  const resourceLinks = [
    { name: "Library", path: "/library" },
    { name: "Tutorials", path: "/tutorials" },
  ];

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchContent(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchResultClick = (result: SearchResult) => {
    setSearchQuery("");
    setShowSearchResults(false);
    
    if (result.type === 'document' && result.path.startsWith('/assets/')) {
      window.open(result.path, '_blank');
    } else {
      navigate(result.path);
    }
  };

  const handleBrowserSearch = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery + " site:yourdomain.com")}`;
    window.open(searchUrl, '_blank');
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'page': return <FileText className="w-4 h-4" />;
      case 'document': return <File className="w-4 h-4" />;
      case 'note': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card shadow-md border-b border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <span className="text-2xl font-bold text-foreground">JMC</span>
          <span className="text-lg font-bold text-foreground">| Math & Academics</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-lg font-medium transition-colors relative py-2",
                isActive(link.path)
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
                  : "text-foreground hover:text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}

          {/* Resources Dropdown */}
          <div className="relative">
            <button
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className={cn(
                "flex items-center gap-1 text-lg font-medium transition-colors py-2",
                resourcesOpen ? "text-primary" : "text-foreground hover:text-muted-foreground"
              )}
            >
              Resources
              <ChevronDown
                className={cn("w-4 h-4 transition-transform", resourcesOpen && "rotate-180")}
              />
            </button>
            {resourcesOpen && (
              <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg min-w-[200px] py-2 animate-fade-in-up">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setResourcesOpen(false)}
                    className={cn(
                      "block px-4 py-3 text-lg font-medium transition-colors",
                      isActive(link.path)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted hover:text-primary"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Search and Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search pages, notes, documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              className="pl-10 w-64 focus:w-80 transition-all"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl max-h-[500px] overflow-y-auto z-50">
                {searchResults.length > 0 ? (
                  <>
                    <div className="p-2 space-y-1">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleSearchResultClick(result)}
                          className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-primary">
                              {getResultIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                  {result.title}
                                </h4>
                                <span className={cn(
                                  "text-xs px-2 py-0.5 rounded-full border shrink-0",
                                  getTypeColor(result.type)
                                )}>
                                  {getTypeLabel(result.type)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {result.description}
                              </p>
                              {result.author && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  by {result.author}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-border p-2">
                      <button
                        onClick={handleBrowserSearch}
                        className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Search in browser for more results
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">
                      No results found for "{searchQuery}"
                    </p>
                    <Button
                      onClick={handleBrowserSearch}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Search in browser
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          <Link to="/JMCPlus">
            <Button variant="default" className="gap-2">
              <Crown className="w-4 h-4 text-secondary" />
              JMC Plus
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="outline" className="gap-2">
              <User className="w-4 h-4" />
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-fade-in-up">
          <div className="p-4">
            <div className="relative mb-4" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search pages, notes, documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="pl-10 w-full"
              />
              
              {/* Mobile Search Results */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl max-h-[400px] overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="p-2 space-y-1">
                        {searchResults.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => {
                              handleSearchResultClick(result);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5 text-primary">
                                {getResultIcon(result.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-sm font-medium truncate">
                                    {result.title}
                                  </h4>
                                  <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-full border shrink-0",
                                    getTypeColor(result.type)
                                  )}>
                                    {getTypeLabel(result.type)}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {result.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-border p-2">
                        <button
                          onClick={() => {
                            handleBrowserSearch();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Search in browser
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        No results found
                      </p>
                      <Button
                        onClick={() => {
                          handleBrowserSearch();
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Search in browser
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "py-3 border-b border-border text-lg font-medium transition-colors",
                    isActive(link.path) ? "text-primary bg-primary/5 rounded-md px-2" : "text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="flex items-center justify-between py-3 border-b border-border text-lg font-medium"
              >
                Resources
                <ChevronDown className={cn("w-4 h-4 transition-transform", resourcesOpen && "rotate-180")} />
              </button>
              {resourcesOpen && (
                <div className="pl-4 border-l-2 border-primary ml-2">
                  {resourceLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block py-2 text-lg transition-colors",
                        isActive(link.path) ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </nav>
            <div className="flex flex-col gap-3 mt-4">
              <Link to="/JMCPlus" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full gap-2">
                  <Crown className="w-4 h-4 text-secondary" />
                  JMC Plus
                </Button>
              </Link>
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full gap-2">
                  <User className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;