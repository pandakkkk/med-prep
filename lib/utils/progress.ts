// Progress tracking utilities for NEET PG Prep

import { subjects } from "@/lib/data/subjects";
import { getAllQuestions } from "@/lib/data/questions";

export interface AnsweredQuestion {
  questionId: string;
  subjectId: string;
  chapterId: string;
  selectedAnswer: number;
  correctAnswer: number;
  timestamp: number;
}

export interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  percentage: number;
  accuracy: number;
  lastAttempted?: number;
}

export interface ChapterProgress {
  chapterId: string;
  chapterName: string;
  subjectId: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  percentage: number;
  accuracy: number;
}

export interface OverallProgress {
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  percentage: number;
  accuracy: number;
  streak: number;
  lastStudyDate?: string;
  subjectsProgress: SubjectProgress[];
}

// Get answered questions from localStorage
export function getAnsweredQuestions(): AnsweredQuestion[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem("answeredQuestions");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading answered questions:", error);
  }
  return [];
}

// Calculate overall progress
export function calculateOverallProgress(): OverallProgress {
  const answeredQuestions = getAnsweredQuestions();
  const allQuestions = getAllQuestions();
  
  const totalQuestions = allQuestions.length;
  
  // Get unique questions (in case same question answered multiple times)
  const uniqueAnswered = new Map<string, AnsweredQuestion>();
  answeredQuestions.forEach(aq => {
    // Keep the latest attempt
    if (!uniqueAnswered.has(aq.questionId) || 
        aq.timestamp > uniqueAnswered.get(aq.questionId)!.timestamp) {
      uniqueAnswered.set(aq.questionId, aq);
    }
  });
  
  const attempted = uniqueAnswered.size;
  let correct = 0;
  let incorrect = 0;
  
  uniqueAnswered.forEach(aq => {
    if (aq.selectedAnswer === aq.correctAnswer) {
      correct++;
    } else {
      incorrect++;
    }
  });
  
  const percentage = totalQuestions > 0 ? (attempted / totalQuestions) * 100 : 0;
  const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
  
  // Calculate study streak
  const streak = calculateStudyStreak(answeredQuestions);
  
  // Get last study date
  const lastStudyDate = answeredQuestions.length > 0 
    ? new Date(Math.max(...answeredQuestions.map(aq => aq.timestamp))).toLocaleDateString()
    : undefined;
  
  // Calculate progress per subject
  const subjectsProgress = calculateSubjectsProgress(Array.from(uniqueAnswered.values()));
  
  return {
    totalQuestions,
    attempted,
    correct,
    incorrect,
    percentage,
    accuracy,
    streak,
    lastStudyDate,
    subjectsProgress,
  };
}

// Calculate progress for each subject
export function calculateSubjectsProgress(answeredQuestions: AnsweredQuestion[]): SubjectProgress[] {
  const allQuestions = getAllQuestions();
  
  return subjects.map(subject => {
    // Get all questions for this subject
    const subjectQuestions = allQuestions.filter(q => q.subjectId === subject.id);
    const totalQuestions = subjectQuestions.length;
    
    // Get answered questions for this subject
    const subjectAnswered = answeredQuestions.filter(aq => aq.subjectId === subject.id);
    const attempted = subjectAnswered.length;
    
    let correct = 0;
    let incorrect = 0;
    let lastAttempted: number | undefined;
    
    subjectAnswered.forEach(aq => {
      if (aq.selectedAnswer === aq.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
      if (!lastAttempted || aq.timestamp > lastAttempted) {
        lastAttempted = aq.timestamp;
      }
    });
    
    const percentage = totalQuestions > 0 ? (attempted / totalQuestions) * 100 : 0;
    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
    
    return {
      subjectId: subject.id,
      subjectName: subject.name,
      totalQuestions,
      attempted,
      correct,
      incorrect,
      percentage,
      accuracy,
      lastAttempted,
    };
  }).filter(sp => sp.totalQuestions > 0); // Only include subjects with questions
}

// Calculate progress for a specific subject
export function getSubjectProgress(subjectId: string): SubjectProgress | null {
  const progress = calculateOverallProgress();
  return progress.subjectsProgress.find(sp => sp.subjectId === subjectId) || null;
}

// Calculate progress for chapters in a subject
export function getChaptersProgress(subjectId: string): ChapterProgress[] {
  const answeredQuestions = getAnsweredQuestions();
  const allQuestions = getAllQuestions();
  const subject = subjects.find(s => s.id === subjectId);
  
  if (!subject) return [];
  
  // Get unique answered questions
  const uniqueAnswered = new Map<string, AnsweredQuestion>();
  answeredQuestions.forEach(aq => {
    if (!uniqueAnswered.has(aq.questionId) || 
        aq.timestamp > uniqueAnswered.get(aq.questionId)!.timestamp) {
      uniqueAnswered.set(aq.questionId, aq);
    }
  });
  
  return subject.chapters.map(chapter => {
    const chapterQuestions = allQuestions.filter(
      q => q.subjectId === subjectId && q.chapterId === chapter.id
    );
    const totalQuestions = chapterQuestions.length;
    
    const chapterAnswered = Array.from(uniqueAnswered.values()).filter(
      aq => aq.subjectId === subjectId && aq.chapterId === chapter.id
    );
    const attempted = chapterAnswered.length;
    
    let correct = 0;
    let incorrect = 0;
    
    chapterAnswered.forEach(aq => {
      if (aq.selectedAnswer === aq.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });
    
    const percentage = totalQuestions > 0 ? (attempted / totalQuestions) * 100 : 0;
    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
    
    return {
      chapterId: chapter.id,
      chapterName: chapter.name,
      subjectId,
      totalQuestions,
      attempted,
      correct,
      incorrect,
      percentage,
      accuracy,
    };
  }).filter(cp => cp.totalQuestions > 0);
}

// Calculate study streak (consecutive days studied)
function calculateStudyStreak(answeredQuestions: AnsweredQuestion[]): number {
  if (answeredQuestions.length === 0) return 0;
  
  // Get unique study dates
  const studyDates = new Set<string>();
  answeredQuestions.forEach(aq => {
    const date = new Date(aq.timestamp).toDateString();
    studyDates.add(date);
  });
  
  const sortedDates = Array.from(studyDates)
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime()); // Most recent first
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedDates.length; i++) {
    const studyDate = new Date(sortedDates[i]);
    studyDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);
    
    if (studyDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// Get recent activity (last N answered questions)
export function getRecentActivity(limit: number = 10): AnsweredQuestion[] {
  const answeredQuestions = getAnsweredQuestions();
  return answeredQuestions
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

// Export data for backup/download
export function exportProgressData(): string {
  const progress = calculateOverallProgress();
  const answeredQuestions = getAnsweredQuestions();
  
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    progress,
    answeredQuestions,
  }, null, 2);
}

// Import data from backup
export function importProgressData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    if (data.answeredQuestions && Array.isArray(data.answeredQuestions)) {
      localStorage.setItem("answeredQuestions", JSON.stringify(data.answeredQuestions));
      return true;
    }
  } catch (error) {
    console.error("Error importing progress data:", error);
  }
  return false;
}

