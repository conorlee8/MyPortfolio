'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

export type PathType = 'freelance' | 'fulltime' | null;

interface PathContextType {
  selectedPath: PathType;
  setSelectedPath: (path: PathType) => void;
  isFreelance: boolean;
  isFulltime: boolean;
  getFilteredContent: <T extends ContentItem>(items: T[]) => T[];
  getPersonalizedConfig: () => PersonalizedConfig;
}

interface ContentItem {
  tags?: string[];
  relevance?: {
    freelance?: number;
    fulltime?: number;
  };
}

interface PersonalizedConfig {
  themeAccent: string;
  primaryGradient: string;
  ctaText: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutFocus: string;
  skillsEmphasis: string[];
}

const PathContext = createContext<PathContextType | undefined>(undefined);

export function PathProvider({ children }: { children: ReactNode }) {
  const [selectedPath, setSelectedPathState] = useState<PathType>(null);

  // Computed values
  const isFreelance = useMemo(() => selectedPath === 'freelance', [selectedPath]);
  const isFulltime = useMemo(() => selectedPath === 'fulltime', [selectedPath]);

  // Advanced filtering algorithm with relevance scoring
  const getFilteredContent = useCallback(
    <T extends ContentItem>(items: T[]): T[] => {
      if (!selectedPath) return items;

      // Score each item based on relevance
      const scoredItems = items.map((item) => {
        let score = 1; // Base score

        // Relevance multiplier
        if (item.relevance?.[selectedPath]) {
          score *= item.relevance[selectedPath];
        }

        // Tag matching bonus
        const pathTags = selectedPath === 'freelance'
          ? ['project', 'contract', 'freelance', 'client', 'individual']
          : ['fulltime', 'team', 'employment', 'corporate', 'career'];

        if (item.tags) {
          const tagMatches = item.tags.filter((tag) =>
            pathTags.some((pathTag) => tag.toLowerCase().includes(pathTag))
          ).length;
          score += tagMatches * 0.5;
        }

        return { item, score };
      });

      // Sort by score (descending) and return items
      return scoredItems
        .sort((a, b) => b.score - a.score)
        .map((scored) => scored.item);
    },
    [selectedPath]
  );

  // Personalized configuration based on path
  const getPersonalizedConfig = useCallback((): PersonalizedConfig => {
    if (selectedPath === 'freelance') {
      return {
        themeAccent: 'from-green-500 to-emerald-400',
        primaryGradient: 'from-green-400 via-emerald-500 to-green-600',
        ctaText: 'Start Your Project',
        heroTitle: 'Available for Your Next Project',
        heroSubtitle: 'Delivering high-quality solutions on time and within budget',
        aboutFocus: 'project-oriented',
        skillsEmphasis: ['React', 'Next.js', 'TypeScript', 'Rapid Development'],
      };
    } else if (selectedPath === 'fulltime') {
      return {
        themeAccent: 'from-red-500 to-rose-400',
        primaryGradient: 'from-red-400 via-rose-500 to-red-600',
        ctaText: 'Schedule Interview',
        heroTitle: 'Seeking Full-Time Opportunities',
        heroSubtitle: 'Ready to contribute to a dynamic team and grow together',
        aboutFocus: 'team-oriented',
        skillsEmphasis: ['Team Collaboration', 'Agile', 'System Architecture', 'Mentorship'],
      };
    }

    // Default config
    return {
      themeAccent: 'from-cyan-500 to-blue-400',
      primaryGradient: 'from-cyan-400 via-blue-500 to-purple-600',
      ctaText: 'Get in Touch',
      heroTitle: 'Building Modern Web Experiences',
      heroSubtitle: 'Freelance & full-time opportunities available',
      aboutFocus: 'balanced',
      skillsEmphasis: ['Full-Stack Development', 'Modern Frameworks', 'UI/UX'],
    };
  }, [selectedPath]);

  // Wrapped setter with View Transitions API support
  const setSelectedPath = useCallback((path: PathType) => {
    // Check if View Transitions API is supported
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      // @ts-ignore - View Transitions API is new
      document.startViewTransition(() => {
        setSelectedPathState(path);
      });
    } else {
      setSelectedPathState(path);
    }
  }, []);

  const value = useMemo(
    () => ({
      selectedPath,
      setSelectedPath,
      isFreelance,
      isFulltime,
      getFilteredContent,
      getPersonalizedConfig,
    }),
    [selectedPath, setSelectedPath, isFreelance, isFulltime, getFilteredContent, getPersonalizedConfig]
  );

  return <PathContext.Provider value={value}>{children}</PathContext.Provider>;
}

export function usePath() {
  const context = useContext(PathContext);
  if (context === undefined) {
    throw new Error('usePath must be used within a PathProvider');
  }
  return context;
}

// Custom hook for animated content transitions
export function usePathTransition() {
  const { selectedPath } = usePath();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionContent = useCallback(
    (callback: () => void) => {
      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        setIsTransitioning(true);
        // @ts-ignore
        document.startViewTransition(() => {
          callback();
          setTimeout(() => setIsTransitioning(false), 300);
        });
      } else {
        callback();
      }
    },
    []
  );

  return { isTransitioning, transitionContent, selectedPath };
}
