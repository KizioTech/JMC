/**
 * Navigation Configuration
 * This file manages the relationships between chapters (notes) and tutorials
 */

export interface ChapterNav {
  id: string;
  title: string;
  notesPath: string;
  tutorialPath?: string;
  prevChapter?: string;
  nextChapter?: string;
}

export interface TutorialNav {
  id: string;
  title: string;
  tutorialPath: string;
  notesPath?: string;
  quizPath?: string;
  prevTutorial?: string;
  nextTutorial?: string;
}

export interface NavigationConfig {
  chapters: ChapterNav[];
  tutorials: TutorialNav[];
  libraryPath: string;
  tutorialsIndexPath: string;
}

/**
 * Configuration for JMC Mathematics Course
 * notesPath and tutorialPath are route URLs for navigation
 */
export const navigationConfig: NavigationConfig = {
  libraryPath: '/courses',
  tutorialsIndexPath: '/tutorials',

  chapters: [
    {
      id: 'transcendental-functions',
      title: 'Transcendental Functions',
      notesPath: '/notes/transcendental-functions',
      tutorialPath: '/tutorials/calculus/transcendental-functions-tutorial',
      nextChapter: 'trigonometric-functions'
    },
    {
      id: 'trigonometric-functions',
      title: 'Trigonometric Functions',
      notesPath: '/notes/trigonometric-functions',
      tutorialPath: '/tutorials/calculus/trigonometric-functions-tutorial',
      prevChapter: 'transcendental-functions',
      nextChapter: 'hyperbolic-functions'
    },
    {
      id: 'hyperbolic-functions',
      title: 'Hyperbolic Functions',
      notesPath: '/notes/hyperbolic-functions',
      tutorialPath: '/tutorials/calculus/hyperbolic-functions-tutorial',
      prevChapter: 'trigonometric-functions'
    },
    {
      id: 'counting-techniques',
      title: 'Counting Techniques',
      notesPath: '/notes/counting-techniques',
      tutorialPath: '/tutorials/discrete/counting-techniques-tutorial',
      nextChapter: 'pigeonhole-principle'
    },
    {
      id: 'pigeonhole-principle',
      title: 'Pigeonhole Principle',
      notesPath: '/notes/pigeonhole-principle',
      tutorialPath: '/tutorials/discrete/pigeonhole-principle-tutorial',
      prevChapter: 'counting-techniques',
      nextChapter: 'recurrence-relations'
    },
    {
      id: 'recurrence-relations',
      title: 'Recurrence Relations',
      notesPath: '/notes/recurrence-relations',
      tutorialPath: '/tutorials/discrete/recurrence-relations-tutorial',
      prevChapter: 'pigeonhole-principle'
    },
    {
      id: 'angular-measure',
      title: 'Angular Measure',
      notesPath: '/notes/angular-measure',
      tutorialPath: '/tutorials/trigonometry/angular-measure-tutorial',
      nextChapter: 'arcs-and-sectors',
    },
    {
      id: 'arcs-and-sectors',
      title: 'Arcs and Sectors',
      notesPath: '/notes/arcs-and-sectors',
      tutorialPath: '/tutorials/trigonometry/arcs-and-sectors-tutorial',
      prevChapter: 'angular-measure'
    }
  ],

  tutorials: [
    {
      id: 'transcendental-functions-tutorial',
      title: 'Transcendental Functions Tutorial',
      tutorialPath: '/tutorials/calculus/transcendental-functions-tutorial',
      notesPath: '/notes/transcendental-functions',
      quizPath: '/quiz/transcendental-functions-tutorial1',
      nextTutorial: 'trigonometric-functions-tutorial'
    },
    {
      id: 'trigonometric-functions-tutorial',
      title: 'Trigonometric Functions Tutorial',
      tutorialPath: '/tutorials/calculus/trigonometric-functions-tutorial',
      notesPath: '/notes/trigonometric-functions',
      prevTutorial: 'transcendental-functions-tutorial',
      nextTutorial: 'hyperbolic-functions-tutorial'
    },
    {
      id: 'hyperbolic-functions-tutorial',
      title: 'Hyperbolic Functions Tutorial',
      tutorialPath: '/tutorials/calculus/hyperbolic-functions-tutorial',
      notesPath: '/notes/hyperbolic-functions',
      prevTutorial: 'trigonometric-functions-tutorial'
    },
    {
      id: 'counting-techniques-tutorial',
      title: 'Counting Techniques Tutorial',
      tutorialPath: '/tutorials/discrete/counting-techniques-tutorial',
      notesPath: '/notes/counting-techniques',
      nextTutorial: 'pigeonhole-principle-tutorial'
    },
    {
      id: 'pigeonhole-principle-tutorial',
      title: 'Pigeonhole Principle Tutorial',
      tutorialPath: '/tutorials/discrete/pigeonhole-principle-tutorial',
      notesPath: '/notes/pigeonhole-principle',
      prevTutorial: 'counting-techniques-tutorial',
      nextTutorial: 'recurrence-relations-tutorial'
    },
    {
      id: 'recurrence-relations-tutorial',
      title: 'Recurrence Relations Tutorial',
      tutorialPath: '/tutorials/discrete/recurrence-relations-tutorial',
      notesPath: '/notes/recurrence-relations',
      prevTutorial: 'pigeonhole-principle-tutorial'
    },
    {
      id: 'angular-measure-tutorial',
      title: 'Angular Measure Tutorial',
      tutorialPath: '/tutorials/trigonometry/angular-measure-tutorial',
      prevTutorial: 'recurrence-relations-tutorial',
      nextTutorial: 'arcs-and-sectors-tutorial'
    },
    {
      id: 'arcs-and-sectors-tutorial',
      title: 'Arcs and Sectors Tutorial',
      tutorialPath: '/tutorials/trigonometry/arcs-and-sectors-tutorial',
      prevTutorial: 'angular-measure-tutorial',
      notesPath: '/notes/arcs-and-sectors'
    },
    {
      id: 'quadratic-equations-tutorial',
      title: 'Solving Quadratic Equations - Interactive Tutorial',
      tutorialPath: '/tutorials/algebra/quadratic-equations-tutorial',
      prevTutorial: 'angular-measure-tutorial'
    }
  ]
};

/**
 * Helper functions to find navigation data
 */
export const findChapterByPath = (path: string): ChapterNav | undefined => {
  return navigationConfig.chapters.find(ch => ch.notesPath === path);
};

export const findTutorialByPath = (path: string): TutorialNav | undefined => {
  return navigationConfig.tutorials.find(tut => tut.tutorialPath === path);
};

export const getChapterNavigation = (currentPath: string) => {
  const currentChapter = findChapterByPath(currentPath);
  if (!currentChapter) return null;

  const prevChapter = currentChapter.prevChapter
    ? navigationConfig.chapters.find(ch => ch.id === currentChapter.prevChapter)
    : undefined;

  const nextChapter = currentChapter.nextChapter
    ? navigationConfig.chapters.find(ch => ch.id === currentChapter.nextChapter)
    : undefined;

  return {
    current: currentChapter,
    prev: prevChapter,
    next: nextChapter,
    allChapters: navigationConfig.chapters
  };
};

export const getTutorialNavigation = (currentPath: string) => {
  const currentTutorial = findTutorialByPath(currentPath);
  if (!currentTutorial) return null;

  const prevTutorial = currentTutorial.prevTutorial
    ? navigationConfig.tutorials.find(tut => tut.id === currentTutorial.prevTutorial)
    : undefined;

  const nextTutorial = currentTutorial.nextTutorial
    ? navigationConfig.tutorials.find(tut => tut.id === currentTutorial.nextTutorial)
    : undefined;

  return {
    current: currentTutorial,
    prev: prevTutorial,
    next: nextTutorial,
    allTutorials: navigationConfig.tutorials
  };
};