// Question Lazy Loading Utility
// Supports loading questions by subject on-demand for better performance

import { Question } from '../data/types';

// Cache loaded questions to avoid re-fetching
const questionCache = new Map<string, Question[]>();
const loadingPromises = new Map<string, Promise<Question[]>>();

/**
 * Load questions for a specific subject
 * Uses caching to avoid redundant loads
 */
export async function loadQuestionsBySubject(subjectId: string): Promise<Question[]> {
  // Return cached questions if available
  if (questionCache.has(subjectId)) {
    return questionCache.get(subjectId)!;
  }

  // Return existing promise if already loading
  if (loadingPromises.has(subjectId)) {
    return loadingPromises.get(subjectId)!;
  }

  // Start loading
  const loadPromise = fetchQuestionsBySubject(subjectId);
  loadingPromises.set(subjectId, loadPromise);

  try {
    const questions = await loadPromise;
    questionCache.set(subjectId, questions);
    loadingPromises.delete(subjectId);
    return questions;
  } catch (error) {
    loadingPromises.delete(subjectId);
    throw error;
  }
}

/**
 * Fetch questions from JSON file
 */
async function fetchQuestionsBySubject(subjectId: string): Promise<Question[]> {
  try {
    // Try to load from JSON file first (for future expansion)
    const response = await fetch(`/data/questions/${subjectId}.json`);
    
    if (response.ok) {
      const data = await response.json();
      return data.questions || data;
    }
    
    // Fallback to TypeScript module (current implementation)
    return await loadFromModule(subjectId);
  } catch (error) {
    // Fallback to TypeScript module
    return await loadFromModule(subjectId);
  }
}

/**
 * Dynamic import of TypeScript question modules
 */
async function loadFromModule(subjectId: string): Promise<Question[]> {
  try {
    // Try to dynamically import the subject-specific file
    const module = await import(`../data/questions/${subjectId}.ts`);
    return module.default || module.questions || [];
  } catch (error) {
    console.error(`Failed to load questions for subject: ${subjectId}`, error);
    
    // Final fallback: Try loading from main questions file
    try {
      const mainModule = await import('../data/questions');
      const allQuestions = mainModule.questions || [];
      return allQuestions.filter((q: Question) => q.subject === subjectId);
    } catch (fallbackError) {
      console.error('Failed to load questions from fallback', fallbackError);
      return [];
    }
  }
}

/**
 * Load questions for a specific chapter
 */
export async function loadQuestionsByChapter(
  subjectId: string,
  chapterId: string
): Promise<Question[]> {
  const allSubjectQuestions = await loadQuestionsBySubject(subjectId);
  return allSubjectQuestions.filter(q => q.chapter === chapterId);
}

/**
 * Preload questions for a subject (for better UX)
 */
export function preloadQuestions(subjectId: string): void {
  // Start loading in background without waiting
  loadQuestionsBySubject(subjectId).catch(error => {
    console.error(`Failed to preload questions for ${subjectId}:`, error);
  });
}

/**
 * Clear cache (useful for testing or if data updates)
 */
export function clearQuestionCache(subjectId?: string): void {
  if (subjectId) {
    questionCache.delete(subjectId);
    loadingPromises.delete(subjectId);
  } else {
    questionCache.clear();
    loadingPromises.clear();
  }
}

/**
 * Get cache statistics (for debugging)
 */
export function getQuestionCacheStats() {
  return {
    cachedSubjects: Array.from(questionCache.keys()),
    loadingSubjects: Array.from(loadingPromises.keys()),
    totalCachedQuestions: Array.from(questionCache.values())
      .reduce((sum, questions) => sum + questions.length, 0),
  };
}

/**
 * Load all questions (for backward compatibility)
 * NOT recommended for production with 5000+ questions
 */
export async function loadAllQuestions(): Promise<Question[]> {
  // Import the main questions file
  const module = await import('../data/questions');
  return module.questions || [];
}

/**
 * Check if questions are cached for a subject
 */
export function areQuestionsCached(subjectId: string): boolean {
  return questionCache.has(subjectId);
}

/**
 * Check if questions are currently loading for a subject
 */
export function areQuestionsLoading(subjectId: string): boolean {
  return loadingPromises.has(subjectId);
}

