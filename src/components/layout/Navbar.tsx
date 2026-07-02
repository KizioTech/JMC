import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Crown, UserCircle, ExternalLink, FileText, BookOpen, File, Sun, Moon, Palette } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { cn } from "@/lib/utils";
import { searchContent, getTypeLabel, getTypeColor, type SearchResult } from "@/services/searchService";
import { ThemeSelector } from "@/components/ThemeSelector";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { session, signOut, role } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: "Library", path: "/library" },
    { name: "Tutorials", path: "/tutorials" },
    { name: "Courses", path: "/courses" },
    { name: "Contact", path: "/contact" },
  ];

  // Handle scroll for transparent background at top
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        const results = await searchContent(searchQuery);
        setSearchResults(results);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    };
    performSearch();
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

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
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
    <header className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300",
      isScrolled 
        ? "bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm" 
        : "bg-transparent border-transparent"
    )}>
      <div className="max-w-container-max mx-auto flex items-center justify-between px-margin-mobile md:px-margin-desktop h-16 w-full">
        {/* Logo */}
        <Link to="/" className="font-headline-h3 text-headline-h3 font-bold text-primary shrink-0">
          JMC | Math & Academics
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-stack-md">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "font-label-caps text-label-caps transition-colors",
                isActive(link.path)
                  ? "text-primary border-b-2 border-primary pb-1 font-semibold"
                  : "text-on-surface-variant hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-stack-sm">
          {/* Desktop Search */}
          <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant mr-2 relative" ref={searchRef}>
            <Search className="text-outline w-5 h-5 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search calculus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-body-sm w-32 xl:w-48 p-0 text-on-surface placeholder:text-outline"
            />

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <TooltipProvider>
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container border border-outline-variant rounded-lg shadow-xl max-h-[500px] overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="p-2 space-y-1">
                        {searchResults.map((result) => (
                          <Tooltip key={result.id}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleSearchResultClick(result)}
                                className="w-full text-left p-3 rounded-md hover:bg-surface-container-high transition-colors group"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 text-primary">
                                    {getResultIcon(result.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate">
                                        {result.title}
                                      </h4>
                                      <span className={cn(
                                        "text-xs px-2 py-0.5 rounded-full border shrink-0",
                                        getTypeColor(result.type)
                                      )}>
                                        {getTypeLabel(result.type)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant line-clamp-2">
                                      {result.contentSnippet || result.description}
                                    </p>
                                    {result.author && (
                                      <p className="text-xs text-on-surface-variant mt-1">
                                        by {result.author}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-sm bg-surface text-on-surface border-outline-variant">
                              <div>
                                <h4 className="font-semibold mb-1">{result.title}</h4>
                                <div className="text-sm text-on-surface-variant mb-2 prose prose-sm max-w-none">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                      p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>
                                    }}
                                  >
                                    {result.description}
                                  </ReactMarkdown>
                                </div>
                                {result.tags && result.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {result.tags.map((tag) => (
                                      <span key={tag} className="text-xs bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                      <div className="border-t border-outline-variant p-2">
                        <button
                          onClick={handleBrowserSearch}
                          className="w-full text-left p-2 rounded-md hover:bg-surface-container-high transition-colors flex items-center gap-2 text-sm text-on-surface-variant"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Search in browser for more results
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <Search className="w-12 h-12 text-outline/30 mx-auto mb-3" />
                      <p className="text-sm text-on-surface-variant mb-4">
                        No results found for "{searchQuery}"
                      </p>
                      <button
                        onClick={handleBrowserSearch}
                        className="px-4 py-2 border border-outline-variant rounded-md text-sm text-on-surface flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors mx-auto"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Search in browser
                      </button>
                    </div>
                  )}
                </div>
              </TooltipProvider>
            )}
          </div>

          <ThemeSelector />

          {/* Desktop Auth / Admin */}
          {session ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="font-label-caps text-label-caps text-on-surface px-4 py-2 hover:bg-surface-container-low transition-all duration-200 rounded-lg hidden sm:block">
                Dashboard
              </Link>
              {role === 'admin' && (
                <Link to="/admin" className="font-label-caps text-label-caps text-on-surface px-4 py-2 hover:bg-surface-container-low transition-all duration-200 rounded-lg hidden sm:block">
                  Admin
                </Link>
              )}
              <UserCircle 
                className="text-primary w-8 h-8 cursor-pointer hover:bg-surface-container-low rounded-full transition-all p-1" 
                onClick={() => signOut()}
                title="Sign Out"
              />
            </div>
          ) : (
            <Link to="/auth" className="font-label-caps text-label-caps text-on-surface px-4 py-2 hover:bg-surface-container-low transition-all duration-200 rounded-lg">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-surface-container-low transition-colors text-on-surface"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-surface border-b border-outline-variant shadow-lg md:hidden z-40 animate-fade-in-up max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="p-4 flex flex-col gap-4">
            {/* Mobile Search */}
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search pages, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="pl-10 w-full bg-surface-container-low border border-outline-variant rounded-full py-2 text-body-sm focus:outline-none focus:border-primary text-on-surface placeholder:text-outline"
              />
              
              {/* Mobile Search Results */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container border border-outline-variant rounded-lg shadow-xl max-h-[300px] overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    <div className="p-2 space-y-1">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleSearchResultClick(result)}
                          className="w-full text-left p-3 rounded-md hover:bg-surface-container-high transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-primary">
                              {getResultIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate">
                                  {result.title}
                                </h4>
                              </div>
                              <p className="text-xs text-on-surface-variant line-clamp-2">
                                {result.contentSnippet || result.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-xs text-on-surface-variant">
                        No results for "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col border-t border-outline-variant pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "py-3 px-2 text-lg font-medium transition-colors rounded-lg",
                    isActive(link.path) ? "text-primary bg-primary/5" : "text-on-surface"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Theme & Auth Section */}
            <div className="flex flex-col gap-3 border-t border-outline-variant pt-4">
              {/* Theme Selector */}
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-sm font-medium text-on-surface">Theme</span>
                <ThemeSelector />
              </div>

              {/* Divider */}
              <div className="border-t border-outline-variant" />

              {/* JMC Plus Button */}
              <Link 
                to="/JMCPlus" 
                onClick={() => setMobileMenuOpen(false)} 
                className="bg-secondary text-on-secondary py-3 rounded-lg text-center font-label-caps text-label-caps flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                JMC Plus
              </Link>

              {/* Dashboard & Admin Links */}
              {session && (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="border border-outline-variant py-3 rounded-lg text-center font-label-caps text-label-caps text-on-surface"
                  >
                    Dashboard
                  </Link>
                  {role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="border border-outline-variant py-3 rounded-lg text-center font-label-caps text-label-caps text-on-surface"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="border border-outline-variant py-3 rounded-lg text-center font-label-caps text-label-caps text-error hover:bg-error/5 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              )}

              {/* Sign In Button */}
              {!session && (
                <Link 
                  to="/auth" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="border border-primary bg-primary text-on-primary py-3 rounded-lg text-center font-label-caps text-label-caps"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
