import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

// Helper to handle video embeds
const embedVideoMarkers = (md: string) => {
  return md.replace(/<!--\s*video:\s*(\S+)\s*-->/g, (_, url) => {
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
    const embedUrl = yt ? `https://www.youtube.com/embed/${yt[1]}` : url;
    return `<div class="aspect-video my-6 rounded-xl overflow-hidden shadow-md border border-outline-variant"><iframe src="${embedUrl}" class="w-full h-full" allowfullscreen></iframe></div>`;
  });
};

// Configure math delimiters
const mathOptions = {
  inlineMath: [['$', '$'], ['\\(', '\\)']],
  displayMath: [['$$', '$$'], ['\\[', '\\]']]
};

// Shared slug logic — exported so the note page can build a Table of Contents
// whose anchor links line up exactly with the ids rendered here.
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[*_`$]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Scroll offset so anchored headings don't hide under the sticky site header.
const SCROLL_MARGIN = 'scroll-mt-28';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* ---- Notebook typography ---- */
          .jmc-notes {
            font-family: 'Source Serif 4', Georgia, 'Iowan Old Style', serif;
            font-size: 1.0625rem;
            line-height: 1.75;
          }

          .jmc-notes strong { font-family: inherit; }

          /* ---- Math styling ---- */
          .katex-display {
            display: block !important;
            margin: 1.75rem auto !important;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 0.625rem;
            padding: 1.15rem 1rem;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
          }

          .katex-display > .katex {
            display: inline-block;
            text-align: center !important;
            white-space: nowrap;
            scroll-snap-align: start;
            padding: 0 1rem;
          }

          .katex { font-size: clamp(1rem, 1vw + 0.5rem, 1.15rem); }
          .katex-html { text-align: center !important; }

          .katex-display::-webkit-scrollbar { height: 6px; }
          .katex-display::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
          .katex-display::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
          .katex-display::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

          /* ---- Tables ---- */
          .jmc-notes table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.75rem 0;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            overflow: hidden;
            font-size: 0.9375rem;
            font-family: 'Inter', system-ui, sans-serif;
          }

          .jmc-notes thead { background: #1e3a8a; color: white; }

          .jmc-notes th {
            padding: 0.625rem 1rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.8125rem;
            letter-spacing: 0.02em;
            text-transform: uppercase;
          }

          .jmc-notes td {
            padding: 0.625rem 1rem;
            border-bottom: 1px solid #eef1f6;
            color: #0f172a;
          }

          .jmc-notes tbody tr:nth-child(even) { background-color: #f8fafc; }
          .jmc-notes tbody tr:hover { background-color: #eff6ff; }
          .jmc-notes tbody tr:last-child td { border-bottom: none; }

          /* ---- Images ---- */
          .jmc-notes img {
            display: block;
            margin: 1.75rem auto;
            max-width: 100%;
            height: auto;
            border-radius: 0.625rem;
            box-shadow: 0 4px 16px rgba(15, 23, 42, 0.1);
            border: 1px solid #eef1f6;
          }

          /* ---- Callout boxes: Definition / Theorem / Example ---- */
          .md-callout {
            position: relative;
            padding: 1.1rem 1.35rem 1.1rem 1.5rem;
            margin: 1.75rem 0;
            border-radius: 0 0.75rem 0.75rem 0.75rem;
            border-left: 3px solid transparent;
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
          }

          .md-callout-tag {
            position: absolute;
            top: -0.7rem;
            left: -3px;
            font-family: 'JetBrains Mono', 'SFMono-Regular', monospace;
            font-size: 0.6875rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            padding: 0.2rem 0.55rem;
            border-radius: 0.3rem;
            color: white;
          }

          .md-box-title {
            font-family: 'Source Serif 4', Georgia, serif;
            font-weight: 600;
            font-style: italic;
            margin-bottom: 0.35rem;
            font-size: 1.05rem;
          }

          .md-definition-box { background: #eff6ff; border-left-color: #2563eb; }
          .md-definition-box .md-callout-tag { background: #2563eb; }
          .md-definition-box .md-box-title { color: #1e3a8a; }

          .md-theorem-box { background: #f0fdf4; border-left-color: #16a34a; }
          .md-theorem-box .md-callout-tag { background: #16a34a; }
          .md-theorem-box .md-box-title { color: #166534; }

          .md-example-box { background: #fefce8; border-left-color: #ca8a04; }
          .md-example-box .md-callout-tag { background: #ca8a04; }
          .md-example-box .md-box-title { color: #854d0e; }

          .md-box-content :first-child { margin-top: 0; }
          .md-box-content :last-child { margin-bottom: 0; }

          /* ---- Inline / block code ---- */
          .jmc-notes code {
            font-family: 'JetBrains Mono', 'SFMono-Regular', monospace;
          }

          /* ---- Links ---- */
          .md-link {
            text-decoration: underline;
            text-decoration-color: #93c5fd;
            text-underline-offset: 3px;
            transition: color 0.15s ease, text-decoration-color 0.15s ease;
          }
          .md-link:hover { color: #1e3a8a; text-decoration-color: #1e3a8a; }
        `
      }} />
      <div className="jmc-notes max-w-none">
        <ReactMarkdown
          remarkPlugins={[[remarkMath, mathOptions], remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            code({ inline, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  style={oneDark as any}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg text-sm sm:text-base my-5 shadow-sm"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-blue-50 px-1.5 py-0.5 rounded text-[0.85em] font-mono text-blue-800" {...props}>
                  {children}
                </code>
              );
            },
            h1: ({ children }) => {
              const id = slugify(String(children));
              return (
                <h1 id={id} className={`${SCROLL_MARGIN} font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 pb-3 border-b-2 border-blue-900`}>
                  {children}
                </h1>
              );
            },
            h2: ({ children }) => {
              const id = slugify(String(children));
              return (
                <h2 id={id} className={`${SCROLL_MARGIN} font-serif text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mt-10 mb-4 flex items-baseline gap-3`}>
                  <span className="inline-block w-6 h-px bg-blue-900 translate-y-[-0.4em]" aria-hidden="true" />
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => {
              const id = slugify(String(children));
              return (
                <h3 id={id} className={`${SCROLL_MARGIN} font-serif text-lg sm:text-xl md:text-2xl font-semibold text-slate-800 mt-8 mb-3`}>
                  {children}
                </h3>
              );
            },
            h4: ({ children }) => {
              const id = slugify(String(children));
              return (
                <h4 id={id} className={`${SCROLL_MARGIN} text-base sm:text-lg font-semibold text-slate-700 mt-6 mb-2`}>
                  {children}
                </h4>
              );
            },
            h5: ({ children }) => {
              const id = slugify(String(children));
              return (
                <h5 id={id} className={`${SCROLL_MARGIN} text-sm sm:text-base font-semibold text-slate-600 mt-4 mb-2`}>
                  {children}
                </h5>
              );
            },
            h6: ({ children }) => {
              const id = slugify(String(children));
              return (
                <h6 id={id} className={`${SCROLL_MARGIN} text-xs sm:text-sm font-semibold text-slate-500 mt-3 mb-2`}>
                  {children}
                </h6>
              );
            },
            p: ({ children }) => (
              <p className="mb-4 text-slate-800 leading-relaxed break-words max-w-prose">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="mb-4 ml-5 space-y-1.5 list-disc marker:text-blue-900 max-w-prose">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-4 ml-5 space-y-1.5 list-decimal marker:text-blue-900 marker:font-semibold max-w-prose">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-slate-800 break-words leading-relaxed pl-1">
                {children}
              </li>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6 -mx-2 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-2 sm:px-0">
                  <table className="min-w-full">{children}</table>
                </div>
              </div>
            ),
            blockquote: ({ node, children, ...props }) => {
              // Sniff the first line of text to detect Definition / Theorem / Example callouts
              const firstP = node?.children?.[0];
              const firstTextNode = firstP?.type === 'element' && firstP.tagName === 'p' ? firstP.children?.[0] : null;
              const firstText = firstTextNode?.type === 'text' ? firstTextNode.value : '';

              const lowerText = firstText.toLowerCase();
              let boxType = '';
              let tag = '';
              let title = '';

              if (lowerText.startsWith('definition:')) {
                boxType = 'md-definition-box';
                tag = 'DEF';
                title = firstText.replace(/definition:\s*/i, '').trim() || 'Definition';
              } else if (lowerText.startsWith('theorem:')) {
                boxType = 'md-theorem-box';
                tag = 'THM';
                title = firstText.replace(/theorem:\s*/i, '').trim() || 'Theorem';
              } else if (lowerText.startsWith('example')) {
                boxType = 'md-example-box';
                tag = 'EX';
                title = firstText.replace(/example\s*\d*:?\s*/i, '').trim() || firstText;
              }

              if (boxType) {
                return (
                  <div className={`md-callout ${boxType}`}>
                    <span className="md-callout-tag">{tag}</span>
                    <div className="md-box-title">{title}</div>
                    <div className="md-box-content max-w-prose">
                      {children}
                    </div>
                  </div>
                );
              }

              return (
                <blockquote className="border-l-4 border-slate-300 pl-4 italic my-4 bg-slate-50 py-2.5 px-4 rounded-r-lg text-slate-700 max-w-prose" {...props}>
                  {children}
                </blockquote>
              );
            },
            a: ({ children, href }) => (
              <a
                href={href}
                className="md-link font-medium text-blue-900 cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-slate-900">
                {children}
              </strong>
            ),
            img: ({ src, alt }) => (
              <img src={src} alt={alt || ''} loading="lazy" />
            ),
          }}
        >
          {embedVideoMarkers(content)}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default MarkdownRenderer;
