import { notFound } from "next/navigation";
import Link from "next/link";
import { subjects } from "@/lib/data/subjects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, ArrowRight, BookMarked } from "lucide-react";

interface SubjectPageProps {
  params: {
    subjectId: string;
  };
}

export function generateStaticParams() {
  return subjects.map((subject) => ({
    subjectId: subject.id,
  }));
}

export default function SubjectPage({ params }: SubjectPageProps) {
  const subject = subjects.find((s) => s.id === params.subjectId);

  if (!subject) {
    notFound();
  }

  const totalQuestions = subject.chapters.reduce(
    (sum, chapter) => sum + chapter.totalQuestions,
    0
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20">
      <div className="mb-6 sm:mb-8">
        <Link 
          href="/"
          className="inline-flex items-center justify-center h-10 px-4 mb-3 sm:mb-4 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors touch-manipulation active:scale-95"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Subjects
        </Link>

        <div className="flex items-start gap-3 sm:gap-4">
          <div className={`rounded-xl sm:rounded-2xl ${subject.color} p-3 sm:p-4 text-3xl sm:text-5xl flex-shrink-0`}>
            {subject.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="mb-2 text-2xl sm:text-4xl font-bold tracking-tight">
              {subject.name}
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                <BookOpen className="mr-1 h-3 w-3" />
                {subject.chapters.length} Chapters
              </Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {totalQuestions} Total MCQs
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Romantic Motivation Section */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 border-2 border-pink-200 p-4 sm:p-6 text-center relative overflow-hidden shadow-lg">
        <div className="absolute top-2 right-2 text-2xl animate-pulse">💖</div>
        <div className="absolute bottom-2 left-2 text-2xl animate-pulse" style={{animationDelay: '0.5s'}}>✨</div>
        <div className="text-3xl sm:text-4xl mb-2">🌟</div>
        <h2 className="text-lg sm:text-xl font-bold text-rose-700 mb-2">
          You're Doing Amazing, Preeti! 💕
        </h2>
        <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto">
          Every chapter you complete is a step closer to your dreams. I believe in you completely! Let's conquer {subject.name} together! 💪❤️
        </p>
      </div>

      {/* View Full Syllabus Button */}
      <div className="mb-6 flex justify-center">
        <Link href="/syllabus">
          <Button 
            variant="outline" 
            className="group border-2 border-purple-300 hover:border-purple-500 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all touch-manipulation active:scale-95"
          >
            <BookMarked className="mr-2 h-4 w-4 group-hover:text-purple-600" />
            View Complete {subject.name} Syllabus
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold flex items-center gap-2">
          <span>Select a Chapter</span>
          <span className="text-2xl">📚</span>
        </h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {subject.chapters.map((chapter, index) => (
            <Link
              key={chapter.id}
              href={`/subjects/${subject.id}/${chapter.id}`}
              className="block"
            >
              <Card className="group h-full transition-all active:scale-95 hover:shadow-xl sm:hover:scale-105 cursor-pointer border-2 border-pink-200 hover:border-purple-400 touch-manipulation bg-gradient-to-br from-white via-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100">
                <CardHeader className="p-4 sm:p-6">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge className="text-xs whitespace-nowrap bg-purple-100 text-purple-700 border border-purple-300">
                      Chapter {index + 1}
                    </Badge>
                    <Badge className="text-xs whitespace-nowrap bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
                      {chapter.totalQuestions} MCQs
                    </Badge>
                  </div>
                  <CardTitle className="text-base sm:text-lg group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all font-bold">
                    {chapter.name}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-gray-600">
                    Practice {chapter.totalQuestions} questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-purple-600 font-semibold">
                      Start Practice
                    </span>
                    <ArrowRight className="h-4 w-4 text-purple-600 group-hover:text-pink-600 transition-all group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

