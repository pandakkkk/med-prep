"use client";

import Link from "next/link";
import { subjects } from "@/lib/data/subjects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, BookOpen, BookMarked, BarChart3, Calendar, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { calculateOverallProgress } from "@/lib/utils/progress";
import { 
  getUserProfile, 
  getPersonalizedGreeting, 
  getPersonalizedMotivation,
  getDailyGoalMessage,
  getExamCountdown,
  getTodayQuestionCount 
} from "@/lib/utils/personalization";

export default function Home() {
  const [progress, setProgress] = useState<ReturnType<typeof calculateOverallProgress> | null>(null);
  const [profile, setProfile] = useState<ReturnType<typeof getUserProfile> | null>(null);
  const [todayCount, setTodayCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const realProgress = calculateOverallProgress();
    setProgress(realProgress);
    setProfile(getUserProfile());
    setTodayCount(getTodayQuestionCount());
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || !profile) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20">
        <div className="text-center py-12">
          <div className="text-4xl mb-4 animate-pulse">💕</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Pre-calculate total questions for each subject
  const subjectsWithTotals = subjects.map((subject) => {
    const totalQuestions = subject.chapters.reduce((sum, chapter) => sum + chapter.totalQuestions, 0);
    const subjectProgress = progress?.subjectsProgress.find(sp => sp.subjectId === subject.id);
    
    return {
      ...subject,
      totalQuestions,
      attempted: subjectProgress?.attempted || 0,
      accuracy: subjectProgress?.accuracy || 0,
      percentage: subjectProgress?.percentage || 0
    };
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20">
      <div className="mb-8 sm:mb-12 text-center">
        <div className="mb-4 flex justify-center items-center gap-3">
          <span className="text-4xl sm:text-5xl animate-pulse">💕</span>
          <span className="text-5xl sm:text-6xl">✨</span>
          <span className="text-4xl sm:text-5xl animate-pulse" style={{animationDelay: '0.3s'}}>💕</span>
        </div>
        <h1 className="mb-3 sm:mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight px-2">
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            {getPersonalizedGreeting(profile.name)}
          </span>
        </h1>
        <p className="mx-auto max-w-3xl text-xl sm:text-2xl font-semibold text-pink-600 px-4 mb-4">
          {profile.customMessage || "Your Dreams, My Endless Support 🌹"}
        </p>
        <div className="mx-auto max-w-3xl bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-pink-200 relative overflow-hidden">
          <div className="absolute top-2 right-2 text-2xl sm:text-3xl animate-pulse">💝</div>
          <div className="absolute bottom-2 left-2 text-2xl sm:text-3xl animate-pulse" style={{animationDelay: '0.7s'}}>💝</div>
          
          {/* Daily Goal Progress */}
          {progress && profile.dailyGoal && profile.dailyGoal > 0 ? (
            <div className="mb-4 p-4 rounded-xl bg-white/50 backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-800">Today's Progress</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{todayCount}/{profile.dailyGoal}</span>
              </div>
              <Progress value={(todayCount / profile.dailyGoal) * 100} className="h-2" />
              <p className="text-xs text-gray-600 mt-2">
                {getDailyGoalMessage(todayCount, profile.dailyGoal, profile.name)}
              </p>
            </div>
          ) : (
            <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 border-2 border-pink-300">
              <div className="flex flex-col items-center gap-3 text-center">
                <Target className="w-8 h-8 text-pink-600" />
                <p className="text-sm font-semibold text-gray-800">
                  Set your daily goal to track your progress! 🎯
                </p>
                <Link 
                  href="/profile" 
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95"
                >
                  Set Up Your Goal ✨
                </Link>
              </div>
            </div>
          )}

          {/* Exam Countdown */}
          {profile.targetExamDate && getExamCountdown(profile.targetExamDate) && (
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-semibold text-orange-800">
                  {getExamCountdown(profile.targetExamDate)}
                </span>
              </div>
            </div>
          )}

          <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed mb-4 font-medium">
            {progress ? getPersonalizedMotivation(
              progress.accuracy, 
              progress.streak, 
              progress.attempted,
              profile.name
            ) : `Every moment you spend here is a step towards your beautiful dream, ${profile.name}! 💪✨`}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-pink-700 italic font-medium">
            You're not just preparing for an exam - you're building the foundation of an amazing career 
            that will touch countless lives. And I'll be right here, cheering for you every single day! 🌟
          </p>
          <div className="mt-4 pt-4 border-t-2 border-pink-200">
            <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-2">
              <span className="text-lg">❤️</span>
              <span>Crafted with endless love and care, just for {profile.name}</span>
              <span className="text-lg">❤️</span>
            </p>
          </div>
        </div>
      </div>

      {/* Syllabus Quick Access */}
      <Link href="/syllabus" className="block mb-8">
        <Card className="group transition-all hover:shadow-2xl hover:scale-[1.02] cursor-pointer border-2 border-purple-300 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 hover:from-purple-100 hover:via-pink-100 hover:to-purple-100 touch-manipulation active:scale-[0.98]">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <BookMarked className="w-8 h-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  Complete NEET PG Syllabus
                </h3>
                <p className="text-sm text-gray-600">
                  Explore all 19 subjects with detailed topics & subtopics 📚
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:text-pink-600">
              <span>View Syllabus</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Overall Progress Summary */}
      {progress && progress.attempted > 0 && (
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-2 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{progress.attempted}</div>
              <div className="text-xs text-gray-600">Questions Attempted</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{progress.accuracy.toFixed(0)}%</div>
              <div className="text-xs text-gray-600">Accuracy</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{progress.streak}</div>
              <div className="text-xs text-gray-600">Day Streak 🔥</div>
            </CardContent>
          </Card>
          <Link href="/stats" className="block">
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all h-full cursor-pointer">
              <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                <BarChart3 className="h-6 w-6 text-purple-600 mb-1" />
                <div className="text-xs text-purple-600 font-medium">View Stats</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      <div className="mb-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Choose Your Subject 📖
        </h2>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {subjectsWithTotals.map((subject) => (
            <Link key={subject.id} href={`/subjects/${subject.id}`} className="block">
              <Card className="group h-full transition-all active:scale-95 hover:shadow-xl sm:hover:scale-105 cursor-pointer border-2 border-pink-200 hover:border-purple-400 touch-manipulation bg-gradient-to-br from-white via-pink-50 to-purple-50 hover:from-pink-50 hover:via-purple-50 hover:to-pink-100">
                <CardHeader className="p-4 sm:p-6">
                  <div className="mb-2 sm:mb-3 flex items-start justify-between gap-2">
                    <div className={`rounded-xl ${subject.color} p-2.5 sm:p-3 text-2xl sm:text-3xl flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow`}>
                      {subject.icon}
                    </div>
                    <Badge className="text-xs whitespace-nowrap bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      {subject.chapters.length} chapters
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all text-lg sm:text-xl font-bold">
                    {subject.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {subject.totalQuestions} MCQs available
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  {subject.attempted > 0 ? (
                    <>
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">{subject.attempted} / {subject.totalQuestions} attempted</span>
                          <span className="font-semibold text-green-600">{subject.accuracy.toFixed(0)}%</span>
                        </div>
                        <Progress value={subject.percentage} className="h-1.5" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-600 font-medium text-xs">Continue</span>
                        <ArrowRight className="h-4 w-4 text-purple-600 group-hover:text-pink-600 transition-all group-hover:translate-x-1" />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-purple-600 font-medium">
                        <BookOpen className="mr-1 h-4 w-4" />
                        <span className="hidden sm:inline">Start Learning</span>
                        <span className="sm:hidden">Start</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-purple-600 group-hover:text-pink-600 transition-all group-hover:translate-x-1" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
        ))}
      </div>

      <div className="mt-8 sm:mt-12 rounded-2xl border-4 border-pink-300 bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 p-6 sm:p-10 text-center mx-2 sm:mx-0 relative overflow-hidden shadow-xl">
        <div className="absolute top-3 right-3 text-3xl animate-bounce">💝</div>
        <div className="absolute top-3 left-3 text-3xl animate-bounce" style={{animationDelay: '0.3s'}}>🌹</div>
        <div className="absolute bottom-3 right-3 text-3xl animate-bounce" style={{animationDelay: '0.6s'}}>✨</div>
        <div className="absolute bottom-3 left-3 text-3xl animate-bounce" style={{animationDelay: '0.9s'}}>💫</div>
        
        <div className="text-4xl sm:text-5xl mb-4">💕</div>
        <h2 className="mb-3 text-2xl sm:text-3xl font-bold text-rose-700">Ready to Shine Today, {profile.name}? 💪</h2>
        <p className="text-base sm:text-lg text-gray-800 px-2 mb-4 font-medium max-w-2xl mx-auto leading-relaxed">
          Choose any subject above and let's conquer it together! 
          Every question you answer, every chapter you master, brings you closer to your dreams. 
          I'm here with you, always! 🎯
        </p>
        <div className="bg-white/60 rounded-xl p-4 max-w-2xl mx-auto mb-4">
          <p className="text-sm sm:text-base text-pink-700 font-semibold italic">
            "Success is not just about passing an exam - it's about the incredible journey we take to get there. 
            And {profile.name}, your journey is going to be extraordinary!" 🌟
          </p>
        </div>
        <p className="text-xs sm:text-sm text-rose-600 font-bold">
          You're stronger than you think, smarter than you know, and loved more than you'll ever imagine! 💖❤️
        </p>
      </div>
    </div>
  );
}

