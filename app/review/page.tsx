"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, XCircle } from "lucide-react";
import { subjects } from "@/lib/data/subjects";
import { getAllQuestions } from "@/lib/data/questions";

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

interface AnsweredQuestion {
  questionId: string;
  subjectId: string;
  chapterId: string;
  selectedAnswer: number;
  correctAnswer: number;
  timestamp: number;
}

export default function ReviewPage() {
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect">("all");

  // Only load all questions once, and memoize it
  const allQuestions = useMemo(() => getAllQuestions(), []);

  useEffect(() => {
    // Load answered questions from localStorage
    const stored = localStorage.getItem("answeredQuestions");
    if (stored) {
      const parsed: AnsweredQuestion[] = JSON.parse(stored);
      // Sort by timestamp (most recent first)
      parsed.sort((a, b) => b.timestamp - a.timestamp);
      setAnsweredQuestions(parsed);
    }
  }, []);

  // Memoize question lookup for better performance
  const questionsMap = useMemo(() => {
    const map = new Map();
    allQuestions.forEach(q => map.set(q.id, q));
    return map;
  }, [allQuestions]);

  const getQuestionDetails = (questionId: string) => {
    return questionsMap.get(questionId);
  };

  // Memoize subject name lookup
  const subjectsMap = useMemo(() => {
    const map = new Map();
    subjects.forEach(s => map.set(s.id, s.name));
    return map;
  }, []);

  const getSubjectName = (subjectId: string) => {
    return subjectsMap.get(subjectId) || subjectId;
  };

  const filteredQuestions = useMemo(() => 
    answeredQuestions.filter((aq) => {
      if (filter === "correct") return aq.selectedAnswer === aq.correctAnswer;
      if (filter === "incorrect") return aq.selectedAnswer !== aq.correctAnswer;
      return true;
    }), [answeredQuestions, filter]
  );

  const { correctCount, incorrectCount } = useMemo(() => {
    const correct = answeredQuestions.filter(
      (aq) => aq.selectedAnswer === aq.correctAnswer
    ).length;
    return {
      correctCount: correct,
      incorrectCount: answeredQuestions.length - correct
    };
  }, [answeredQuestions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="p-2 hover:bg-pink-50 rounded-lg transition-colors touch-manipulation active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 text-pink-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                📝 Your Answer Review
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                All your answered questions in one place! 💖
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-purple-600">
                {answeredQuestions.length}
              </div>
              <div className="text-xs text-purple-700">Total</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {correctCount}
              </div>
              <div className="text-xs text-green-700">Correct</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-orange-600">
                {incorrectCount}
              </div>
              <div className="text-xs text-orange-700">Review</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation active:scale-95 ${
                filter === "all"
                  ? "bg-pink-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              All ({answeredQuestions.length})
            </button>
            <button
              onClick={() => setFilter("correct")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation active:scale-95 ${
                filter === "correct"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              ✓ Correct ({correctCount})
            </button>
            <button
              onClick={() => setFilter("incorrect")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation active:scale-95 ${
                filter === "incorrect"
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              ↻ Review ({incorrectCount})
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="container mx-auto px-4 py-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {answeredQuestions.length === 0
                ? "No questions answered yet!"
                : "No questions in this filter"}
            </h2>
            <p className="text-gray-600 mb-6">
              {answeredQuestions.length === 0
                ? "Start practicing to see your progress here 💖"
                : "Try a different filter to see your questions"}
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Start Practicing →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((aq, index) => {
              const question = getQuestionDetails(aq.questionId);
              if (!question) return null;

              const isCorrect = aq.selectedAnswer === aq.correctAnswer;

              return (
                <div
                  key={`${aq.questionId}-${aq.timestamp}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="p-4 sm:p-6">
                    {/* Header with subject and result */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {getSubjectName(aq.subjectId)}
                          </span>
                          <span className="text-xs text-gray-400">
                            Q{index + 1}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          isCorrect
                            ? "bg-green-50 text-green-700"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Review
                          </>
                        )}
                      </div>
                    </div>

                    {/* Question and Answers in vertical layout */}
                    <div className="space-y-4">
                      {/* Question */}
                      <div>
                        <h3 className="text-sm sm:text-base font-medium text-gray-800 mb-4 leading-relaxed">
                          {cleanText(question.question)}
                        </h3>
                      </div>

                      {/* Answer Options */}
                      <div className="space-y-2">
                        {question.options.map((option: string, optionIndex: number) => {
                          const isSelected = optionIndex === aq.selectedAnswer;
                          const isCorrectOption = optionIndex === aq.correctAnswer;

                          let bgColor = "bg-gray-50";
                          let borderColor = "border-gray-200";
                          let textColor = "text-gray-700";
                          let icon = "";

                          if (isCorrectOption) {
                            bgColor = "bg-green-50";
                            borderColor = "border-green-300";
                            textColor = "text-green-800";
                            icon = "✓";
                          }

                          if (isSelected && !isCorrect && !isCorrectOption) {
                            bgColor = "bg-orange-50";
                            borderColor = "border-orange-300";
                            textColor = "text-orange-800";
                            icon = "✗";
                          }

                          return (
                            <div
                              key={optionIndex}
                              className={`${bgColor} ${borderColor} ${textColor} border-2 rounded-lg p-3 text-xs sm:text-sm transition-all ${
                                isSelected ? "shadow-sm" : ""
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <span className="font-semibold flex-shrink-0 mt-0.5">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span className="flex-1">{cleanText(option)}</span>
                                {icon && (
                                  <span className="flex-shrink-0 font-bold text-base">
                                    {icon}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Link to review explanation */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        href={`/subjects/${aq.subjectId}/practice`}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors touch-manipulation active:scale-95"
                      >
                        📖 Practice More Questions →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Motivational Message */}
      {answeredQuestions.length > 0 && (
        <div className="container mx-auto px-4 mt-8">
          <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">💖</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Keep Going, Preeti! ✨
            </h3>
            <p className="text-sm text-gray-700">
              You've answered {answeredQuestions.length} questions! Every
              question brings you closer to your goal. So proud of you! 🌟
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

