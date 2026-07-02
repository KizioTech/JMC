import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const TutorialRenderer = ({ content }) => {
  const [visibleSolutions, setVisibleSolutions] = useState(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.MathJax) {
        window.MathJax.typesetPromise?.();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [visibleSolutions]);

  const toggleSolution = (index) => {
    setVisibleSolutions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Parse the content to extract questions and solutions
  const parseContent = (text) => {
    const sections = [];
    const questionRegex = /:::question\s*\n([\s\S]*?)\n:::\s*\n\s*:::solution\s*\n([\s\S]*?)\n:::/g;
    
    let lastIndex = 0;
    let match;
    let questionIndex = 0;
    
    while ((match = questionRegex.exec(text)) !== null) {
      // Add content before this question
      if (match.index > lastIndex) {
        sections.push({
          type: 'content',
          text: text.substring(lastIndex, match.index)
        });
      }
      
      // Add the question-solution pair
      sections.push({
        type: 'question',
        index: questionIndex++,
        question: match[1].trim(),
        solution: match[2].trim()
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining content
    if (lastIndex < text.length) {
      sections.push({
        type: 'content',
        text: text.substring(lastIndex)
      });
    }
    
    return sections;
  };

  const sections = parseContent(content);

  return (
    <div className="tutorial-content">
      <style>{`
        .tutorial-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
          color: #374151;
          line-height: 1.7;
        }

        /* Heading hierarchy - properly scaled */
        .tutorial-content h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2rem;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 3px solid #3b82f6;
        }

        .tutorial-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-top: 1.75rem;
          margin-bottom: 1rem;
        }

        .tutorial-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .tutorial-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #4b5563;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .tutorial-content p {
          margin-bottom: 1rem;
          font-size: 1rem;
          letter-spacing: 0.3px;
        }

        .tutorial-content ul, .tutorial-content ol {
          margin: 1.25rem 0;
          padding-left: 2rem;
        }

        .tutorial-content li {
          margin-bottom: 0.5rem;
          font-size: 1rem;
          line-height: 1.6;
        }

        .tutorial-content code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
          font-family: 'Monaco', 'Courier New', monospace;
          color: #dc2626;
        }

        .tutorial-content pre {
          background: #1e293b;
          border-radius: 0.75rem;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 1.25rem 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .tutorial-content pre code {
          background: none;
          color: inherit;
          padding: 0;
          border-radius: 0;
        }

        .tutorial-content blockquote {
          border-left: 4px solid #3b82f6;
          background: #eff6ff;
          padding: 1rem 1.25rem;
          margin: 1.25rem 0;
          border-radius: 0.5rem;
          color: #1e40af;
        }

        .tutorial-content blockquote p {
          margin: 0;
        }

        .mjx-chtml {
          font-size: 1em !important;
        }

        /* Math display spacing */
        .tutorial-content .mjx-chtml[display="true"] {
          margin: 1rem 0;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .solution-steps ol {
          list-style: none;
          counter-reset: step-counter;
          padding: 0;
          margin: 1rem 0;
        }

        .solution-steps ol li {
          counter-increment: step-counter;
          margin-bottom: 1rem;
          padding-left: 3rem;
          position: relative;
        }

        .solution-steps ol li::before {
          content: counter(step-counter);
          position: absolute;
          left: 0;
          top: 0.25rem;
          width: 1.75rem;
          height: 1.75rem;
          background: #10b981;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: bold;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .tutorial-content h1 {
            font-size: 1.75rem;
          }
          .tutorial-content h2 {
            font-size: 1.375rem;
          }
          .tutorial-content h3 {
            font-size: 1.125rem;
          }
          .tutorial-content h4 {
            font-size: 1rem;
          }
          .tutorial-content p, .tutorial-content li {
            font-size: 0.95rem;
          }
          .tutorial-content ul, .tutorial-content ol {
            padding-left: 1.5rem;
          }
        }
      `}</style>

      {sections.map((section, idx) => {
        if (section.type === 'content') {
          return (
            <ReactMarkdown
              key={idx}
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-6 pr-4 py-4 my-6 rounded-r-lg italic text-gray-700 shadow-sm">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="my-8 border-t-2 border-gray-200" />
              }}
            >
              {section.text}
            </ReactMarkdown>
          );
        } else if (section.type === 'question') {
          return (
            <div key={idx} className="my-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 flex items-center gap-3 font-semibold">
                  <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                    Q
                  </div>
                  <span className="text-lg">Problem {section.index + 1}</span>
                </div>
                <div className="p-6">
                  <div className="prose prose-lg max-w-none mb-4">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {section.question}
                    </ReactMarkdown>
                  </div>
                  <button
                    onClick={() => toggleSolution(section.index)}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white px-6 py-3 rounded-lg font-medium transition-all"
                  >
                    {visibleSolutions.has(section.index) ? (
                      <>
                        <ChevronUp className="w-5 h-5" />
                        Hide Solution
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-5 h-5" />
                        Show Solution
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {visibleSolutions.has(section.index) && (
                <div className="ml-8 mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl overflow-hidden shadow-lg animate-slideDown">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 flex items-center gap-3 font-semibold">
                    <CheckCircle className="w-6 h-6" />
                    <span className="text-lg">Solution</span>
                  </div>
                  <div className="p-6 solution-steps">
                    <div className="prose prose-lg max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {section.solution}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default TutorialRenderer;
