// Service for managing documents, sequences, and navigation
export interface DocumentInfo {
  id: string;
  title: string;
  subject: string;
  type: 'note' | 'tutorial';
  filePath: string;
  route: string;
  description?: string;
  tags?: string[];
  coverImage?: string;
}

export interface SequenceItem {
  id: string;
  title: string;
  route: string;
}

// Define sequences for each subject
const sequences: Record<string, SequenceItem[]> = {
  calculus: [
    { id: 'hyperbolic-functions', title: 'Hyperbolic Functions', route: '/notes/hyperbolic-functions' },
    { id: 'transcendental-functions', title: 'Transcendental Functions', route: '/notes/transcendental-functions' },
    { id: 'trigonometric-functions', title: 'Inverse Trigonometric Functions', route: '/notes/trigonometric-functions' },
  ],
  discrete: [
    { id: 'counting-techniques', title: 'Counting Techniques', route: '/notes/counting-techniques' },
    { id: 'pigeonhole-principle', title: 'Pigeonhole Principle', route: '/notes/pigeonhole-principle' },
    { id: 'recurrence-relations', title: 'Recurrence Relations', route: '/notes/recurrence-relations' },
  ],
  trigonometry: [
    { id: 'angular-measure', title: 'Angular Measure', route: '/notes/angular-measure' },
    { id: 'arcs-and-sectors', title: 'Arcs and Sectors', route: '/notes/arcs-and-sectors' },
  ],
  algebra: [
    { id: 'quadratic-equations', title: 'Solving Quadratic Equations', route: '/notes/quadratic-equations' },
  ],
};

// Tutorial sequences (same order as notes)
const tutorialSequences: Record<string, SequenceItem[]> = {
  calculus: [
    { id: 'hyperbolic-functions-tutorial', title: 'Hyperbolic Functions Tutorial', route: '/tutorials/calculus/hyperbolic-functions-tutorial' },
    { id: 'transcendental-functions-tutorial', title: 'Transcendental Functions Tutorial', route: '/tutorials/calculus/transcendental-functions-tutorial' },
    { id: 'trigonometric-functions-tutorial', title: 'Trigonometric Functions Tutorial', route: '/tutorials/calculus/trigonometric-functions-tutorial' },
  ],
  discrete: [
    { id: 'counting-techniques-tutorial', title: 'Counting Techniques Tutorial', route: '/tutorials/discrete/counting-techniques-tutorial' },
    { id: 'pigeonhole-principle-tutorial', title: 'Pigeonhole Principle Tutorial', route: '/tutorials/discrete/pigeonhole-principle-tutorial' },
    { id: 'recurrence-relations-tutorial', title: 'Recurrence Relations Tutorial', route: '/tutorials/discrete/recurrence-relations-tutorial' },
  ],
  trigonometry: [
    { id: 'angular-measure-tutorial', title: 'Angular Measure Tutorial', route: '/tutorials/trigonometry/angular-measure-tutorial' },
    {id: 'arcs-and-sectors-tutorial', title: 'Arcs and Sectors Tutorial', route: '/tutorials/trigonometry/arcs-and-sectors-tutorial' },
  ],
  algebra: [
    { id: 'quadratic-equations-tutorial', title: 'Solving Quadratic Equations Tutorial', route: '/tutorials/algebra/quadratic-equations-tutorial' },
  ],
};

// Mapping between notes and tutorials
const noteToTutorialMap: Record<string, string> = {
  'hyperbolic-functions': 'hyperbolic-functions-tutorial',
  'transcendental-functions': 'transcendental-functions-tutorial',
  'trigonometric-functions': 'trigonometric-functions-tutorial',
  'counting-techniques': 'counting-techniques-tutorial',
  'pigeonhole-principle': 'pigeonhole-principle-tutorial',
  'recurrence-relations': 'recurrence-relations-tutorial',
  'angular-measure': 'angular-measure-tutorial',
  'quadratic-equations': 'quadratic-equations-tutorial',
  'arcs-and-sectors': 'arcs-and-sectors-tutorial',
};

const tutorialToNoteMap: Record<string, string> = Object.fromEntries(
  Object.entries(noteToTutorialMap).map(([note, tutorial]) => [tutorial, note])
);

// Get navigation for a document
export const getNavigation = (subject: string, currentId: string, type: 'note' | 'tutorial') => {
  const seq = type === 'note' ? sequences[subject] : tutorialSequences[subject];
  if (!seq) return { prev: null, next: null };

  const currentIndex = seq.findIndex(item => item.id === currentId);
  if (currentIndex === -1) return { prev: null, next: null };

  const prev = currentIndex > 0 ? seq[currentIndex - 1] : null;
  const next = currentIndex < seq.length - 1 ? seq[currentIndex + 1] : null;

  return { prev, next };
};

// Get corresponding document route
export const getCorrespondingRoute = (currentId: string, type: 'note' | 'tutorial'): string | null => {
  if (type === 'note') {
    const tutorialId = noteToTutorialMap[currentId];
    if (tutorialId) {
      const subject = getSubjectFromId(currentId);
      const seq = tutorialSequences[subject];
      const item = seq?.find(s => s.id === tutorialId);
      return item?.route || null;
    }
  } else {
    const noteId = tutorialToNoteMap[currentId];
    if (noteId) {
      const subject = getSubjectFromId(currentId);
      const seq = sequences[subject];
      const item = seq?.find(s => s.id === noteId);
      return item?.route || null;
    }
  }
  return null;
};

// Get subject from document id
const getSubjectFromId = (id: string): string => {
  for (const [subject, seq] of Object.entries(sequences)) {
    if (seq.some(item => item.id === id)) return subject;
  }
  for (const [subject, seq] of Object.entries(tutorialSequences)) {
    if (seq.some(item => item.id === id)) return subject;
  }
  return '';
};

// Get all documents for Library
export const getAllDocuments = async (): Promise<Record<string, DocumentInfo[]>> => {
  const documents: Record<string, DocumentInfo[]> = {
    lectures: [],
    textbooks: [],
    exams: [],
    practice: []
  };

  // Add hardcoded textbooks, exams, practice (from original Library.tsx)
  documents.textbooks = [
    {
      id: 'stewart-calculus',
      title: 'Calculus by James Stewart',
      author: 'James Stewart',
      type: 'note', // dummy
      subject: 'calculus',
      filePath: '',
      route: '',
      description: 'The most successful calculus book of its generation, Stewart\'s CALCULUS offers an ideal balance of the conceptual and computational approaches to calculus.',
      tags: ['Calculus', 'Stewart', 'Brooks Cole'],
      viewUrl: '/assets/pdfs/James Stewart - Calculus-Brooks Cole (2015).pdf',
      downloadUrl: '/assets/pdfs/James Stewart - Calculus-Brooks Cole (2015).pdf',
      isPremium: false,
      size: '45.2 MB',
      publisher: 'Brooks Cole (2015)',
      coverImage: '/assets/images/covers/stewwart.jpg'
    } as any
  ];

  documents.exams = [
    {
      id: 'mat221-2014',
      title: 'MAT221 End Semester 2 (2014)',
      author: 'Mathematics Department',
      type: 'note',
      subject: 'calculus',
      filePath: '',
      route: '',
      description: 'End of semester examination paper for MAT221 from 2014. Covers calculus and analytical geometry topics.',
      tags: ['MAT221', 'Exam', '2014'],
      viewUrl: '/assets/pdfs/2014_Mat221_End_Semester2.pdf',
      downloadUrl: '/assets/pdfs/2014_Mat221_End_Semester2.pdf',
      isPremium: false,
      size: '245 KB',
      year: '2014',
      semester: 'Semester 2',
      coverImage: '/assets/images/covers/exam-cover.jpg'
    } as any
  ];

  documents.practice = [
    {
      id: 'mat221-practice',
      title: 'MAT221 Practice Questions',
      author: 'Mathematics Department',
      type: 'note',
      subject: 'calculus',
      filePath: '',
      route: '',
      description: 'Practice questions and exercises for MAT221 course covering various calculus topics with solutions.',
      tags: ['MAT221', 'Practice', 'Tutorial'],
      viewUrl: '/assets/pdfs/Mat221_practice_Questions_tutorial3[1].pdf',
      downloadUrl: '/assets/pdfs/Mat221_practice_Questions_tutorial3[1].pdf',
      isPremium: false,
      size: '135 KB',
      coverImage: '/assets/images/covers/practice-cover.jpg'
    } as any
  ];

  // Add notes from sequences
  for (const [subject, seq] of Object.entries(sequences)) {
    for (const item of seq) {
      const doc: any = {
        id: item.id,
        title: getTitleFromId(item.id, subject),
        subject,
        type: 'note',
        filePath: `/content/notes/${subject}/${item.id}.md`,
        route: item.route,
        description: getDescriptionFromId(item.id),
        tags: getTagsFromId(item.id, subject),
        coverImage: getCoverImage(subject),
        viewUrl: item.route,
      };
      documents.lectures.push(doc);
    }
  }

  return documents;
};

// Helper functions for metadata
const getTitleFromId = (id: string, subject: string): string => {
  const titleMap: Record<string, string> = {
    'hyperbolic-functions': 'CALCULUS II | Hyperbolic Functions',
    'transcendental-functions': 'CALCULUS II | Transcendental Functions',
    'trigonometric-functions': 'CALCULUS II | Inverse Trigonometric Functions',
    'counting-techniques': 'DISCRETE MATHEMATICS - Counting Techniques',
    'pigeonhole-principle': 'DISCRETE MATHEMATICS - Pigeonhole Principle',
    'recurrence-relations': 'DISCRETE MATHEMATICS - Recurrence Relations',
    'angular-measure': 'TRIGONOMETRY - Angular Measure',
    'quadratic-equations': 'ALGEBRA - Solving Quadratic Equations',
    'arcs-and-sectors': 'TRIGONOMETRY - Arcs and Sectors'
  };
  return titleMap[id] || id.replace(/-/g, ' ').toUpperCase();
};

const getDescriptionFromId = (id: string): string => {
  const descMap: Record<string, string> = {
    'hyperbolic-functions': 'A structured introduction to hyperbolic functions, including definitions, identities, graphs, derivatives, integrals, and their relationship to exponential functions, as covered in Calculus II.',
    'transcendental-functions': 'Advanced calculus covering exponential, logarithmic, and trigonometric functions with their derivatives and integrals.',
    'trigonometric-functions': 'A focused treatment of inverse trigonometric functions, including definitions, domains and ranges, graphs, differentiation rules, and integral applications commonly encountered in Calculus II.',
    'counting-techniques': 'Comprehensive guide to counting techniques in discrete mathematics including permutations, combinations, inclusion-exclusion principle, and applications.',
    'pigeonhole-principle': 'Complete coverage of the pigeonhole principle with applications in combinatorics, computer science, Ramsey theory, and advanced mathematical concepts.',
    'recurrence-relations': 'Advanced study of recurrence relations including linear homogeneous and non-homogeneous recurrences, generating functions, and algorithm analysis applications.',
    'angular-measure': 'Comprehensive coverage of angular measure including degrees, radians, conversion formulas, and common angles.',
    'quadratic-equations': 'Complete guide to solving quadratic equations including factoring, quadratic formula, completing the square, and applications.',
    'arcs-and-sectors': 'Detailed exploration of arcs and sectors in circles, including arc length, sector area, and related calculations.'
  };
  return descMap[id] || '';
};

const getTagsFromId = (id: string, subject: string): string[] => {
  const tagMap: Record<string, string[]> = {
    'hyperbolic-functions': ['Calculus II', 'Hyperbolic', 'Functions'],
    'transcendental-functions': ['Calculus II', 'Transcendental', 'Functions'],
    'trigonometric-functions': ['Calculus II', 'Trigonometric', 'Functions'],
    'counting-techniques': ['Discrete Math', 'Counting', 'Combinatorics'],
    'pigeonhole-principle': ['Discrete Math', 'Pigeonhole Principle', 'Combinatorics'],
    'recurrence-relations': ['Discrete Math', 'Recurrence Relations', 'Algorithm Analysis'],
    'angular-measure': ['Trigonometry', 'Angular Measure', 'Radians'],
    'quadratic-equations': ['Algebra', 'Quadratic Equations', 'Factoring'],
    'arcs-and-sectors': ['Trigonometry', 'Arcs and Sectors', 'Circle Calculations']
  };
  return tagMap[id] || [subject];
};

const getCoverImage = (subject: string): string => {
  const imageMap: Record<string, string> = {
    calculus: '/assets/images/covers/transfuncs.jpeg',
    discrete: '/assets/images/covers/discrete.svg',
    trigonometry: '/assets/images/trig.jfif',
    algebra: '/assets/images/algebra.jpg',
  };
  return imageMap[subject] || '/assets/images/covers/default.jpg';
};