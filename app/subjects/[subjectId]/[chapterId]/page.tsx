"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { subjects } from "@/lib/data/subjects";
import { sampleQuestions, getQuestionsByChapter } from "@/lib/data/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, XCircle, BookOpen, Trophy, ArrowRight, List, GraduationCap } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;
  const chapterId = params.chapterId as string;

  const subject = useMemo(() => subjects.find((s) => s.id === subjectId), [subjectId]);
  const chapter = useMemo(() => subject?.chapters.find((c) => c.id === chapterId), [subject, chapterId]);

  const [questions] = useState(() => getQuestionsByChapter(subjectId, chapterId));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<"practice" | "reviewAll">("practice");
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState("");

  // All hooks must be called before any conditional returns
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const progress = useMemo(() => ((currentQuestionIndex + 1) / questions.length) * 100, [currentQuestionIndex, questions.length]);
  const totalAttempted = useMemo(() => score.correct + score.incorrect, [score.correct, score.incorrect]);

  const handleAnswerSelect = useCallback((optionIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(optionIndex);
  }, [showExplanation]);

  const encouragements = useMemo(() => ({
    correct: [
      "Excellent, Preeti! That's the correct answer! 🎯",
      "Perfect! You're understanding these concepts well! ✓",
      "Correct! Your preparation is showing great results! 📚",
      "Well done! Keep up this consistent effort! ⭐",
      "That's right! Your hard work is paying off! 💪",
      "Spot on! You've got a strong grasp of this topic! ✨",
      "Excellent work! Moving in the right direction! 🎓",
      "Correct answer! Your focus is impressive! 👍"
    ],
    incorrect: [
      "Not quite right, but that's okay! Review the explanation carefully. 📖",
      "Incorrect this time. Let's learn from this - check the detailed explanation! 💡",
      "That's not the answer, but every mistake is a learning opportunity! 📝",
      "Wrong answer, but don't worry - understanding the explanation is key! 🔍",
      "Incorrect. Take time to review the concept - you'll get it next time! ✓",
      "Not correct, Preeti. Read through the explanation to strengthen your understanding! 📚",
      "That's incorrect. Focus on the explanation - it will help you master this! 🎯",
      "Wrong answer. Review carefully and keep practicing! 💪"
    ]
  }), []);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer === null || !currentQuestion) return;

    setShowExplanation(true);
    setAnsweredQuestions(new Set(answeredQuestions).add(currentQuestionIndex));

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Save to localStorage for review page
    try {
      const answeredQuestion = {
        questionId: currentQuestion.id,
        subjectId: params.subjectId,
        chapterId: params.chapterId,
        selectedAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        timestamp: Date.now(),
      };

      const stored = localStorage.getItem("answeredQuestions");
      const existing = stored ? JSON.parse(stored) : [];
      
      // Check if this question was already answered, update if so
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
  }, [selectedAnswer, currentQuestion, answeredQuestions, currentQuestionIndex, score, params.subjectId, params.chapterId, encouragements]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [currentQuestionIndex, questions.length]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [currentQuestionIndex]);

  const handleAnswerSelection = useCallback((questionIndex: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  }, []);

  const handleCheckAnswers = useCallback(() => {
    // Only check the attempted questions
    const attemptedQuestions = Object.keys(selectedAnswers).map(Number);
    
    if (attemptedQuestions.length === 0) return;
    
    setShowResults(true);
    
    // Calculate score only for attempted questions
    let correct = 0;
    let incorrect = 0;
    
    attemptedQuestions.forEach((index) => {
      const question = questions[index];
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
      
      // Save to localStorage
      try {
        const answeredQuestion = {
          questionId: question.id,
          subjectId: params.subjectId,
          chapterId: params.chapterId,
          selectedAnswer: selectedAnswers[index],
          correctAnswer: question.correctAnswer,
          timestamp: Date.now(),
        };

        const stored = localStorage.getItem("answeredQuestions");
        const existing = stored ? JSON.parse(stored) : [];
        
        const existingIndex = existing.findIndex(
          (q: any) => q.questionId === question.id
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
    });
    
    setScore({ correct, incorrect });
    
    // Mark these questions as checked
    setCheckedQuestions(prev => {
      const newChecked = new Set(prev);
      attemptedQuestions.forEach(index => newChecked.add(index));
      return newChecked;
    });
    
    // Scroll to top to see results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedAnswers, questions, params.subjectId, params.chapterId]);

  const handleResetQuiz = useCallback(() => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore({ correct: 0, incorrect: 0 });
    setCheckedQuestions(new Set());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToQuestion = useCallback((index: number) => {
    const element = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const isCorrect = useMemo(() => 
    currentQuestion ? selectedAnswer === currentQuestion.correctAnswer : false, 
    [selectedAnswer, currentQuestion]
  );
  const accuracy = useMemo(() => totalAttempted > 0 ? ((score.correct / totalAttempted) * 100).toFixed(1) : 0, [score.correct, totalAttempted]);

  // Conditional returns after all hooks
  if (!subject || !chapter) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
          <Button asChild>
            <Link href="/">Go back to subjects</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/subjects/${subjectId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chapters
          </Link>
        </Button>
        <Card className="text-center p-12">
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
            <CardDescription>
              Questions for this chapter will be added soon. Please check back later!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="text-6xl sm:text-8xl animate-bounce">
            🎉✨💖🌟
          </div>
        </div>
      )}

      {/* Question Navigator Sidebar - Hidden on mobile, visible on lg+ */}
      {viewMode === "practice" && (
        <div className="hidden lg:block fixed left-4 top-24 w-16 h-[calc(100vh-120px)] z-40">
          <div className="bg-white border-2 border-purple-200 rounded-xl p-2 h-full overflow-y-auto shadow-lg">
            <div className="text-xs font-semibold text-center mb-2 text-purple-600 sticky top-0 bg-white pb-1">
              Questions
            </div>
            <div className="space-y-1.5">
              {questions.map((_, index) => {
                const isAnswered = selectedAnswers[index] !== undefined;
                const isQuestionChecked = checkedQuestions.has(index);
                const isCorrect = selectedAnswers[index] === questions[index].correctAnswer;
                
                return (
                  <button
                    key={index}
                    onClick={() => scrollToQuestion(index)}
                    className={`w-full h-10 rounded-lg text-sm font-semibold transition-all hover:scale-110 ${
                      isAnswered
                        ? isQuestionChecked && isCorrect
                          ? 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md'
                          : isQuestionChecked
                          ? 'bg-gradient-to-br from-red-400 to-red-500 text-white shadow-md'
                          : 'bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-purple-50 hover:border-purple-300'
                    }`}
                    title={`Question ${index + 1}${isAnswered ? ' (Answered)' : ''}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:pl-24 py-4 sm:py-8 max-w-5xl pb-20 relative">
        <div className="mb-4 sm:mb-6">
          <Link 
            href={`/subjects/${subjectId}`}
            className="inline-flex items-center justify-center h-10 px-4 mb-3 sm:mb-4 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors touch-manipulation active:scale-95"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chapters
          </Link>

          <div className="mb-4 sm:mb-6">
          <div className="flex items-start sm:items-center justify-between mb-3 gap-2">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{chapter.name}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">{subject.name}</p>
            </div>
            <Badge className="text-xs sm:text-sm flex-shrink-0 whitespace-nowrap">
              {viewMode === "practice" ? `${currentQuestionIndex + 1}/` : ""}{questions.length}
            </Badge>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode("practice")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all touch-manipulation active:scale-95 ${
                viewMode === "practice"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "bg-white text-purple-600 border-2 border-purple-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Practice Mode
            </button>
            <button
              onClick={() => setViewMode("reviewAll")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all touch-manipulation active:scale-95 ${
                viewMode === "reviewAll"
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-pink-600 border-2 border-pink-200 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-300"
              }`}
            >
              <List className="w-4 h-4" />
              Review All
            </button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {viewMode === "practice" && showResults && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="pt-4 sm:pt-6 pb-3 sm:pb-6">
                <div className="text-center">
                  <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto mb-1 sm:mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{score.correct}</div>
                  <div className="text-[10px] sm:text-xs text-green-700 font-medium">Correct</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="pt-4 sm:pt-6 pb-3 sm:pb-6">
                <div className="text-center">
                  <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 mx-auto mb-1 sm:mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">{score.incorrect}</div>
                  <div className="text-[10px] sm:text-xs text-purple-700 font-medium">Incorrect</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
              <CardContent className="pt-4 sm:pt-6 pb-3 sm:pb-6">
                <div className="text-center">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 mx-auto mb-1 sm:mb-2" />
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{Object.keys(selectedAnswers).length > 0 ? ((score.correct / Object.keys(selectedAnswers).length) * 100).toFixed(1) : 0}%</div>
                  <div className="text-[10px] sm:text-xs text-pink-700 font-medium">Accuracy</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* PRACTICE MODE - All questions together */}
      {viewMode === "practice" && (
        <div className="space-y-4">
          {questions.map((question, qIndex) => {
            const userAnswer = selectedAnswers[qIndex];
            const isAnswered = userAnswer !== undefined;
            const isChecked = checkedQuestions.has(qIndex);
            const isCorrectAnswer = isAnswered && userAnswer === question.correctAnswer;
            const isWrongAnswer = isAnswered && isChecked && userAnswer !== question.correctAnswer;

            return (
              <Card key={question.id} id={`question-${qIndex}`} className="mb-4 scroll-mt-24">
                <CardContent className="p-4 sm:p-6">
                  {/* Question Header */}
                  <div className="flex items-start gap-2 mb-4">
                    <Badge className="text-xs flex-shrink-0 bg-purple-100 text-purple-700 border border-purple-300 font-semibold">
                      Q{qIndex + 1}
                    </Badge>
                    <Badge className="text-xs flex-shrink-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
                      {question.difficulty}
                    </Badge>
                    {question.year && (
                      <Badge className="text-xs bg-pink-100 text-pink-700 border border-pink-300">
                        NEET PG {question.year}
                      </Badge>
                    )}
                  </div>

                  {/* Question Text */}
                  <h3 className="text-sm sm:text-base font-medium text-gray-800 mb-4 leading-relaxed">
                    {question.question}
                  </h3>

                  {/* Question Image (if available) */}
                  {question.imageUrl && (
                    <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
                      <a 
                        href={question.imageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block cursor-zoom-in"
                      >
                        <img 
                          src={question.imageUrl} 
                          alt="Question diagram" 
                          className="w-full h-auto rounded-md shadow-sm hover:shadow-md transition-all hover:scale-[1.02] mx-auto"
                          style={{ maxWidth: '400px' }}
                          loading="lazy"
                        />
                      </a>
                    </div>
                  )}

                  {/* Options */}
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = userAnswer === optionIndex;
                      const isCorrectOption = question.correctAnswer === optionIndex;
                      
                      let bgColor = "bg-white hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50";
                      let borderColor = "border-pink-200 hover:border-purple-300";
                      let textColor = "text-gray-700";
                      let isDisabled = false;

                      // Only show results for checked questions
                      if (isChecked && isAnswered) {
                        isDisabled = true;
                        if (isCorrectOption) {
                          bgColor = "bg-green-50";
                          borderColor = "border-green-400";
                          textColor = "text-green-800";
                        } else if (isSelected && !isCorrectOption) {
                          bgColor = "bg-orange-50";
                          borderColor = "border-orange-400";
                          textColor = "text-orange-800";
                        }
                      } else if (isSelected) {
                        bgColor = "bg-gradient-to-r from-purple-100 to-pink-100";
                        borderColor = "border-purple-400";
                        textColor = "text-purple-800 font-semibold";
                      }

                      return (
                        <button
                          key={optionIndex}
                          onClick={() => !isDisabled && handleAnswerSelection(qIndex, optionIndex)}
                          disabled={isDisabled}
                          className={`w-full ${bgColor} ${borderColor} ${textColor} border-2 rounded-lg p-3 sm:p-4 text-left text-xs sm:text-sm transition-all ${
                            !isDisabled ? "touch-manipulation active:scale-[0.99] cursor-pointer" : "cursor-default"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-semibold flex-shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <span className="flex-1">{option}</span>
                            {isChecked && isCorrectOption && (
                              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-green-600" />
                            )}
                            {isChecked && isSelected && !isCorrectOption && (
                              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-orange-600" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Show explanation after checking answers */}
                  {isChecked && isAnswered && (
                    <div className={`mt-4 p-3 sm:p-4 rounded-lg border-2 ${
                      isCorrectAnswer 
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-500" 
                        : "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-400"
                    }`}>
                      <div className="flex items-center mb-2">
                        {isCorrectAnswer ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2 flex-shrink-0" />
                            <span className="font-bold text-green-700 text-xs sm:text-sm">
                              Correct! Great job! 🎉
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-2 flex-shrink-0" />
                            <span className="font-bold text-orange-700 text-xs sm:text-sm">
                              Not quite right, but keep learning! 💪
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="text-xs sm:text-sm leading-relaxed">
                        <ReactMarkdown
                          components={{
                            p: ({node, ...props}) => <p className="mb-3 whitespace-pre-line" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-pink-700" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />
                          }}
                        >
                          {question.explanation}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Bottom Action Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4 mt-6 shadow-lg">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleCheckAnswers}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-base sm:text-lg py-6 touch-manipulation active:scale-[0.99]"
                  size="lg"
                >
                  {showResults ? "Check More Answers" : "Check Answers"} ({Object.keys(selectedAnswers).length}/{questions.length})
                </Button>
                
                {showResults && (
                  <>
                    <Button
                      onClick={handleResetQuiz}
                      variant="outline"
                      className="flex-1 py-6 text-base touch-manipulation active:scale-[0.99]"
                      size="lg"
                    >
                      Reset All
                    </Button>
                    <Link href={`/subjects/${subjectId}`} className="flex-1">
                      <Button
                        variant="default"
                        className="w-full py-6 text-base touch-manipulation active:scale-[0.99]"
                        size="lg"
                      >
                        Back to Chapters
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Romantic Encouragement Message */}
          {showResults && score.correct + score.incorrect > 0 && (
            <div className="bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 rounded-2xl p-6 sm:p-8 text-center mb-6 shadow-lg border-2 border-pink-200 relative overflow-hidden">
              <div className="absolute top-2 right-2 text-xl animate-bounce">💝</div>
              <div className="absolute bottom-2 left-2 text-xl animate-bounce" style={{animationDelay: '0.5s'}}>✨</div>
              <div className="text-4xl sm:text-5xl mb-3">💖</div>
              <h3 className="text-xl sm:text-2xl font-bold text-rose-700 mb-3">
                {score.correct === score.correct + score.incorrect 
                  ? "Perfect Score, My Love! You're absolutely brilliant! 🌟💕" 
                  : score.correct >= (score.correct + score.incorrect) / 2
                  ? "Wonderful Work, Darling! You're doing amazingly! ✨❤️"
                  : "Beautiful Effort, Preeti! Every step makes you stronger! 💪💖"}
              </h3>
              <p className="text-sm sm:text-base text-gray-800 font-medium mb-2">
                You've checked {score.correct + score.incorrect} questions and got {score.correct} correct!
                {score.correct + score.incorrect < questions.length && (
                  <span className="block mt-2 text-pink-700 font-semibold text-base">
                    💫 {questions.length - (score.correct + score.incorrect)} questions remaining - you're doing great, keep going! 🎯
                  </span>
                )}
              </p>
              <p className="text-xs sm:text-sm text-rose-600 italic font-medium mt-3">
                "I'm so proud of your dedication and hard work! You're going to achieve amazing things!" 🌹
              </p>
            </div>
          )}
        </div>
      )}

      {/* OLD PRACTICE MODE CODE - REMOVE THIS */}
      {false && (
        <>
          <Card className="mb-4 sm:mb-6">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base sm:text-xl mb-2 sm:mb-3 leading-snug">
                {currentQuestion.question}
              </CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Badge variant={
                  currentQuestion.difficulty === "easy" ? "secondary" :
                  currentQuestion.difficulty === "medium" ? "default" : "destructive"
                } className="text-xs">
                  {currentQuestion.difficulty}
                </Badge>
                {currentQuestion.year && (
                  <Badge variant="outline" className="text-xs">
                    NEET PG {currentQuestion.year}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-2 sm:space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === currentQuestion.correctAnswer;
              
              let buttonClass = "w-full justify-start text-left h-auto py-3 sm:py-4 px-3 sm:px-4 touch-manipulation active:scale-98 ";
              
              if (showExplanation) {
                if (isCorrectOption) {
                  buttonClass += "border-green-500 bg-green-50 hover:bg-green-50 ";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "border-red-500 bg-red-50 hover:bg-red-50 ";
                }
              } else if (isSelected) {
                buttonClass += "border-primary bg-primary/10 ";
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={buttonClass}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                >
                  <div className="flex items-start sm:items-center w-full gap-2 sm:gap-3">
                    <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex-shrink-0 text-xs sm:text-sm mt-0.5 sm:mt-0">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 text-sm sm:text-base leading-snug">{option}</span>
                    {showExplanation && isCorrectOption && (
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                    )}
                    {showExplanation && isSelected && !isCorrect && (
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          {!showExplanation && (
            <Button
              className="w-full mt-4 sm:mt-6 text-base sm:text-lg"
              size="lg"
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          )}

          {showExplanation && (
            <div className="mt-4 sm:mt-6">
              <div className={`p-3 sm:p-4 rounded-lg border-2 ${
                isCorrect ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-500" : "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-400"
              }`}>
                <div className="flex items-center mb-2">
                  {isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-2 flex-shrink-0" />
                  )}
                  <span className={`font-semibold text-sm sm:text-base ${
                    isCorrect ? "text-green-800" : "text-orange-800"
                  }`}>
                    {encouragementMessage}
                  </span>
                </div>
                <div className="text-xs sm:text-sm leading-relaxed mb-2">
                  <ReactMarkdown 
                    components={{
                      p: ({node, ...props}) => <p className="mb-3 whitespace-pre-line" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-pink-700" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />
                    }}
                  >
                    {currentQuestion.explanation}
                  </ReactMarkdown>
                </div>
                {isCorrect && (
                  <div className="text-xs text-green-700 font-medium italic mt-2 flex items-center gap-1">
                    <span>💖</span> Keep going! You're doing amazing!
                  </div>
                )}
              </div>

              <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex-1 text-sm sm:text-base"
                  size="lg"
                >
                  <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button onClick={handleNextQuestion} className="flex-1 text-sm sm:text-base" size="lg">
                    <span className="hidden sm:inline">Next Question</span>
                    <span className="sm:hidden">Next</span>
                    <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Link href={`/subjects/${subjectId}`} className="flex-1">
                    <Button
                      variant="default"
                      className="w-full text-sm sm:text-base"
                      size="lg"
                    >
                      Back to Chapters
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
        </>
      )}

      {/* REVIEW ALL MODE - All questions with answers on the right */}
      {viewMode === "reviewAll" && (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-2 mb-4">
                  <Badge className="text-xs flex-shrink-0 bg-purple-100 text-purple-700 border border-purple-300 font-semibold">
                    Q{index + 1}
                  </Badge>
                  <Badge className="text-xs flex-shrink-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
                    {question.difficulty}
                  </Badge>
                </div>

                {/* Question and Answers in 2-column layout on tablet+ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Question */}
                  <div>
                    <h3 className="text-sm sm:text-base font-medium text-gray-800 mb-4 leading-relaxed">
                      {question.question}
                    </h3>
                    
                    {/* Question Image (if available) */}
                    {question.imageUrl && (
                      <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
                        <a 
                          href={question.imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block cursor-zoom-in"
                        >
                          <img 
                            src={question.imageUrl} 
                            alt="Question diagram" 
                            className="w-full h-auto rounded-md shadow-sm hover:shadow-md transition-all hover:scale-[1.02] mx-auto"
                            style={{ maxWidth: '400px' }}
                            loading="lazy"
                          />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right: Answer Options */}
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = optionIndex === question.correctAnswer;

                      return (
                        <div
                          key={optionIndex}
                          className={`border-2 rounded-lg p-3 text-xs sm:text-sm transition-all ${
                            isCorrect
                              ? "bg-green-50 border-green-300 text-green-800"
                              : "bg-gray-50 border-gray-200 text-gray-700"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-semibold flex-shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <span className="flex-1">{option}</span>
                            {isCorrect && (
                              <span className="flex-shrink-0 font-bold text-base">
                                ✓
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* View Explanation Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setViewMode("practice");
                      setCurrentQuestionIndex(index);
                      setSelectedAnswer(null);
                      setShowExplanation(false);
                    }}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors touch-manipulation active:scale-95"
                  >
                    📖 View Detailed Explanation →
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Bottom Message */}
          <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 rounded-xl p-6 text-center mt-6">
            <div className="text-3xl mb-2">💖</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {questions.length} Questions Ready for You!
            </h3>
            <p className="text-sm text-gray-700">
              Switch to Practice Mode to test yourself with detailed explanations! ✨
            </p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

