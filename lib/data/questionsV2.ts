// V2 Questions API - Lazy Loading Support
// Backward compatible with existing code but optimized for 5000+ questions

import { Question } from './types';

// Subject-based question cache
const questionsBySubjectCache = new Map<string, Question[]>();
const loadingPromises = new Map<string, Promise<Question[]>>();

// Flag to check if we're using split files or monolithic
let usingSplitFiles = false;

/**
 * Get questions by chapter (lazy loaded)
 * Backward compatible API
 */
export async function getQuestionsByChapterAsync(
  subjectId: string,
  chapterId: string
): Promise<Question[]> {
  const subjectQuestions = await loadSubjectQuestions(subjectId);
  return subjectQuestions.filter(q => q.chapterId === chapterId);
}

/**
 * Get questions by subject (lazy loaded)
 * Backward compatible API
 */
export async function getQuestionsBySubjectAsync(
  subjectId: string
): Promise<Question[]> {
  return await loadSubjectQuestions(subjectId);
}

/**
 * Load all questions for a subject
 * Checks for split files first, falls back to main file
 */
async function loadSubjectQuestions(subjectId: string): Promise<Question[]> {
  // Return cached if available
  if (questionsBySubjectCache.has(subjectId)) {
    return questionsBySubjectCache.get(subjectId)!;
  }

  // Return existing promise if loading
  if (loadingPromises.has(subjectId)) {
    return loadingPromises.get(subjectId)!;
  }

  // Start loading
  const promise = fetchSubjectQuestions(subjectId);
  loadingPromises.set(subjectId, promise);

  try {
    const questions = await promise;
    questionsBySubjectCache.set(subjectId, questions);
    loadingPromises.delete(subjectId);
    return questions;
  } catch (error) {
    loadingPromises.delete(subjectId);
    throw error;
  }
}

/**
 * Fetch questions for a subject
 * Tries multiple strategies in order:
 * 1. Subject-specific TS file
 * 2. Subject-specific JSON file
 * 3. Fallback to main questions.ts
 */
async function fetchSubjectQuestions(subjectId: string): Promise<Question[]> {
  // Strategy 1: Try loading from subject-specific TS file
  try {
    const module = await import(`./questions/${subjectId}.ts`);
    usingSplitFiles = true;
    return module.default || module.questions || module.sampleQuestions || [];
  } catch (tsError) {
    // Strategy 2: Try loading from JSON file
    try {
      const response = await fetch(`/data/questions/${subjectId}.json`);
      if (response.ok) {
        const data = await response.json();
        usingSplitFiles = true;
        return data.questions || data;
      }
    } catch (jsonError) {
      // Continue to fallback
    }

    // Strategy 3: Fallback to main questions.ts file
    try {
      const mainModule = await import('./questions');
      const allQuestions = mainModule.sampleQuestions || [];
      return allQuestions.filter((q: Question) => q.subjectId === subjectId);
    } catch (fallbackError) {
      console.error(`Failed to load questions for ${subjectId}:`, fallbackError);
      return [];
    }
  }
}

/**
 * Synchronous version for backward compatibility
 * Only works with main questions.ts file
 * Use async versions for better performance
 */
export function getQuestionsByChapter(subjectId: string, chapterId: string): Question[] {
  try {
    // This only works if questions.ts is already loaded
    const mainModule = require('./questions');
    const allQuestions = mainModule.sampleQuestions || [];
    return allQuestions.filter(
      (q: Question) => q.subjectId === subjectId && q.chapterId === chapterId
    );
  } catch (error) {
    console.warn('Sync question loading failed. Use getQuestionsByChapterAsync() instead.');
    return [];
  }
}

/**
 * Synchronous version for backward compatibility
 * Only works with main questions.ts file
 * Use async versions for better performance
 */
export function getQuestionsBySubject(subjectId: string): Question[] {
  try {
    const mainModule = require('./questions');
    const allQuestions = mainModule.sampleQuestions || [];
    return allQuestions.filter((q: Question) => q.subjectId === subjectId);
  } catch (error) {
    console.warn('Sync question loading failed. Use getQuestionsBySubjectAsync() instead.');
    return [];
  }
}

/**
 * Preload questions for a subject
 * Improves UX by loading in background
 */
export function preloadSubjectQuestions(subjectId: string): void {
  loadSubjectQuestions(subjectId).catch(error => {
    console.error(`Failed to preload ${subjectId}:`, error);
  });
}

/**
 * Clear cache for a subject or all subjects
 */
export function clearCache(subjectId?: string): void {
  if (subjectId) {
    questionsBySubjectCache.delete(subjectId);
    loadingPromises.delete(subjectId);
  } else {
    questionsBySubjectCache.clear();
    loadingPromises.clear();
  }
}

/**
 * Get cache statistics (for debugging)
 */
export function getCacheStats() {
  return {
    usingSplitFiles,
    cachedSubjects: Array.from(questionsBySubjectCache.keys()),
    loadingSubjects: Array.from(loadingPromises.keys()),
    totalCached: Array.from(questionsBySubjectCache.values())
      .reduce((sum, questions) => sum + questions.length, 0),
  };
}

/**
 * Check if questions are cached
 */
export function isCached(subjectId: string): boolean {
  return questionsBySubjectCache.has(subjectId);
}

/**
 * Check if questions are loading
 */
export function isLoading(subjectId: string): boolean {
  return loadingPromises.has(subjectId);
}

// Export for backward compatibility
export { Question } from './types';

