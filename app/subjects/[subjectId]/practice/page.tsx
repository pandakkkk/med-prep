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
import { ArrowLeft, CheckCircle2, XCircle, BookOpen, Trophy, ArrowRight, Filter, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, Maximize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Utility function to clean text - removes extra spaces and normalizes whitespace
const cleanText = (text: string): string => {
  if (!text) return text;
  
  return text
    // Remove control characters that might appear as unwanted characters
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    // Replace newlines with spaces (preserves readability)
    .replace(/\n+/g, ' ')
    // Replace carriage returns
    .replace(/\r+/g, ' ')
    // Replace tabs with spaces
    .replace(/\t+/g, ' ')
    // Replace various Unicode spaces (non-breaking, zero-width, etc.) with regular space
    .replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
    // Replace multiple consecutive spaces with single space
    .replace(/ +/g, ' ')
    // Remove spaces before punctuation (optional - helps with formatting)
    .replace(/\s+([.,;:!?])/g, '$1')
    // Trim leading and trailing whitespace
    .trim();
};

export default function SubjectPracticePage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;

  const subject = useMemo(() => subjects.find((s) => s.id === subjectId), [subjectId]);

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<string>("all");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, number>>(new Map()); // questionId -> answerIndex
  const [showExplanations, setShowExplanations] = useState<Map<string, boolean>>(new Map()); // questionId -> show
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [showAttemptedAnswers, setShowAttemptedAnswers] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1.5);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; distance: number; baseZoom: number } | null>(null);

  // Load all questions for this subject and restore saved answers
  useEffect(() => {
    let isMounted = true;

    async function loadQuestions() {
      setIsLoading(true);
      try {
        const loaded = await getQuestionsBySubjectAsync(subjectId);
        if (isMounted) {
          setAllQuestions(loaded);
          
          // Load saved answers from localStorage
          try {
            const stored = localStorage.getItem("answeredQuestions");
            if (stored) {
              const existing: any[] = JSON.parse(stored);
              const answersMap = new Map<string, number>();
              
              existing.forEach((saved: any) => {
                if (loaded.some(q => q.id === saved.questionId)) {
                  answersMap.set(saved.questionId, saved.selectedAnswer);
                }
              });
              
              setSelectedAnswers(answersMap);
            }
          } catch (error) {
            console.error('Failed to load saved answers:', error);
          }
          
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

  // Get current question's selected answer
  const currentSelectedAnswer = useMemo(() => {
    if (!currentQuestion) return null;
    return selectedAnswers.get(currentQuestion.id) ?? null;
  }, [selectedAnswers, currentQuestion]);

  // Get if explanation should be shown for current question
  const showExplanation = useMemo(() => {
    if (!currentQuestion) return false;
    const isAttempted = selectedAnswers.has(currentQuestion.id);
    
    // Show explanation if:
    // 1. Show all answers is enabled
    // 2. Show attempted answers is enabled AND this question is attempted
    // 3. Explicitly shown for this question
    return showAllAnswers || 
           (showAttemptedAnswers && isAttempted) || 
           showExplanations.get(currentQuestion.id) || false;
  }, [showAllAnswers, showAttemptedAnswers, showExplanations, currentQuestion, selectedAnswers]);

  // Check if current question is attempted
  const isCurrentQuestionAttempted = useMemo(() => {
    if (!currentQuestion) return false;
    return selectedAnswers.has(currentQuestion.id);
  }, [currentQuestion, selectedAnswers]);

  const handleAnswerSelect = useCallback((optionIndex: number) => {
    if (!currentQuestion) return;
    
    // Update selected answer for current question
    const newSelectedAnswers = new Map(selectedAnswers);
    newSelectedAnswers.set(currentQuestion.id, optionIndex);
    setSelectedAnswers(newSelectedAnswers);

    // Auto-save to localStorage
    try {
      const answeredQuestion = {
        questionId: currentQuestion.id,
        subjectId: params.subjectId as string,
        chapterId: currentQuestion.chapterId,
        selectedAnswer: optionIndex,
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
    }, [currentQuestion, selectedAnswers, params.subjectId]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, filteredQuestions.length]);

  const handleQuestionJump = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
  }, []);

  // Image zoom handlers
  const handleImageClick = useCallback((imageUrl: string) => {
    setZoomedImage(imageUrl);
    setZoomLevel(1.5);
    setImagePosition({ x: 0, y: 0 });
  }, []);

  const handleCloseZoom = useCallback(() => {
    setZoomedImage(null);
    setZoomLevel(1.5);
    setImagePosition({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.25, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1.5);
    setImagePosition({ x: 0, y: 0 });
  }, []);

  // Mouse drag handlers for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomedImage) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  }, [zoomedImage, imagePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoomedImage) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, zoomedImage, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!zoomedImage) return;
    
    if (e.touches.length === 1) {
      // Single touch - start panning
      setIsDragging(true);
      setTouchStart({
        x: e.touches[0].clientX - imagePosition.x,
        y: e.touches[0].clientY - imagePosition.y,
        distance: 0,
        baseZoom: zoomLevel
      });
    } else if (e.touches.length === 2) {
      // Two touches - prepare for pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setTouchStart({
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
        distance,
        baseZoom: zoomLevel
      });
    }
  }, [zoomedImage, imagePosition, zoomLevel]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!zoomedImage || !touchStart) return;
    e.preventDefault();

    if (e.touches.length === 1 && touchStart.distance === 0) {
      // Single touch - panning
      setImagePosition({
        x: e.touches[0].clientX - touchStart.x,
        y: e.touches[0].clientY - touchStart.y
      });
    } else if (e.touches.length === 2 && touchStart.distance > 0) {
      // Two touches - pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const scale = distance / touchStart.distance;
      const newZoom = Math.max(0.5, Math.min(4, touchStart.baseZoom * scale));
      setZoomLevel(newZoom);
    }
  }, [zoomedImage, touchStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTouchStart(null);
  }, []);

  // Keyboard shortcuts for zoom modal
  useEffect(() => {
    if (!zoomedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseZoom();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomedImage, handleCloseZoom, handleZoomIn, handleZoomOut, handleResetZoom]);

  // Auto-scroll sidebar to keep current question visible
  useEffect(() => {
    if (filteredQuestions.length === 0) return;
    
    const sidebarElement = document.querySelector('[data-question-sidebar]');
    const currentButton = document.querySelector(`[data-question-number="${currentQuestionIndex}"]`);
    
    if (sidebarElement && currentButton) {
      const sidebarRect = sidebarElement.getBoundingClientRect();
      const buttonRect = currentButton.getBoundingClientRect();
      
      // Check if button is outside visible area
      if (buttonRect.top < sidebarRect.top || buttonRect.bottom > sidebarRect.bottom) {
        currentButton.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }
  }, [currentQuestionIndex, filteredQuestions.length]);

  const handleExamFilterChange = useCallback((exam: string) => {
    setSelectedExam(exam);
    setCurrentQuestionIndex(0);
    setShowAllAnswers(false);
    setShowAttemptedAnswers(false);
    setShowExplanations(new Map());
  }, []);

  // Check answer for current question
  const handleCheckCurrentAnswer = useCallback(() => {
    if (!currentQuestion) return;
    const newShowExplanations = new Map(showExplanations);
    newShowExplanations.set(currentQuestion.id, true);
    setShowExplanations(newShowExplanations);
    setShowAllAnswers(false);
    setShowAttemptedAnswers(false);
  }, [currentQuestion, showExplanations]);

  const isCorrect = useMemo(() => 
    currentQuestion && currentSelectedAnswer !== null 
      ? currentSelectedAnswer === currentQuestion.correctAnswer 
      : false, 
    [currentSelectedAnswer, currentQuestion]
  );

  // Calculate stats based on all answered questions
  const stats = useMemo(() => {
    let correct = 0;
    let total = 0;
    filteredQuestions.forEach((q) => {
      const selected = selectedAnswers.get(q.id);
      if (selected !== undefined) {
        total++;
        if (selected === q.correctAnswer) {
          correct++;
        }
      }
    });
    return {
      correct,
      total,
      accuracy: total > 0 ? ((correct / total) * 100).toFixed(1) : "0"
    };
  }, [filteredQuestions, selectedAnswers]);

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
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      {/* Question Navigator Sidebar - Desktop Only */}
      {filteredQuestions.length > 0 && (
        <div 
          data-question-sidebar
          className="hidden lg:block fixed left-4 top-24 z-40 w-16 bg-white border-2 border-purple-300 rounded-xl shadow-lg max-h-[calc(100vh-8rem)] overflow-y-auto"
        >
          <div className="p-2 sticky top-0 bg-white border-b border-purple-200 z-10">
            <div className="text-xs font-semibold text-purple-600 text-center">
              Q
            </div>
            <div className="text-[10px] text-gray-500 text-center mt-1">
              {filteredQuestions.length}
            </div>
          </div>
          <div className="p-2 space-y-1">
            {filteredQuestions.map((question, index) => {
              const isCurrent = index === currentQuestionIndex;
              const selectedAnswer = selectedAnswers.get(question.id);
              const isAnswered = selectedAnswer !== undefined;
              const isCorrect = isAnswered && selectedAnswer === question.correctAnswer;
              const isChecked = showExplanations.get(question.id) || false;
              const showAnswerState = (showAllAnswers || (showAttemptedAnswers && isAnswered) || isChecked) && isAnswered;

              let bgColor = "bg-gray-50 border-gray-300";
              let textColor = "text-gray-700";

              if (isCurrent) {
                bgColor = "bg-purple-600 border-purple-700";
                textColor = "text-white";
              } else if (showAnswerState) {
                if (isCorrect) {
                  bgColor = "bg-green-500 border-green-600";
                  textColor = "text-white";
                } else {
                  bgColor = "bg-red-500 border-red-600";
                  textColor = "text-white";
                }
              } else if (isAnswered) {
                bgColor = "bg-purple-100 border-purple-400";
                textColor = "text-purple-700";
              }

              return (
                <button
                  key={question.id}
                  data-question-number={index}
                  onClick={() => handleQuestionJump(index)}
                  className={`w-full h-10 rounded-lg border-2 font-semibold text-xs transition-all hover:scale-110 active:scale-95 ${bgColor} ${textColor}`}
                  title={`Question ${index + 1}${isAnswered ? ' (Answered)' : ''}${showAnswerState ? (isCorrect ? ' (Correct)' : ' (Incorrect)') : ''}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
        <div className="container mx-auto px-4 sm:px-6 lg:pl-24 py-6 pb-20">
          {/* Progress Bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <span className="text-sm font-medium">
                  Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                </span>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 font-medium">✓ {stats.correct}</span>
                  <span className="text-purple-600 font-medium">
                    Answered: {stats.total}/{filteredQuestions.length}
                  </span>
                  {stats.total > 0 && (
                    <span className="text-purple-600 font-medium">
                      {stats.accuracy}% Accuracy
                    </span>
                  )}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="mt-2 flex flex-wrap gap-2">
                {stats.total > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAttemptedAnswers(!showAttemptedAnswers);
                      setShowAllAnswers(false);
                    }}
                    className={showAttemptedAnswers ? "bg-purple-100 border-purple-400" : ""}
                  >
                    {showAttemptedAnswers ? "Hide Attempted Answers" : `Check Attempted (${stats.total})`}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAllAnswers(!showAllAnswers);
                    setShowAttemptedAnswers(false);
                  }}
                  className={showAllAnswers ? "bg-purple-100 border-purple-400" : ""}
                >
                  {showAllAnswers ? "Hide All Answers" : "Show All Answers"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              {currentQuestion.chapterId || "Question"}
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {currentQuestion.difficulty || "Medium"}
            </Badge>
          </div>
          <CardTitle className="text-lg sm:text-xl">
            <ReactMarkdown>{cleanText(currentQuestion.question)}</ReactMarkdown>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion.imageUrl && (
            <div className="mb-4 relative group flex justify-center">
              <div 
                className="cursor-zoom-in relative overflow-hidden rounded-lg border-2 border-purple-200 bg-gradient-to-br from-pink-50 to-purple-50 p-2 max-w-[300px] w-full"
                onClick={() => handleImageClick(currentQuestion.imageUrl!)}
              >
              <img
                src={currentQuestion.imageUrl}
                  alt="Question - Click to zoom"
                  className="w-full h-auto rounded-md shadow-md transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                    <ZoomIn className="w-4 h-4" />
                    Click to Zoom
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {currentQuestion.options.map((option: string, index: number) => {
              const isSelected = currentSelectedAnswer === index;
              const isCorrectAnswer = index === currentQuestion.correctAnswer;
              const showCorrect = showExplanation && isCorrectAnswer;
              const showIncorrect = showExplanation && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all touch-manipulation ${
                    showCorrect
                      ? "border-green-500 bg-green-50"
                      : showIncorrect
                      ? "border-red-500 bg-red-50"
                      : isSelected
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  } cursor-pointer active:scale-98`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">
                      <ReactMarkdown>{cleanText(option)}</ReactMarkdown>
                    </span>
                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />}
                    {showIncorrect && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Check Answer Button - Show when question is attempted but not checked */}
          {isCurrentQuestionAttempted && !showExplanation && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={handleCheckCurrentAnswer}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                size="sm"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Check Answer
              </Button>
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
              <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="flex-1"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex >= filteredQuestions.length - 1}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {currentQuestionIndex >= filteredQuestions.length - 1 ? (
                  "Quiz Complete! 🎉"
                ) : (
                  <>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
          </div>
        </CardContent>
      </Card>

        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={handleCloseZoom}
          onMouseUp={handleMouseUp}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center p-4"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseZoom}
              className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg transition-all"
              aria-label="Close zoom"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                disabled={zoomLevel <= 0.5}
                className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                disabled={zoomLevel >= 4}
                className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetZoom();
                }}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                aria-label="Reset zoom"
                title="Reset (0)"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Zoomed Image */}
            <div
              className="relative max-w-full max-h-full overflow-hidden"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ cursor: isDragging ? 'grabbing' : zoomLevel > 1.5 ? 'grab' : 'default' }}
            >
              <img
                src={zoomedImage}
                alt="Zoomed question image"
                className="max-w-none select-none touch-none"
                style={{
                  transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: (isDragging || touchStart !== null) ? 'none' : 'transform 0.1s ease-out',
                }}
                draggable={false}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white bg-opacity-90 rounded-lg px-4 py-2 text-sm text-gray-700">
              <div className="flex items-center gap-4 flex-wrap justify-center">
                <span className="hidden sm:inline">🖱️ Drag to pan</span>
                <span className="sm:hidden">👆 Drag to pan</span>
                <span className="hidden sm:inline">⌨️ +/- to zoom</span>
                <span className="sm:hidden">🤏 Pinch to zoom</span>
                <span className="hidden sm:inline">⌨️ 0 to reset</span>
                <span className="hidden sm:inline">⌨️ ESC to close</span>
                <span className="sm:hidden">Tap X to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

