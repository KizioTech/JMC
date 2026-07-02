import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./components/ui/Loading";

// Lazy load all page components
const Index = lazy(() => import("./pages/Index"));
const Library = lazy(() => import("./pages/Library"));
const Tutorials = lazy(() => import("./pages/Tutorials"));
const Courses = lazy(() => import("./pages/Courses"));
const JMCPlus = lazy(() => import("./pages/JMCPlus"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
// Dynamic DB-backed routes
const NotePage = lazy(() => import("./pages/NotePage"));
const TutorialPage = lazy(() => import("./pages/TutorialPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const QuizPage = lazy(() => import("./components/QuizPage"));

// Admin pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const NotesManager = lazy(() => import("./pages/admin/NotesManager"));
const NoteEditor = lazy(() => import("./pages/admin/NoteEditor"));
const TutorialsManager = lazy(() => import("./pages/admin/TutorialsManager"));
const TutorialEditor = lazy(() => import("./pages/admin/TutorialEditor"));
const SubjectsManager = lazy(() => import("./pages/admin/SubjectsManager"));
const QuizzesManager = lazy(() => import("./pages/admin/QuizzesManager"));
const CoursesManager = lazy(() => import("./pages/admin/CoursesManager"));
const MediaManager = lazy(() => import("./pages/admin/MediaManager"));

// Preload critical routes
const preloadCriticalRoutes = () => {
  // Preload search service for better UX
  import("./services/searchService");
  // Preload common components
  import("./components/MarkdownRenderer");
};

const queryClient = new QueryClient();

const App = () => {
  // Preload critical resources
  React.useEffect(() => {
    preloadCriticalRoutes();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/library" element={<Library />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/auth" element={<Auth />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="notes" element={<NotesManager />} />
              <Route path="notes/:id" element={<NoteEditor />} />
              <Route path="tutorials" element={<TutorialsManager />} />
              <Route path="tutorials/:id" element={<TutorialEditor />} />
              <Route path="subjects" element={<SubjectsManager />} />
              <Route path="quizzes" element={<QuizzesManager />} />
              <Route path="courses" element={<CoursesManager />} />
              <Route path="media" element={<MediaManager />} />
            </Route>
            
            <Route path="/jmcplus" element={<JMCPlus />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            
            {/* Dynamic DB-backed routes (new URL scheme) */}
            <Route path="/notes/:subject/:slug" element={<NotePage />} />
            <Route path="/tutorials/:subject/:slug" element={<TutorialPage />} />

            {/* Quiz Routes */}
            <Route path="/quiz/:quizId" element={<QuizPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;