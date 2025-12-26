import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

// Configure math delimiters
const mathOptions = {
  inlineMath: [['$', '$'], ['\\(', '\\)']],
  displayMath: [['$$', '$$'], ['\\[', '\\]']]
};

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Math styling - Responsive and centered */
          .katex-display {
            text-align: center !important;
            margin: 1rem auto !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            padding: 0.75rem;
            overflow-x: auto;
            width: 100%;
          }
          
          @media (min-width: 640px) {
            .katex-display {
              margin: 1.5rem auto !important;
              padding: 1rem;
              border-radius: 0.5rem;
            }
          }
          
          @media (min-width: 768px) {
            .katex-display {
              padding: 1.25rem;
            }
          }
          
          @media (min-width: 1024px) {
            .katex-display {
              padding: 1.5rem;
            }
          }
          
          .katex-display > .katex {
            text-align: center !important;
            margin: 0 auto !important;
          }
          
          .katex {
            font-size: 1em;
          }
          
          @media (min-width: 640px) {
            .katex {
              font-size: 1.05em;
            }
          }
          
          @media (min-width: 768px) {
            .katex {
              font-size: 1.1em;
            }
          }
          
          /* Override any conflicting styles */
          .katex-html {
            text-align: center !important;
          }
          
          mjx-container[display="true"] {
            text-align: center !important;
            display: block !important;
            margin: 1.5rem auto !important;
          }
          
          /* Table styling - Mobile responsive */
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            font-family: "Times New Roman", Times, serif;
            border: 2px solid #e2e8f0;
            border-radius: 0.375rem;
            overflow: hidden;
            font-size: 0.875rem;
          }
          
          @media (min-width: 640px) {
            table {
              margin: 1.25rem 0;
              border-radius: 0.5rem;
              font-size: 0.9375rem;
            }
          }
          
          @media (min-width: 768px) {
            table {
              margin: 1.5rem 0;
              font-size: 1rem;
            }
          }
          
          thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          
          th {
            padding: 0.5rem 0.75rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.8125rem;
            border-bottom: 2px solid #e2e8f0;
          }
          
          @media (min-width: 640px) {
            th {
              padding: 0.625rem 0.875rem;
              font-size: 0.875rem;
            }
          }
          
          @media (min-width: 768px) {
            th {
              padding: 0.75rem 1rem;
              font-size: 0.95rem;
            }
          }
          
          td {
            padding: 0.5rem 0.75rem;
            border-bottom: 1px solid #e2e8f0;
            color: #000000;
          }
          
          @media (min-width: 640px) {
            td {
              padding: 0.625rem 0.875rem;
            }
          }
          
          @media (min-width: 768px) {
            td {
              padding: 0.75rem 1rem;
            }
          }
          
          tbody tr {
            transition: background-color 0.2s;
          }
          
          tbody tr:hover {
            background-color: #f8fafc;
          }
          
          tbody tr:last-child td {
            border-bottom: none;
          }
          
          /* Alternating row colors */
          tbody tr:nth-child(even) {
            background-color: #f9fafb;
          }
          
          /* Image centering */
          img {
            display: block;
            margin: 1.5rem auto;
            max-width: 100%;
            height: auto;
            border-radius: 0.375rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          @media (min-width: 640px) {
            img {
              margin: 1.75rem auto;
              border-radius: 0.5rem;
            }
          }
          
          @media (min-width: 768px) {
            img {
              margin: 2rem auto;
            }
          }
          
          /* Custom box styling - Mobile responsive */
          .md-definition-box,
          .md-theorem-box,
          .md-example-box {
            padding: 0.75rem 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          @media (min-width: 640px) {
            .md-definition-box,
            .md-theorem-box,
            .md-example-box {
              padding: 0.875rem 1.25rem;
              margin: 1.25rem 0;
              border-radius: 0.625rem;
            }
          }
          
          @media (min-width: 768px) {
            .md-definition-box,
            .md-theorem-box,
            .md-example-box {
              padding: 1rem 1.5rem;
              margin: 1.5rem 0;
              border-radius: 0.625rem;
            }
          }
          
          .md-definition-box {
            background: #eff6ff;
            border-left: 3px solid #2563eb;
          }
          
          .md-theorem-box {
            background: #f0fdf4;
            border-left: 3px solid #16a34a;
          }
          
          .md-example-box {
            background: #fefce8;
            border-left: 3px solid #eab308;
          }
          
          @media (min-width: 768px) {
            .md-definition-box,
            .md-theorem-box,
            .md-example-box {
              border-left-width: 4px;
            }
          }
          
          .md-box-title {
            font-family: "Times New Roman", Times, serif;
            font-weight: 600;
            margin-bottom: 0.375rem;
            font-size: 0.9375rem;
          }
          
          @media (min-width: 640px) {
            .md-box-title {
              margin-bottom: 0.4375rem;
              font-size: 1rem;
            }
          }
          
          @media (min-width: 768px) {
            .md-box-title {
              margin-bottom: 0.5rem;
              font-size: 1.1rem;
            }
          }
          
          .md-definition-box .md-box-title { color: #1e40af; }
          .md-theorem-box .md-box-title { color: #15803d; }
          .md-example-box .md-box-title { color: #a16207; }
          
          /* Hover effect for links */
          .md-link:hover {
            background: #f3f4f6;
            color: #ef4444;
          }
        `
      }} />
      <div className="max-w-none" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        <ReactMarkdown
          remarkPlugins={[[remarkMath, mathOptions], remarkGfm]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark as any}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg text-sm sm:text-base"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-100 px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded text-xs sm:text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            },
            h1: ({ children }) => {
              const text = String(children);
              const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
              return (
                <h1 
                  id={id}
                  className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 border-b-2 border-red-500 pb-2"
                >
                  {children}
                </h1>
              );
            },
            h2: ({ children }) => {
              const text = String(children);
              const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
              return (
                <h2 
                  id={id}
                  className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4 pl-3 sm:pl-4 relative"
                >
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 sm:h-6 md:h-7 bg-red-500 rounded-sm"></span>
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => {
              const text = String(children);
              const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
              return (
                <h3 
                  id={id}
                  className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mt-4 sm:mt-5 md:mt-6 mb-2 sm:mb-3 pb-2 border-b border-gray-200"
                >
                  {children}
                </h3>
              );
            },
            h4: ({ children }) => {
              const text = String(children);
              const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
              return (
                <h4 
                  id={id}
                  className="font-serif text-base sm:text-lg md:text-xl font-semibold text-gray-600 mt-3 sm:mt-4 md:mt-5 mb-2"
                >
                  {children}
                </h4>
              );
            },
            h5: ({ children }) => {
              const text = String(children);
              const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
              return (
                <h5 
                  id={id}
                  className="font-serif text-sm sm:text-base md:text-lg font-semibold text-gray-500 mt-3 sm:mt-4 mb-2"
                >
                  {children}
                </h5>
              );
            },
            h6: ({ children }) => {
              const text = String(children);
              const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
              return (
                <h6 
                  id={id}
                  className="font-serif text-xs sm:text-sm md:text-base font-semibold text-gray-400 mt-3 mb-2"
                >
                  {children}
                </h6>
              );
            },
            p: ({ children }) => (
              <p className="font-serif mb-3 sm:mb-4 text-black leading-relaxed text-sm sm:text-base">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="mb-3 sm:mb-4 ml-4 sm:ml-6 list-disc">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-3 sm:mb-4 ml-4 sm:ml-6 list-decimal">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="font-serif text-black mb-1.5 sm:mb-2 text-sm sm:text-base">
                {children}
              </li>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4 sm:my-5 md:my-6 -mx-2 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-2 sm:px-0">
                  <table className="min-w-full">{children}</table>
                </div>
              </div>
            ),
            blockquote: ({ children }) => {
              const text = String(children);
              const lines = text.split('\n').filter(l => l.trim());
              const firstLine = lines[0] || '';
              
              // Check if this is a Definition, Theorem, or Example box
              if (firstLine.toLowerCase().includes('definition')) {
                const title = firstLine.replace(/definition:\s*/i, '').trim();
                const content = lines.slice(1).join('\n');
                return (
                  <div className="md-definition-box">
                    <div className="md-box-title">{title || 'Definition'}</div>
                    <div style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                      <ReactMarkdown
                        remarkPlugins={[[remarkMath, mathOptions], remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              }
              
              if (firstLine.toLowerCase().includes('theorem')) {
                const title = firstLine.replace(/theorem:\s*/i, '').trim();
                const content = lines.slice(1).join('\n');
                return (
                  <div className="md-theorem-box">
                    <div className="md-box-title">{title || 'Theorem'}</div>
                    <div style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                      <ReactMarkdown
                        remarkPlugins={[[remarkMath, mathOptions], remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              }
              
              if (firstLine.toLowerCase().includes('example')) {
                const title = firstLine.replace(/example\s*\d*:?\s*/i, '').trim();
                const content = lines.slice(1).join('\n');
                return (
                  <div className="md-example-box">
                    <div className="md-box-title">{title || firstLine}</div>
                    <div style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                      <ReactMarkdown
                        remarkPlugins={[[remarkMath, mathOptions], remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              }
              
              // Default blockquote styling
              return (
                <blockquote className="border-l-4 border-gray-400 pl-3 sm:pl-4 italic my-3 sm:my-4 bg-gray-50 py-2 px-3 sm:px-4 rounded-r text-sm sm:text-base">
                  {children}
                </blockquote>
              );
            },
            a: ({ children, href }) => (
              <a
                href={href}
                className="md-link text-gray-700 no-underline font-bold transition-all cursor-pointer text-sm sm:text-base"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-black">
                {children}
              </strong>
            ),
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt || ''}
                loading="lazy"
                className="block mx-auto max-w-full h-auto rounded-md sm:rounded-lg shadow-md"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default MarkdownRenderer;