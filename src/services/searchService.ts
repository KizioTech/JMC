// services/searchService.ts
import { supabase } from '@/lib/supabaseClient';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'document' | 'note' | 'tutorial' | 'quiz';
  path: string;
  tags?: string[];
  author?: string;
  category?: string;
  contentSnippet?: string;
}

// All searchable pages
const pages: SearchResult[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'Welcome to JMC Math & Academics - Your gateway to mathematical excellence',
    type: 'page',
    path: '/',
    tags: ['home', 'main', 'index']
  },
  {
    id: 'courses',
    title: 'Courses',
    description: 'Browse our comprehensive collection of mathematics courses',
    type: 'page',
    path: '/courses',
    tags: ['courses', 'classes', 'learning']
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'Get in touch with us for support and inquiries',
    type: 'page',
    path: '/contact',
    tags: ['contact', 'support', 'help']
  },
  {
    id: 'library',
    title: 'Library',
    description: 'Access our digital library of textbooks, notes, and resources',
    type: 'page',
    path: '/library',
    tags: ['library', 'resources', 'documents', 'textbooks']
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    description: 'Step-by-step tutorials and guides',
    type: 'page',
    path: '/tutorials',
    tags: ['tutorials', 'guides', 'learning']
  },
  {
    id: 'jmcplus',
    title: 'JMC Plus',
    description: 'Premium membership with exclusive content and features',
    type: 'page',
    path: '/JMCPlus',
    tags: ['premium', 'membership', 'plus']
  }
];

// Library documents (this should match your Library.tsx data)
const libraryDocuments: SearchResult[] = [
  {
    id: 'transcendental',
    title: 'CALCULUS II | Transcendental Functions',
    description: 'Advanced calculus covering exponential, logarithmic, and trigonometric functions',
    type: 'note',
    path: '/notes/transcendental-functions',
    tags: ['Calculus II', 'Transcendental', 'Functions'],
    author: 'Josophat Makawa',
    category: 'Study Notes'
  },
  {
    id: 'trigonometric',
    title: 'CALCULUS II | Inverse Trigonometric Functions',
    description: 'A focused treatment of inverse trigonometric functions',
    type: 'note',
    path: '/notes/trigonometric-functions',
    tags: ['Calculus II', 'Trigonometric', 'Functions'],
    author: 'Josophat Makawa',
    category: 'Study Notes'
  },
  {
    id: 'hyperbolic',
    title: 'CALCULUS II | Hyperbolic Functions',
    description: 'Introduction to hyperbolic functions, identities, and applications',
    type: 'note',
    path: '/notes/hyperbolic-functions',
    tags: ['Calculus II', 'Hyperbolic', 'Functions'],
    author: 'Josophat Makawa',
    category: 'Study Notes'
  },
  {
    id: 'counting-techniques',
    title: 'DISCRETE MATHEMATICS - Counting Techniques',
    description: 'Comprehensive guide to counting techniques including permutations and combinations',
    type: 'note',
    path: '/notes/counting-techniques',
    tags: ['Discrete Math', 'Counting', 'Combinatorics'],
    author: 'Josophat Makawa',
    category: 'Study Notes'
  },
  {
    id: 'pigeonhole-principle',
    title: 'DISCRETE MATHEMATICS - Pigeonhole Principle',
    description: 'Complete coverage of the pigeonhole principle with applications',
    type: 'note',
    path: '/notes/pigeonhole-principle',
    tags: ['Discrete Math', 'Pigeonhole Principle', 'Combinatorics'],
    author: 'Josophat Makawa',
    category: 'Study Notes'
  },
  {
    id: 'recurrence-relations',
    title: 'DISCRETE MATHEMATICS - Recurrence Relations',
    description: 'Advanced study of recurrence relations and algorithm analysis',
    type: 'note',
    path: '/notes/recurrence-relations',
    tags: ['Discrete Math', 'Recurrence Relations', 'Algorithm Analysis'],
    author: 'Josophat Makawa',
    category: 'Study Notes'
  },
  {
    id: 'stewart-calculus',
    title: 'Calculus by James Stewart',
    description: 'The most successful calculus book offering ideal balance of concepts and computation',
    type: 'document',
    path: '/assets/pdfs/James Stewart - Calculus-Brooks Cole (2015).pdf',
    tags: ['Calculus', 'Stewart', 'Brooks Cole', 'Textbook'],
    author: 'James Stewart',
    category: 'Textbooks'
  },
  {
    id: 'mat221-2014',
    title: 'MAT221 End Semester 2 (2014)',
    description: 'End of semester examination paper for MAT221 from 2014',
    type: 'document',
    path: '/assets/pdfs/2014_Mat221_End_Semester2.pdf',
    tags: ['MAT221', 'Exam', '2014'],
    author: 'Mathematics Department',
    category: 'Past Exams'
  },
  {
    id: 'mat221-practice',
    title: 'MAT221 Practice Questions',
    description: 'Practice questions and exercises for MAT221 course',
    type: 'document',
    path: '/assets/pdfs/Mat221_practice_Questions_tutorial3[1].pdf',
    tags: ['MAT221', 'Practice', 'Tutorial'],
    author: 'Mathematics Department',
    category: 'Practice Materials'
  }
];

// Combine all searchable content
const allSearchableContent = [...pages, ...libraryDocuments];


export const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'page': return 'Page';
    case 'document': return 'Document';
    case 'note': return 'Study Note';
    case 'tutorial': return 'Tutorial';
    case 'quiz': return 'Quiz';
    default: return type;
  }
};

export const getTypeColor = (type: string): string => {
  switch (type) {
    case 'page': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'document': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    case 'note': return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'tutorial': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    case 'quiz': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
    default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

// Dynamic content loading
let contentCache: SearchResult[] | null = null;
let isLoadingContent = false;

const noteFiles = [
  { path: '/content/notes/algebra/quadratic-equations.md', route: '/notes/quadratic-equations', subject: 'algebra' },
  { path: '/content/notes/calculus/hyperbolic-functions.md', route: '/notes/hyperbolic-functions', subject: 'calculus' },
  { path: '/content/notes/calculus/transcendental-functions.md', route: '/notes/transcendental-functions', subject: 'calculus' },
  { path: '/content/notes/calculus/trigonometric-functions.md', route: '/notes/trigonometric-functions', subject: 'calculus' },
  { path: '/content/notes/discrete/counting-techniques.md', route: '/notes/counting-techniques', subject: 'discrete' },
  { path: '/content/notes/discrete/pigeonhole-principle.md', route: '/notes/pigeonhole-principle', subject: 'discrete' },
  { path: '/content/notes/discrete/recurrence-relations.md', route: '/notes/recurrence-relations', subject: 'discrete' },
  { path: '/content/notes/trigonometry/angular-measure.md', route: '/notes/angular-measure', subject: 'trigonometry' },
  { path: '/content/notes/trigonometry/arcs-and-sectors.md', route: '/notes/arcs-and-sectors', subject: 'trigonometry' },
];

const tutorialFiles = [
  { path: '/content/tutorials/algebra/quadratic-equations-tutorial.md', route: '/tutorials/algebra/quadratic-equations-tutorial', subject: 'algebra' },
  { path: '/content/tutorials/calculus/hyperbolic-functions-tutorial.md', route: '/tutorials/calculus/hyperbolic-functions-tutorial', subject: 'calculus' },
  { path: '/content/tutorials/calculus/transcendental-functions-tutorial1.md', route: '/tutorials/calculus/transcendental-functions-tutorial', subject: 'calculus' },
  { path: '/content/tutorials/calculus/trigonometric-functions-tutorial.md', route: '/tutorials/calculus/trigonometric-functions-tutorial', subject: 'calculus' },
  { path: '/content/tutorials/discrete/counting-techniques-tutorial.md', route: '/tutorials/discrete/counting-techniques-tutorial', subject: 'discrete' },
  { path: '/content/tutorials/discrete/pigeonhole-principle-tutorial.md', route: '/tutorials/discrete/pigeonhole-principle-tutorial', subject: 'discrete' },
  { path: '/content/tutorials/discrete/recurrence-relations-tutorial.md', route: '/tutorials/discrete/recurrence-relations-tutorial', subject: 'discrete' },
  { path: '/content/tutorials/trigonometry/angular-measure-tutorial.md', route: '/tutorials/trigonometry/angular-measure-tutorial', subject: 'trigonometry' },
  { path: '/content/tutorials/trigonometry/arcs-and-sectors-tutorial.md', route: '/tutorials/trigonometry/arcs-and-sectors-tutorial', subject: 'trigonometry' },
];

const quizFiles = [
  { path: '/quizzes/transcendental-functions-tutorial1-quiz.json', route: '/quiz/transcendental-functions-tutorial1', subject: 'calculus' },
];

const pdfFiles = [
  { path: '/assets/pdfs/James Stewart - Calculus-Brooks Cole (2015).pdf', title: 'Calculus by James Stewart', description: 'The most successful calculus book of its generation', author: 'James Stewart', category: 'Textbooks' },
  { path: '/assets/pdfs/2014_Mat221_End_Semester2.pdf', title: 'MAT221 End Semester 2 (2014)', description: 'End of semester examination paper for MAT221 from 2014', author: 'Mathematics Department', category: 'Past Exams' },
  { path: '/assets/pdfs/Mat221_practice_Questions_tutorial3[1].pdf', title: 'MAT221 Practice Questions', description: 'Practice questions and exercises for MAT221 course', author: 'Mathematics Department', category: 'Practice Materials' },
];

async function loadDynamicContent(): Promise<SearchResult[]> {
  if (contentCache) return contentCache;
  if (isLoadingContent) return [];

  isLoadingContent = true;
  const results: SearchResult[] = [];

  // Load notes
  for (const file of noteFiles) {
    try {
      const response = await fetch(file.path);
      if (response.ok) {
        const content = await response.text();
        const title = extractTitleFromMarkdown(content);
        const description = extractDescriptionFromMarkdown(content);
        const snippet = getContentSnippet(content, 200);
        results.push({
          id: file.path,
          title: title || file.path.split('/').pop()?.replace('.md', '').replace(/-/g, ' ') || '',
          description: description || 'Study notes',
          type: 'note',
          path: file.route,
          category: 'Study Notes',
          author: 'Josophat Makawa',
          tags: [file.subject],
          contentSnippet: snippet
        });
      }
    } catch (error) {
      // Skip failed loads
    }
  }

  // Load tutorials
  for (const file of tutorialFiles) {
    try {
      const response = await fetch(file.path);
      if (response.ok) {
        const content = await response.text();
        const title = extractTitleFromMarkdown(content);
        const description = extractDescriptionFromMarkdown(content);
        const snippet = getContentSnippet(content, 200);
        results.push({
          id: file.path,
          title: title || file.path.split('/').pop()?.replace('.md', '').replace(/-/g, ' ') || '',
          description: description || 'Interactive tutorial',
          type: 'tutorial',
          path: file.route,
          category: 'Tutorials',
          author: 'Josophat Makawa',
          tags: [file.subject, 'tutorial'],
          contentSnippet: snippet
        });
      }
    } catch (error) {
      // Skip failed loads
    }
  }

  // Load quizzes
  for (const file of quizFiles) {
    try {
      const response = await fetch(file.path);
      if (response.ok) {
        const quizData = await response.json();
        const snippet = `Quiz with ${quizData.questions?.length || 0} questions`;
        results.push({
          id: file.path,
          title: quizData.title || 'Quiz',
          description: quizData.description || 'Interactive quiz',
          type: 'quiz',
          path: file.route,
          category: 'Quizzes',
          author: 'Josophat Makawa',
          tags: [file.subject, 'quiz'],
          contentSnippet: snippet
        });
      }
    } catch (error) {
      // Skip failed loads
    }
  }

  // Add PDFs
  for (const pdf of pdfFiles) {
    results.push({
      id: pdf.path,
      title: pdf.title,
      description: pdf.description,
      type: 'document',
      path: pdf.path,
      category: pdf.category,
      author: pdf.author,
      tags: [pdf.category.toLowerCase().replace(' ', '-')],
    });
  }

  contentCache = results;
  isLoadingContent = false;
  return results;
}

function extractTitleFromMarkdown(content: string): string | null {
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.startsWith('# ')) {
      return line.substring(2).trim();
    }
  }
  return null;
}

function extractDescriptionFromMarkdown(content: string): string | null {
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trim() && !line.startsWith('#') && line.length > 20) {
      return line.trim();
    }
  }
  return null;
}

function getContentSnippet(content: string, maxLength: number): string {
  // Remove markdown headers and get plain text
  const plainText = content
    .replace(/^#+\s.*$/gm, '') // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links
    .replace(/\$\$[\s\S]*?\$\$/g, '') // Remove display math
    .replace(/\$[^$\n]+\$/g, '') // Remove inline math
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
}

export const searchContent = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/);

  // Get static content
  let allContent = [...allSearchableContent];

  // Load dynamic content
  const dynamicContent = await loadDynamicContent();
  allContent = [...allContent, ...dynamicContent];

  const results = allContent
    .map(item => {
      let score = 0;
      let matchedSnippet = '';

      // Title matching (highest priority)
      const titleLower = item.title.toLowerCase();
      if (titleLower === normalizedQuery) score += 100;
      else if (titleLower.includes(normalizedQuery)) {
        score += 50;
        matchedSnippet = item.title;
      } else {
        queryWords.forEach(word => {
          if (titleLower.includes(word)) score += 20;
        });
      }

      // Description matching
      const descLower = item.description.toLowerCase();
      if (descLower.includes(normalizedQuery)) {
        score += 30;
        if (!matchedSnippet) matchedSnippet = item.description;
      } else {
        queryWords.forEach(word => {
          if (descLower.includes(word)) score += 10;
        });
      }

      // Content snippet matching (for dynamic content)
      if (item.contentSnippet) {
        const snippetLower = item.contentSnippet.toLowerCase();
        if (snippetLower.includes(normalizedQuery)) {
          score += 25;
          if (!matchedSnippet) matchedSnippet = item.contentSnippet;
        } else {
          queryWords.forEach(word => {
            if (snippetLower.includes(word)) score += 5;
          });
        }
      }

      // Tags matching
      if (item.tags) {
        item.tags.forEach(tag => {
          const tagLower = tag.toLowerCase();
          if (tagLower === normalizedQuery) score += 40;
          else if (tagLower.includes(normalizedQuery)) score += 20;
          else {
            queryWords.forEach(word => {
              if (tagLower.includes(word)) score += 8;
            });
          }
        });
      }

      // Author matching
      if (item.author) {
        const authorLower = item.author.toLowerCase();
        if (authorLower.includes(normalizedQuery)) score += 15;
      }

      // Category matching
      if (item.category) {
        const categoryLower = item.category.toLowerCase();
        if (categoryLower.includes(normalizedQuery)) score += 15;
      }

      return { ...item, score, contentSnippet: matchedSnippet || item.contentSnippet };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15); // Increased limit for more results

  return results;
};

// ——————————————————————————————————————————————————
// DB-backed full-text search (Postgres RPC)
// Falls back to empty array if DB unavailable.
// ——————————————————————————————————————————————————
export async function searchContentDB(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  try {
    const [notesRes, tutorialsRes] = await Promise.all([
      supabase.rpc('search_notes', { search_query: query }),
      supabase.rpc('search_tutorials', { search_query: query }),
    ]);

    const results: SearchResult[] = [];

    (notesRes.data ?? []).forEach((row: {
      id: string; slug: string; title: string; subject_id: string; rank: number
    }) => {
      results.push({
        id: row.id,
        title: row.title,
        description: '',
        type: 'note',
        path: `/notes/${row.slug}`,
        category: 'Study Notes',
        author: 'Josophat Makawa',
        tags: ['note'],
      });
    });

    (tutorialsRes.data ?? []).forEach((row: {
      id: string; slug: string; title: string; subject_id: string; rank: number
    }) => {
      results.push({
        id: row.id,
        title: row.title,
        description: '',
        type: 'tutorial',
        path: `/tutorials/${row.slug}`,
        category: 'Tutorials',
        author: 'Josophat Makawa',
        tags: ['tutorial'],
      });
    });

    return results;
  } catch {
    return [];
  }
}