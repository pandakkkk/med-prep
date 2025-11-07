// Type definitions for NEET PG questions

export interface Question {
  id: string;
  subjectId: string;
  chapterId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  year: number;
  imageUrl?: string; // Optional: URL to question image/diagram
}

