"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { subjects } from "@/lib/data/subjects";
import { getQuestionsBySubjectAsync } from "@/lib/data/questionsV2";
import { Question } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, XCircle, BookOpen, Trophy, ArrowRight, Filter } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function SubjectPracticePage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;

  const subject = useMemo(() => subjects.find((s) => s.id === subjectId), [subjectId]);

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<string>("all");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState("");

  // Load all questions for this subject
  useEffect(() => {
    let isMounted = true;

    async function loadQuestions() {
      setIsLoading(true);
      try {
        const loaded = await getQuestionsBySubjectAsync(subjectId);
        if (isMounted) {
          setAllQuestions(loaded);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      isMounted = false;
    };
  }, [subjectId]);

  // Get unique exams from questions
  const availableExams = useMemo(() => {
    const exams = new Set<string>();
    allQuestions.forEach(q => {
      if (q.chapterId) {
        exams.add(q.chapterId);
      }
    });
    return Array.from(exams).sort();
  }, [allQuestions]);

  // Filter questions based on selected exam
  const filteredQuestions = useMemo(() => {
    if (selectedExam === "all") {
      return allQuestions;
    }
    return allQuestions.filter(q => q.chapterId === selectedExam);
  }, [allQuestions, selectedExam]);

  const currentQuestion = useMemo(() => filteredQuestions[currentQuestionIndex], [filteredQuestions, currentQuestionIndex]);
  const progress = useMemo(() => ((currentQuestionIndex + 1) / filteredQuestions.length) * 100, [currentQuestionIndex, filteredQuestions.length]);
  const totalAttempted = useMemo(() => score.correct + score.incorrect, [score.correct, score.incorrect]);

  const encouragements = useMemo(() => ({
    correct: [
      "Excellent, Preeti! That's the correct answer! 🎯",
      "Perfect! You're understanding these concepts well! ✓",
      "Correct! Your preparation is showing great results! 📚",
      "Well done! Keep up this consistent effort! ⭐",
      "That's right! Your hard work is paying off! 💪",
    ],
    incorrect: [
      "Not quite right, but that's okay! Review the explanation carefully. 📖",
      "Incorrect this time. Let's learn from this - check the detailed explanation! 💡",
      "That's not the answer, but every mistake is a learning opportunity! 📝",
      "Wrong answer, but don't worry - understanding the explanation is key! 🔍",
    ]
  }), []);

  const handleAnswerSelect = useCallback((optionIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(optionIndex);
  }, [showExplanation]);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer === null || !currentQuestion) return;

    setShowExplanation(true);
    setAnsweredQuestions(new Set(answeredQuestions).add(currentQuestionIndex));

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Save to localStorage
    try {
      const answeredQuestion = {
        questionId: currentQuestion.id,
        subjectId: params.subjectId,
        chapterId: currentQuestion.chapterId,
        selectedAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        timestamp: Date.now(),
      };

      const stored = localStorage.getItem("answeredQuestions");
      const existing = stored ? JSON.parse(stored) : [];
      
      const existingIndex = existing.findIndex(
        (q: any) => q.questionId === currentQuestion.id
      );
      
      if (existingIndex >= 0) {
        existing[existingIndex] = answeredQuestion;
      } else {
        existing.push(answeredQuestion);
      }
      
      localStorage.setItem("answeredQuestions", JSON.stringify(existing));
    } catch (error) {
      console.error("Failed to save answer:", error);
    }
    
    if (isCorrect) {
      setScore({ ...score, correct: score.correct + 1 });
      setShowCelebration(true);
      setEncouragementMessage(encouragements.correct[Math.floor(Math.random() * encouragements.correct.length)]);
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      setScore({ ...score, incorrect: score.incorrect + 1 });
      setEncouragementMessage(encouragements.incorrect[Math.floor(Math.random() * encouragements.incorrect.length)]);
    }
  }, [selectedAnswer, currentQuestion, answeredQuestions, currentQuestionIndex, score, params.subjectId, encouragements]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setEncouragementMessage("");
    }
  }, [currentQuestionIndex, filteredQuestions.length]);

  const handleExamFilterChange = useCallback((exam: string) => {
    setSelectedExam(exam);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore({ correct: 0, incorrect: 0 });
    setAnsweredQuestions(new Set());
  }, []);

  const isCorrect = useMemo(() => 
    currentQuestion ? selectedAnswer === currentQuestion.correctAnswer : false, 
    [selectedAnswer, currentQuestion]
  );
  const accuracy = useMemo(() => totalAttempted > 0 ? ((score.correct / totalAttempted) * 100).toFixed(1) : 0, [score.correct, totalAttempted]);

  if (!subject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subject not found</h1>
          <Button asChild>
            <Link href="/">Go back to subjects</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <Link
          href="/"
          className="inline-flex items-center mb-6 text-sm text-gray-600 hover:text-pink-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Subjects
        </Link>
        
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-pink-100 to-purple-100">
            <div className="text-3xl animate-pulse">💕</div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading questions...</h2>
          <p className="text-gray-600">Preparing your {subject.name} practice session</p>
        </div>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <Link
          href="/"
          className="inline-flex items-center mb-6 text-sm text-gray-600 hover:text-pink-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Subjects
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>{subject.name}</CardTitle>
            <CardDescription>No questions available for this filter</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Try selecting a different exam filter or check back later for new questions.
            </p>
            <Button onClick={() => setSelectedExam("all")}>Show All Questions</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center mb-4 text-sm text-gray-600 hover:text-pink-600 touch-manipulation"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subjects
          </Link>

          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`rounded-xl ${subject.color} p-3 text-3xl`}>
                {subject.icon}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{subject.name}</h1>
                <p className="text-gray-600">{filteredQuestions.length} Questions</p>
              </div>
            </div>

            {/* Exam Filter */}
            <Card className="border-2 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Filter by Exam</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedExam === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleExamFilterChange("all")}
                    className={selectedExam === "all" ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
                  >
                    All ({allQuestions.length})
                  </Button>
                  {availableExams.map((exam) => {
                    const examQuestions = allQuestions.filter(q => q.chapterId === exam);
                    const examName = subject.chapters.find(c => c.id === exam)?.name || exam;
                    return (
                      <Button
                        key={exam}
                        variant={selectedExam === exam ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleExamFilterChange(exam)}
                        className={selectedExam === exam ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
                      >
                        {examName} ({examQuestions.length})
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Scrollable Question Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 py-6 pb-20">
          {/* Progress Bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                </span>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 font-medium">✓ {score.correct}</span>
                  <span className="text-red-600 font-medium">✗ {score.incorrect}</span>
                  {totalAttempted > 0 && (
                    <span className="text-purple-600 font-medium">
                      {accuracy}% Accuracy
                    </span>
                  )}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              {currentQuestion.chapter || "Question"}
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {currentQuestion.difficulty || "Medium"}
            </Badge>
          </div>
          <CardTitle className="text-lg sm:text-xl">
            <ReactMarkdown>{currentQuestion.question}</ReactMarkdown>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion.imageUrl && (
            <div className="mb-4">
              <img
                src={currentQuestion.imageUrl}
                alt="Question"
                className="max-w-full rounded-lg"
              />
            </div>
          )}

          <div className="space-y-3">
            {currentQuestion.options.map((option: string, index: number) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQuestion.correctAnswer;
              const showCorrect = showExplanation && isCorrectAnswer;
              const showIncorrect = showExplanation && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all touch-manipulation ${
                    showCorrect
                      ? "border-green-500 bg-green-50"
                      : showIncorrect
                      ? "border-red-500 bg-red-50"
                      : isSelected
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  } ${showExplanation ? "cursor-not-allowed" : "cursor-pointer active:scale-98"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">
                      <ReactMarkdown>{option}</ReactMarkdown>
                    </span>
                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />}
                    {showIncorrect && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />}
                  </div>
                </button>
              );
            })}
          </div>

          {encouragementMessage && (
            <div className={`mt-4 p-4 rounded-lg ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              <p className="text-sm font-medium">{encouragementMessage}</p>
            </div>
          )}

          {showExplanation && currentQuestion.explanation && (
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Explanation
              </h4>
              <div className="text-sm text-blue-800">
                <ReactMarkdown>{currentQuestion.explanation}</ReactMarkdown>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {!showExplanation ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex >= filteredQuestions.length - 1}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {currentQuestionIndex >= filteredQuestions.length - 1 ? (
                  "Quiz Complete! 🎉"
                ) : (
                  <>
                    Next Question <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

          {/* Celebration Animation */}
          {showCelebration && (
            <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
              <div className="text-6xl animate-bounce">🎉</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

