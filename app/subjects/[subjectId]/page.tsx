"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { subjects } from "@/lib/data/subjects";
import { preloadSubjectQuestions } from "@/lib/data/questionsV2";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;
  const subject = subjects.find((s) => s.id === subjectId);

  // Preload questions and redirect to practice page
  useEffect(() => {
    if (subject) {
      preloadSubjectQuestions(subjectId);
      // Redirect to practice page
      router.push(`/subjects/${subjectId}/practice`);
    }
  }, [subjectId, subject, router]);

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

  // Show loading while redirecting
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-pink-100 to-purple-100">
          <div className="text-3xl animate-pulse">💕</div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading {subject.name}...</h2>
        <p className="text-gray-600">Preparing your practice session</p>
      </div>
    </div>
  );
}
