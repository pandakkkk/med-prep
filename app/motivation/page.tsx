"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Sparkles, Star, Trophy } from "lucide-react";

export default function MotivationPage() {
  const messages = [
    {
      emoji: "💖",
      title: "To My Brilliant Preeti",
      message: "Watching you work towards your dreams fills my heart with so much pride. Your dedication, your strength, and your determination inspire me every single day."
    },
    {
      emoji: "🌟",
      title: "You Are Unstoppable",
      message: "I've seen you overcome challenges that would make others give up. Your resilience is incredible. NEET PG is just another milestone you'll conquer!"
    },
    {
      emoji: "💪",
      title: "On Tough Days",
      message: "When it feels overwhelming, remember - you're not alone in this journey. I'm here, cheering for you, believing in you, and loving you through every moment."
    },
    {
      emoji: "✨",
      title: "Your Future is Bright",
      message: "I can already see Dr. Preeti making a difference in people's lives. Your compassion combined with your knowledge will make you an exceptional doctor!"
    },
    {
      emoji: "🎯",
      title: "Every Step Counts",
      message: "Each question you solve, each chapter you complete, each concept you master - they're all steps towards your dream. And I'm so proud of every single step!"
    },
    {
      emoji: "💝",
      title: "My Promise",
      message: "No matter how tough it gets, no matter how many times you doubt yourself, I'll be right here reminding you of how capable and amazing you are. Always!"
    }
  ];

  const quotes = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Believe you can and you're halfway there.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Your only limit is you.",
    "Great things never come from comfort zones.",
    "Dream big, work hard, stay focused.",
    "Success doesn't just find you. You have to go out and get it!",
    "The harder you work for something, the greater you'll feel when you achieve it."
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20">
      <div className="mb-6 sm:mb-8">
        <Link 
          href="/"
          className="inline-flex items-center justify-center h-10 px-4 mb-4 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors touch-manipulation active:scale-95"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4 text-4xl">
            <span className="animate-pulse">💕</span>
            <span>✨</span>
            <span className="animate-pulse">💖</span>
            <span>✨</span>
            <span className="animate-pulse">💕</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
            A Special Message For You
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Whenever you need a boost, come back here 💝
          </p>
        </div>

        {/* Personal Photo Section */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-pink-300">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-200/50 via-purple-200/50 to-rose-200/50 z-0"></div>
          
          {/* Photo */}
          <div className="relative z-10 flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-md">
              <div className="rounded-xl shadow-2xl overflow-hidden" style={{ transform: 'rotate(90deg)' }}>
                <Image 
                  src="/images/personal/DSC_0017.jpg" 
                  alt="Together" 
                  width={450}
                  height={600}
                  priority
                  className="object-contain w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 450px"
                />
              </div>
              {/* Decorative hearts */}
              <div className="absolute -top-3 -left-3 text-3xl animate-pulse">💕</div>
              <div className="absolute -top-3 -right-3 text-3xl animate-pulse" style={{animationDelay: '0.5s'}}>💖</div>
              <div className="absolute -bottom-3 -left-3 text-3xl animate-pulse" style={{animationDelay: '1s'}}>✨</div>
              <div className="absolute -bottom-3 -right-3 text-3xl animate-pulse" style={{animationDelay: '1.5s'}}>🌟</div>
            </div>
          </div>
          
          {/* Caption overlay at bottom */}
          <div className="relative z-10 bg-gradient-to-t from-pink-600/95 via-purple-600/90 to-transparent px-6 py-6 text-center">
            <p className="text-white text-xl sm:text-2xl font-bold drop-shadow-2xl mb-2">
              Every step you take, I'm right here with you
            </p>
            <p className="text-pink-100 text-lg">💖 Together Forever 💖</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 mb-8">
        {messages.map((msg, index) => (
          <Card key={index} className="border-2 hover:shadow-lg transition-all bg-gradient-to-br from-white to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <span className="text-3xl">{msg.emoji}</span>
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {msg.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {msg.message}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Daily Inspiration
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4">
            {quotes.map((quote, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/80 border border-purple-200">
                <Star className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm sm:text-base text-gray-700 italic">"{quote}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center p-6 rounded-lg bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 border-2 border-pink-300">
        <Heart className="h-12 w-12 text-pink-600 mx-auto mb-3 animate-pulse" />
        <p className="text-lg sm:text-xl font-semibold text-pink-800 mb-2">
          Always Remember
        </p>
        <p className="text-base sm:text-lg text-gray-700">
          You're not just preparing for an exam. You're preparing to make a difference in the world.
          And I couldn't be more proud to be by your side on this journey! 💖
        </p>
        <p className="text-sm sm:text-base text-pink-600 font-medium mt-3">
          With all my love and belief in you,
        </p>
        <p className="text-base sm:text-lg font-bold text-pink-700 mt-1">
          Your biggest cheerleader 🌟
        </p>
      </div>
    </div>
  );
}

