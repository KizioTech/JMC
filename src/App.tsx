import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
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
const TranscendentalFunctions = lazy(() => import("./pages/notes/TranscendentalFunctions"));
const TrigonometricEquations = lazy(() => import("./pages/notes/TrigonometricEquations"));
const HyperbolicFunctions = lazy(() => import("./pages/notes/HyperbolicFunctions"));
const CountingTechniques = lazy(() => import("./pages/notes/CountingTechniques"));
const PigeonholePrinciple = lazy(() => import("./pages/notes/PigeonholePrinciple"));
const RecurrenceRelations = lazy(() => import("./pages/notes/RecurrenceRelations"));
const AngularMeasure = lazy(() => import("./pages/notes/AngularMeasure"));
const ArcsSectors = lazy(() => import("./pages/notes/ArcsSectors"));
const TranscendentalFunctionsTutorial = lazy(() => import("./pages/notes/TranscendentalFunctionsTutorial"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MarkdownLoader = lazy(() => import("./components/MarkdownLoader"));
import TutorialLoader from "./components/TutorialLoader";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/jmcplus" element={<JMCPlus />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            
            {/* Notes Routes */}
            <Route path="/notes/transcendental-functions" element={<TranscendentalFunctions />} />
            <Route path="/notes/trigonometric-functions" element={<TrigonometricEquations />} />
            <Route path="/notes/hyperbolic-functions" element={<HyperbolicFunctions/>} />
            <Route path="/notes/counting-techniques" element={<CountingTechniques />} />
            <Route path="/notes/pigeonhole-principle" element={<PigeonholePrinciple />} />
            <Route path="/notes/recurrence-relations" element={<RecurrenceRelations />} />
            <Route path="/notes/angular-measure" element={<AngularMeasure />} />
            <Route path="/notes/arcs-and-sectors" element={<ArcsSectors />}/>
            
            {/* Tutorial Routes - Fixed with correct paths */}
            <Route path="/tutorials/calculus/transcendental-functions-tutorial" element={<TutorialLoader filePath="/content/tutorials/calculus/transcendental-functions-tutorial1.md" title="Transcendental Functions Tutorial" />} />
            <Route path="/tutorials/calculus/trigonometric-functions-tutorial" element={<TutorialLoader filePath="/content/tutorials/calculus/trigonometric-functions-tutorial.md" title="Trigonometric Functions Tutorial" />} />
            <Route path="/tutorials/calculus/hyperbolic-functions-tutorial" element={<TutorialLoader filePath="/content/tutorials/calculus/hyperbolic-functions-tutorial.md" title="Hyperbolic Functions Tutorial" />} />
            <Route path="/tutorials/discrete/counting-techniques-tutorial" element={<TutorialLoader filePath="/content/tutorials/discrete/counting-techniques-tutorial.md" title="Counting Techniques Tutorial" />} />
            <Route path="/tutorials/discrete/pigeonhole-principle-tutorial" element={<TutorialLoader filePath="/content/tutorials/discrete/pigeonhole-principle-tutorial.md" title="Pigeonhole Principle Tutorial" />} />
            <Route path="/tutorials/discrete/recurrence-relations-tutorial" element={<TutorialLoader filePath="/content/tutorials/discrete/recurrence-relations-tutorial.md" title="Recurrence Relations Tutorial" />} />
            <Route path="/tutorials/trigonometry/angular-measure-tutorial" element={<TutorialLoader filePath="/content/tutorials/trigonometry/angular-measure-tutorial.md" title="Angular Measure Tutorial" />} />
            <Route path="/tutorials/algebra/quadratic-equations-tutorial" element={<TutorialLoader filePath="/content/tutorials/algebra/quadratic-equations-tutorial.md" title="Solving Quadratic Equations - Interactive Tutorial" />} />
            <Route path="/tutorials/trigonometry/arcs-and-sectors-tutorial" element={<TutorialLoader filePath="/content/tutorials/trigonometry/arcs-and-sectors-tutorial.md" title="Arcs and Sectors Tutorial" />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;