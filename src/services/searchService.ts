// services/searchService.ts
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'document' | 'note';
  path: string;
  tags?: string[];
  author?: string;
  category?: string;
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

export const searchContent = (query: string): SearchResult[] => {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/);

  return allSearchableContent
    .map(item => {
      let score = 0;

      // Title matching (highest priority)
      const titleLower = item.title.toLowerCase();
      if (titleLower === normalizedQuery) score += 100;
      else if (titleLower.includes(normalizedQuery)) score += 50;
      else {
        queryWords.forEach(word => {
          if (titleLower.includes(word)) score += 20;
        });
      }

      // Description matching
      const descLower = item.description.toLowerCase();
      if (descLower.includes(normalizedQuery)) score += 30;
      else {
        queryWords.forEach(word => {
          if (descLower.includes(word)) score += 10;
        });
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

      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
};

export const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'page': return 'Page';
    case 'document': return 'Document';
    case 'note': return 'Study Note';
    default: return type;
  }
};

export const getTypeColor = (type: string): string => {
  switch (type) {
    case 'page': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'document': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    case 'note': return 'bg-green-500/10 text-green-600 border-green-500/20';
    default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};