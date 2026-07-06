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
            /* NOTE: text-align is intentionally LEFT, not center.
               katex.min.css ships a default .katex-display { text-align: center }
               rule. Combined with overflow-x: auto, that centering makes the
               left half of any equation wider than the box permanently
               unreachable: browsers won't scroll to a negative scrollLeft in
               LTR, so the portion that "spills" left of the box is clipped
               and no amount of touch/scrollbar dragging can reveal it. Forcing
               left alignment here means overflow only ever spills to the
               right, where overflow-x: auto can actually scroll to it. */
            text-align: left !important;
            margin: 1.75rem 0 !important;
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
            text-align: left !important;
            white-space: nowrap;
            scroll-snap-align: start;
            padding: 0 1rem;
          }

          .katex { font-size: clamp(1rem, 1vw + 0.5rem, 1.15rem); }
          .katex-html { text-align: left !important; }

          /* ---- Inline math containment ----
             An inline formula (single $...$) has no wrapper of its own, so a
             single wide fraction/sum/matrix in a sentence used to have
             nothing bounding its width. On a narrow viewport that forced the
             *entire page* to grow wider than the screen and scroll
             horizontally — which is why even short notes with just one
             inline equation looked broken, not just ones with long content.
             Scoping this to inline (non-display) katex nodes lets a single
             oversized formula scroll on its own instead of blowing out the
             page. */
          .jmc-notes .katex:not(.katex-display .katex) {
            display: inline-block;
            max-width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            vertical-align: middle;
            -webkit-overflow-scrolling: touch;
          }

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
      {/* overflow-x via inline style (not the overflow-x-hidden utility): setting only
          overflow-x through a class leaves overflow-y at its default 'visible', and per
          the CSS Overflow spec a container with one axis hidden and the other visible has
          its "visible" axis silently forced to 'auto' — which can add an unwanted nested
          vertical scrollbar and, in some browsers, undermine the horizontal clipping this
          wrapper exists for. 'clip' sidesteps that quirk entirely: it clips the x-axis
          without touching y-axis scroll behavior. */}
      <div className="jmc-notes max-w-none" style={{ overflowX: 'clip' }}>
        <ReactMarkdown
          remarkPlugins={[[remarkMath, mathOptions], remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            code({ inline, className, children, node, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean; node?: { position?: { start?: { line?: number } } } }) {
              const match = /language-(\w+)/.exec(className || '');
              const dataLine = node?.position?.start?.line;
              return !inline && match ? (
                <div data-line={dataLine} className="max-w-full overflow-x-auto">
                  <SyntaxHighlighter
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    style={oneDark as any}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg text-sm sm:text-base my-5 shadow-sm"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-blue-50 px-1.5 py-0.5 rounded text-[0.85em] font-mono text-blue-800" {...props}>
                  {children}
                </code>
              );
            },
            // MarkdownRenderer.tsx (updated components section)
// Replace the h1-h6 components with these:

h1: ({ children, node }) => {
  const id = slugify(String(children));
  return (
    <h1 
      id={id} 
      data-line={node?.position?.start?.line}
      className={`${SCROLL_MARGIN} font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 pb-4 border-b-2 border-blue-900/20 cursor-pointer hover:text-blue-800 transition-colors group`}
    >
      <span className="relative">
        {children}
        <span className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 text-base">#</span>
      </span>
    </h1>
  );
},
h2: ({ children, node }) => {
  const id = slugify(String(children));
  return (
    <h2 
      id={id} 
      data-line={node?.position?.start?.line}
      className={`${SCROLL_MARGIN} font-serif text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-3 cursor-pointer hover:text-blue-800 transition-colors group`}
    >
      <span className="inline-block w-6 h-px bg-blue-900/30 group-hover:bg-blue-600 transition-colors" aria-hidden="true" />
      <span className="relative">
        {children}
        <span className="absolute -right-5 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 text-sm">#</span>
      </span>
    </h2>
  );
},
h3: ({ children, node }) => {
  const id = slugify(String(children));
  return (
    <h3 
      id={id} 
      data-line={node?.position?.start?.line}
      className={`${SCROLL_MARGIN} font-serif text-lg sm:text-xl md:text-2xl font-semibold text-slate-800 mt-8 mb-3 cursor-pointer hover:text-blue-800 transition-colors group`}
    >
      <span className="relative">
        {children}
        <span className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 text-xs">#</span>
      </span>
    </h3>
  );
},
h4: ({ children, node }) => {
  const id = slugify(String(children));
  return (
    <h4 
      id={id} 
      data-line={node?.position?.start?.line}
      className={`${SCROLL_MARGIN} text-base sm:text-lg font-semibold text-slate-700 mt-6 mb-2 cursor-pointer hover:text-blue-800 transition-colors group`}
    >
      <span className="relative">
        {children}
        <span className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 text-xs">#</span>
      </span>
    </h4>
  );
},
            h5: ({ children, node }) => {
              const id = slugify(String(children));
              return (
                <h5 id={id} data-line={node?.position?.start?.line} className={`${SCROLL_MARGIN} text-sm sm:text-base font-semibold text-slate-600 mt-4 mb-2`}>
                  {children}
                </h5>
              );
            },
            h6: ({ children, node }) => {
              const id = slugify(String(children));
              return (
                <h6 id={id} data-line={node?.position?.start?.line} className={`${SCROLL_MARGIN} text-xs sm:text-sm font-semibold text-slate-500 mt-3 mb-2`}>
                  {children}
                </h6>
              );
            },
            p: ({ children, node }) => (
              <p data-line={node?.position?.start?.line} className="mb-4 text-slate-800 leading-relaxed break-words max-w-prose">
                {children}
              </p>
            ),
            ul: ({ children, node }) => (
              <ul data-line={node?.position?.start?.line} className="mb-4 ml-5 space-y-1.5 list-disc marker:text-blue-900 max-w-prose">
                {children}
              </ul>
            ),
            ol: ({ children, node }) => (
              <ol data-line={node?.position?.start?.line} className="mb-4 ml-5 space-y-1.5 list-decimal marker:text-blue-900 marker:font-semibold max-w-prose">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-slate-800 break-words leading-relaxed pl-1">
                {children}
              </li>
            ),
            table: ({ children, node }) => (
              // NOTE: this used to be `-mx-2 sm:mx-0` (a "full-bleed" trick: bleed the
              // scroll container 0.5rem past the content edge on mobile so a wide table
              // can scroll flush to the screen). That only works if whatever wraps
              // .jmc-notes has >= 0.5rem of horizontal padding to absorb the bleed. On a
              // narrow viewport, a browser can't scroll to a negative scrollLeft, so the
              // left-side bleed is silently clipped and invisible — but the right-side
              // bleed *is* reachable by scrolling, which is exactly what was showing up
              // as blank space past the right edge on any note containing a table.
              // Dropping the negative margin keeps the table scrolling within the
              // normal content width instead of bleeding past it.
              <div data-line={node?.position?.start?.line} className="overflow-x-auto my-6">
                <div className="inline-block min-w-full align-middle">
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
                  <div data-line={node?.position?.start?.line} className={`md-callout ${boxType}`}>
                    <span className="md-callout-tag">{tag}</span>
                    <div className="md-box-title">{title}</div>
                    <div className="md-box-content max-w-prose">
                      {children}
                    </div>
                  </div>
                );
              }

              return (
                <blockquote data-line={node?.position?.start?.line} className="border-l-4 border-slate-300 pl-4 italic my-4 bg-slate-50 py-2.5 px-4 rounded-r-lg text-slate-700 max-w-prose" {...props}>
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
            img: ({ src, alt, node }) => (
              <img data-line={node?.position?.start?.line} src={src} alt={alt || ''} loading="lazy" />
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