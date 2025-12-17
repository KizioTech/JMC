import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TutorialRenderer from './TutorialRenderer';
import Layout from './layout/Layout';
import { ArrowLeft, ChevronLeft, Menu, X, BookOpen, FileText, Smartphone, RotateCw, ChevronRight } from 'lucide-react';
import { getTutorialNavigation, navigationConfig } from '../config/navigationConfig';

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

const Button = ({
  children,
  onClick,
  variant = 'default',
  className = '',
  size = 'default'
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  size?: 'default' | 'sm';
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3"
  };

  return (
    <button
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
};

interface TutorialLoaderProps {
  filePath: string;
  title?: string;
}

interface NavItem {
  id: string;
  label: string;
  level: number;
}

interface NavGroup {
  id: string;
  label: string;
  children: NavItem[];
}

// Mobile Warning Modal Component
const MobileWarningModal = ({ onClose, onDontShowAgain }: { onClose: () => void; onDontShowAgain: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mobile Device Detected</h3>
        </div>

        <div className="space-y-3 mb-6 text-gray-700 dark:text-gray-300">
          <p className="flex items-start gap-2">
            <RotateCw className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <span>For the best experience viewing mathematical equations, please rotate your device to <strong>landscape mode</strong>.</span>
          </p>
          <p className="text-sm">
            Some complex equations may be difficult to read in portrait orientation due to screen width limitations.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Got It
          </button>
          <button
            onClick={onDontShowAgain}
            className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2 transition-colors text-sm"
          >
            Don't Show Again
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MathLoading = () => {
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);

  const phases = [
    "Initializing...",
    "Loading tutorial...",
    "Parsing mathematics...",
    "Setting up questions...",
    "Almost ready..."
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 300);

    const phaseInterval = setInterval(() => {
      setLoadingPhase(prev => (prev + 1) % phases.length);
    }, 1200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <motion.div
        className="text-center max-w-md px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-48 h-48 mx-auto mb-8">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 backdrop-blur-sm border-2 border-primary/40 flex items-center justify-center shadow-lg">
              <BookOpen className="w-12 h-12 text-primary" />
            </div>
          </motion.div>

          {["∫", "∑", "π", "√", "∞", "Δ", "θ", "α"].map((symbol, index) => {
            const angle = (index * 360) / 8;
            const radius = 72;
            return (
              <motion.div
                key={symbol}
                className="absolute w-10 h-10 flex items-center justify-center rounded-full bg-card border border-primary/30 shadow-md"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: Math.cos((angle * Math.PI) / 180) * radius,
                  y: Math.sin((angle * Math.PI) / 180) * radius,
                  rotate: -360,
                }}
                transition={{
                  opacity: { delay: index * 0.05, duration: 0.3 },
                  scale: { delay: index * 0.05, duration: 0.3 },
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                }}
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: "-20px",
                  marginTop: "-20px",
                }}
              >
                <motion.span
                  className="text-lg font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  {symbol}
                </motion.span>
              </motion.div>
            );
          })}

          {[0, 1, 2].map((i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute inset-0 rounded-full border-2"
              style={{
                borderColor: `hsl(var(--primary) / ${0.2 - i * 0.05})`,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.6],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <motion.h2
          className="text-2xl font-bold mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
            Loading Tutorial
          </span>
        </motion.h2>

        <div className="h-6 mb-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingPhase}
              className="text-sm text-muted-foreground font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {phases[loadingPhase]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="w-full mb-4">
          <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden border border-primary/20">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <motion.p
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.min(Math.round(progress), 100)}% complete
        </motion.p>
      </motion.div>
    </div>
  );
};

const TutorialLoader = ({ filePath, title }: TutorialLoaderProps) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [navigation, setNavigation] = useState<NavGroup[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  // Get navigation data from config using current route
  const currentRoute = window.location.pathname;
  const navData = getTutorialNavigation(currentRoute);
  const prevTutorial = navData?.prev;
  const nextTutorial = navData?.next;
  const currentTutorial = navData?.current;
  const notesPath = currentTutorial?.notesPath;

  useEffect(() => {
    // Check if on mobile and show warning
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasSeenWarning = localStorage.getItem('hideOrientationWarning') === 'true';

    if (isMobile && !hasSeenWarning) {
      setShowMobileWarning(true);
    }
  }, []);

  const handleDontShowAgain = () => {
    localStorage.setItem('hideOrientationWarning', 'true');
    setShowMobileWarning(false);
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(filePath);
        const text = await response.text();
        setContent(text);

        setTimeout(() => {
          setLoading(false);
          extractNavigation(text);
        }, 1500);
      } catch (error) {
        console.error('Error loading content:', error);
        setLoading(false);
      }
    };

    loadContent();
  }, [filePath]);

  const extractNavigation = (text: string) => {
    const lines = text.split('\n');
    const nav: NavGroup[] = [];
    let currentGroup: NavGroup | null = null;

    lines.forEach((line) => {
      const h1Match = line.match(/^# (.+)/);
      const h2Match = line.match(/^## (.+)/);
      const h3Match = line.match(/^### (.+)/);

      if (h1Match || h2Match) {
        const label = (h1Match || h2Match)![1];
        const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        currentGroup = {
          id,
          label,
          children: []
        };
        nav.push(currentGroup);
      } else if (h3Match && currentGroup) {
        const label = h3Match[1];
        const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        currentGroup.children.push({
          id,
          label,
          level: 3
        });
      }
    });

    setNavigation(nav);
    if (nav.length > 0) {
      setExpandedSections(new Set([nav[0].id]));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3');
      const scrollPosition = window.scrollY + 100;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i] as HTMLElement;
        if (heading.offsetTop <= scrollPosition) {
          setActiveSection(heading.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const formatNavLabel = (label: string) => {
    return label.replace(/\$([^$]+)\$/g, '<span class="math-nav">$1</span>');
  };

  const goToTutorials = () => {
    window.location.href = navigationConfig.tutorialsIndexPath;
  };

  const goToNotes = () => {
    if (notesPath) {
      window.location.href = notesPath;
    }
  };

  if (loading) {
    return (
      <Layout>
        <MathLoading />
      </Layout>
    );
  }

  return (
    <Layout>
      <AnimatePresence>
        {showMobileWarning && (
          <MobileWarningModal
            onClose={() => setShowMobileWarning(false)}
            onDontShowAgain={handleDontShowAgain}
          />
        )}
      </AnimatePresence>

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <motion.aside
          initial={{ x: sidebarOpen ? 0 : -320 }}
          animate={{ x: sidebarOpen ? 0 : -320 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="hidden lg:block fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto z-40 shadow-xl"
        >
          <div className="p-6">
            <div className="mb-6">
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4" />
                Tutorial Contents
              </h3>

              <ul className="space-y-1">
                {navigation.map((group) => (
                  <li key={group.id}>
                    <button
                      onClick={() => {
                        const isExpanded = expandedSections.has(group.id);
                        setExpandedSections(prev => {
                          const newSet = new Set(prev);
                          if (isExpanded) {
                            newSet.delete(group.id);
                          } else {
                            newSet.add(group.id);
                          }
                          return newSet;
                        });
                        if (!expandedSections.has(group.id)) {
                          scrollToSection(group.id);
                        }
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm font-serif transition-all",
                        activeSection === group.id || group.children.some(child => child.id === activeSection)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-primary"
                      )}
                      dangerouslySetInnerHTML={{ __html: formatNavLabel(group.label) }}
                    />
                    {expandedSections.has(group.id) && group.children.length > 0 && (
                      <ul className="ml-4 space-y-1 mt-1">
                        {group.children.map((child) => (
                          <motion.li
                            key={child.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <button
                              onClick={() => scrollToSection(child.id)}
                              className={cn(
                                "w-full text-left px-3 py-1 rounded-md text-xs font-serif transition-all",
                                activeSection === child.id
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:bg-muted hover:text-primary"
                              )}
                              dangerouslySetInnerHTML={{ __html: formatNavLabel(child.label) }}
                            />
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>


            {/* Cross-link to Notes */}
            {notesPath && (
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-4">
                <button
                  onClick={goToNotes}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-md"
                >
                  <FileText className="w-5 h-5" />
                  View Notes
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
              <div className="space-y-2">
                {prevTutorial && (
                  <button
                    onClick={() => window.location.href = prevTutorial.tutorialPath}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm font-serif text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:-translate-x-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="truncate">{prevTutorial.title}</span>
                  </button>
                )}
                <button
                  onClick={goToTutorials}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-serif text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Tutorials
                </button>
                {nextTutorial && (
                  <button
                    onClick={() => window.location.href = nextTutorial.tutorialPath}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm font-serif text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 justify-end text-right"
                  >
                    <span className="truncate">{nextTutorial.title}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="lg:hidden fixed left-0 top-0 h-full w-80 max-w-[90vw] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto z-50 shadow-2xl"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Tutorial Contents
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <ul className="space-y-1 mb-6">
                    {navigation.map((group) => (
                      <li key={group.id}>
                        <button
                          onClick={() => {
                            const isExpanded = expandedSections.has(group.id);
                            setExpandedSections(prev => {
                              const newSet = new Set(prev);
                              if (isExpanded) {
                                newSet.delete(group.id);
                              } else {
                                newSet.add(group.id);
                              }
                              return newSet;
                            });
                            if (!expandedSections.has(group.id)) {
                              scrollToSection(group.id);
                            }
                            setMobileSidebarOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-sm font-serif transition-all",
                            activeSection === group.id || group.children.some(child => child.id === activeSection)
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-primary"
                          )}
                          dangerouslySetInnerHTML={{ __html: formatNavLabel(group.label) }}
                        />
                        {expandedSections.has(group.id) && group.children.length > 0 && (
                          <ul className="ml-4 space-y-1 mt-1">
                            {group.children.map((child) => (
                              <motion.li
                                key={child.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                              >
                                <button
                                  onClick={() => {
                                    scrollToSection(child.id);
                                    setMobileSidebarOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-3 py-1 rounded-md text-xs font-serif transition-all",
                                    activeSection === child.id
                                      ? "bg-primary/10 text-primary font-medium"
                                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                                  )}
                                  dangerouslySetInnerHTML={{ __html: formatNavLabel(child.label) }}
                                />
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>


                  {/* Cross-link to Notes - Mobile */}
                  {notesPath && (
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-4">
                      <button
                        onClick={() => {
                          goToNotes();
                          setMobileSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-lg font-medium transition-all shadow-md"
                      >
                        <FileText className="w-5 h-5" />
                        View Notes
                      </button>
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                    <div className="space-y-2">
                      {prevTutorial && (
                        <button
                          onClick={() => {
                            window.location.href = prevTutorial.tutorialPath;
                            setMobileSidebarOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-serif text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="truncate">{prevTutorial.title}</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          goToTutorials();
                          setMobileSidebarOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-serif text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Tutorials
                      </button>
                      {nextTutorial && (
                        <button
                          onClick={() => {
                            window.location.href = nextTutorial.tutorialPath;
                            setMobileSidebarOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-serif text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 justify-end text-right"
                        >
                          <span className="truncate">{nextTutorial.title}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            "hidden lg:flex fixed top-20 z-50 bg-blue-600 text-white p-2 rounded-r-md shadow-lg transition-all items-center justify-center hover:bg-blue-700",
            sidebarOpen ? "left-72" : "left-0"
          )}
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden fixed top-20 left-2 sm:left-4 z-40 bg-blue-600 text-white p-2 rounded-md shadow-lg hover:bg-blue-700"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        <main
          className={cn(
            "flex-1 transition-all duration-300 bg-gray-50 dark:bg-gray-950",
            "lg:ml-0",
            sidebarOpen ? "lg:ml-72" : "lg:ml-0"
          )}
        >
          <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <TutorialRenderer content={content} />
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default TutorialLoader;