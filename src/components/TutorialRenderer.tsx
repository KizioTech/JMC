import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Copy, Check, Sparkles, EyeOff, Eye } from 'lucide-react';
import { slugify } from '@/components/MarkdownRenderer';

interface Section {
  type: 'content' | 'question';
  text?: string;
  index?: number;
  question?: string;
  solution?: string;
}

interface TutorialRendererProps {
  content: string;
  /** Reports (solvedCount, totalProblems) whenever solved-state changes, so a parent page can render a progress indicator. */
  onProgress?: (solved: number, total: number) => void;
}

// Scroll offset so anchored headings don't hide under the sticky site header.
const SCROLL_MARGIN = 'scroll-mt-28';

// Splits raw tutorial markdown into ordinary prose sections and
// :::question / :::solution pairs.
const parseContent = (text: string): Section[] => {
  const sections: Section[] = [];
  const questionRegex = /:::question\s*\n([\s\S]*?)\n:::\s*\n\s*:::solution\s*\n([\s\S]*?)\n:::/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let questionIndex = 0;

  while ((match = questionRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      sections.push({ type: 'content', text: text.substring(lastIndex, match.index) });
    }
    sections.push({
      type: 'question',
      index: questionIndex++,
      question: match[1].trim(),
      solution: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    sections.push({ type: 'content', text: text.substring(lastIndex) });
  }

  return sections;
};

// Copy-to-clipboard button used on fenced code blocks.
const CodeCopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can fail silently (e.g. insecure context); no-op.
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
      className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

// Shared ReactMarkdown component overrides for headings, code, and callouts —
// mirrors the visual language used across the rest of the site (serif
// headings, slate/blue palette, definition/theorem/example callouts).
const useMarkdownComponents = () =>
  useMemo(
    () => ({
      h1: ({ children }: { children?: React.ReactNode }) => {
        const id = slugify(String(children));
        return (
          <h1
            id={id}
            className={`${SCROLL_MARGIN} font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-6 pb-4 border-b-2 border-blue-900/20 group scroll-mt-28`}
          >
            <span className="relative">
              {children}
              <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 text-base no-underline">#</a>
            </span>
          </h1>
        );
      },
      h2: ({ children }: { children?: React.ReactNode }) => {
        const id = slugify(String(children));
        return (
          <h2 id={id} className={`${SCROLL_MARGIN} font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-3 group`}>
            <span className="inline-block w-6 h-px bg-blue-900/30 group-hover:bg-blue-600 transition-colors" aria-hidden="true" />
            <span className="relative">
              {children}
              <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 text-sm no-underline">#</a>
            </span>
          </h2>
        );
      },
      h3: ({ children }: { children?: React.ReactNode }) => {
        const id = slugify(String(children));
        return (
          <h3 id={id} className={`${SCROLL_MARGIN} font-serif text-lg sm:text-xl font-semibold text-slate-800 mt-8 mb-3`}>
            {children}
          </h3>
        );
      },
      h4: ({ children }: { children?: React.ReactNode }) => {
        const id = slugify(String(children));
        return (
          <h4 id={id} className={`${SCROLL_MARGIN} text-base sm:text-lg font-semibold text-slate-700 mt-6 mb-2`}>
            {children}
          </h4>
        );
      },
      p: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-4 text-slate-700 leading-relaxed">{children}</p>
      ),
      ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="mb-4 ml-5 space-y-1.5 list-disc marker:text-blue-900">{children}</ul>
      ),
      ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="mb-4 ml-5 space-y-1.5 list-decimal marker:text-blue-900 marker:font-semibold">{children}</ol>
      ),
      li: ({ children }: { children?: React.ReactNode }) => (
        <li className="text-slate-700 leading-relaxed pl-1">{children}</li>
      ),
      hr: () => <hr className="my-8 border-t-2 border-slate-100" />,
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="border-l-4 border-blue-900/30 bg-blue-50/60 pl-5 pr-4 py-3 my-6 rounded-r-lg text-slate-700 italic">
          {children}
        </blockquote>
      ),
      a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-900 underline decoration-blue-300 underline-offset-2 hover:decoration-blue-700 transition-colors"
        >
          {children}
        </a>
      ),
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-bold text-slate-900">{children}</strong>
      ),
      table: ({ children }: { children?: React.ReactNode }) => (
        <div className="overflow-x-auto my-6 rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">{children}</table>
        </div>
      ),
      thead: ({ children }: { children?: React.ReactNode }) => (
        <thead className="bg-slate-900 text-white">{children}</thead>
      ),
      th: ({ children }: { children?: React.ReactNode }) => (
        <th className="px-4 py-2.5 text-left font-semibold text-xs uppercase tracking-wide">{children}</th>
      ),
      td: ({ children }: { children?: React.ReactNode }) => (
        <td className="px-4 py-2.5 border-t border-slate-100 text-slate-700">{children}</td>
      ),
      code({ inline, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
        const match = /language-(\w+)/.exec(className || '');
        const codeText = String(children).replace(/\n$/, '');
        return !inline && match ? (
          <div className="relative group/code my-5">
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              customStyle={{ borderRadius: '0.75rem', padding: '1.5rem', fontSize: '0.875rem' }}
            >
              {codeText}
            </SyntaxHighlighter>
            <CodeCopyButton text={codeText} />
          </div>
        ) : (
          <code className="bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded text-[0.85em] font-mono" {...props}>
            {children}
          </code>
        );
      },
    }),
    []
  );

const TutorialRenderer: React.FC<TutorialRendererProps> = ({ content, onProgress }) => {
  const [visibleSolutions, setVisibleSolutions] = useState<Set<number>>(new Set());
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((window as unknown as { MathJax?: { typesetPromise?: () => void } }).MathJax?.typesetPromise) {
        (window as unknown as { MathJax: { typesetPromise: () => void } }).MathJax.typesetPromise();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [visibleSolutions]);

  const toggleSolution = (index: number) => {
    setVisibleSolutions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleSolved = (index: number) => {
    setSolvedProblems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const sections = useMemo(() => parseContent(content), [content]);
  const totalProblems = useMemo(() => sections.filter((s) => s.type === 'question').length, [sections]);

  useEffect(() => {
    onProgress?.(solvedProblems.size, totalProblems);
  }, [solvedProblems, totalProblems, onProgress]);

  const markdownComponents = useMarkdownComponents();

  return (
    <div className="tutorial-content font-sans text-slate-700">
      <style>{`
        @keyframes tutorialSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-tutorial-slide-down { animation: tutorialSlideDown 0.25s ease-out; }

        .tutorial-solution-steps ol { list-style: none; counter-reset: step-counter; padding: 0; margin: 1rem 0; }
        .tutorial-solution-steps ol li {
          counter-increment: step-counter;
          margin-bottom: 1rem;
          padding-left: 2.75rem;
          position: relative;
        }
        .tutorial-solution-steps ol li::before {
          content: counter(step-counter);
          position: absolute;
          left: 0;
          top: 0.15rem;
          width: 1.625rem;
          height: 1.625rem;
          background: #16a34a;
          color: white;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8125rem;
          font-weight: 700;
        }
      `}</style>

      {sections.map((section, idx) => {
        if (section.type === 'content') {
          return (
            <ReactMarkdown
              key={idx}
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={markdownComponents}
            >
              {section.text ?? ''}
            </ReactMarkdown>
          );
        }

        const index = section.index!;
        const isOpen = visibleSolutions.has(index);
        const isSolved = solvedProblems.has(index);

        return (
          <article key={idx} className="space-y-4 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border my-6 scroll-mt-28" id={`problem-${index + 1}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-sm font-bold text-primary">
                  {index + 1}
                </span>
              </div>
              <button
                onClick={() => toggleSolved(index)}
                aria-pressed={isSolved}
                className={
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition " +
                  (isSolved
                    ? "bg-success/15 text-success"
                    : "bg-secondary text-muted-foreground hover:text-foreground")
                }
              >
                {isSolved ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                  </>
                ) : (
                  <>
                    <Circle className="h-3.5 w-3.5" /> Mark done
                  </>
                )}
              </button>
            </div>

            <div className="text-[15px] leading-relaxed text-foreground max-w-none">
              <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]} components={markdownComponents}>
                {section.question ?? ''}
              </ReactMarkdown>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => toggleSolution(index)}
                aria-expanded={isOpen}
                className={
                  "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition " +
                  (isOpen
                    ? "bg-secondary text-foreground hover:bg-secondary/80"
                    : "bg-primary text-primary-foreground hover:bg-primary/90")
                }
              >
                {isOpen ? (
                  <>
                    <EyeOff className="h-4 w-4" /> Hide Solution
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" /> Show Solution
                  </>
                )}
              </button>
            </div>

            {isOpen && (
              <div className="mt-4 rounded-xl overflow-hidden border border-border shadow-sm animate-tutorial-slide-down">
                <div className="bg-secondary/50 text-foreground px-5 sm:px-6 py-3 border-b border-border flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">Worked Solution</span>
                </div>
                <div className="bg-card p-5 sm:p-6 tutorial-solution-steps">
                  <div className="max-w-none text-foreground">
                    <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]} components={markdownComponents}>
                      {section.solution ?? ''}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};

export default TutorialRenderer;