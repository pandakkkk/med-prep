"use client";

import Link from "next/link";
import { BookOpen, User, Menu } from "lucide-react";
import { useState, memo } from "react";

export const Header = memo(function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-pink-200 bg-gradient-to-r from-pink-50 via-white to-purple-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2 min-w-0 flex-shrink group touch-manipulation active:scale-95 transition-transform">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 flex-shrink-0 shadow-xl group-hover:shadow-2xl transition-shadow relative">
            <span className="text-xl sm:text-2xl animate-pulse">💕</span>
            <div className="absolute -top-1 -right-1 text-xs animate-bounce">✨</div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-clip-text text-transparent whitespace-nowrap">
              💖 Preeti's Journey
            </span>
            <span className="text-[10px] sm:text-xs text-pink-600 font-semibold hidden sm:inline">Crafted with endless love, just for you ❤️</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors touch-manipulation active:scale-95"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Subjects
          </Link>
          <Link 
            href="/motivation" 
            className="inline-flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 text-pink-700 transition-colors touch-manipulation active:scale-95"
          >
            <span className="mr-2">💖</span>
            For You
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors touch-manipulation active:scale-95"
            aria-label="User profile"
          >
            <User className="h-5 w-5" />
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-1">
          <Link 
            href="/motivation" 
            className="inline-flex items-center justify-center h-11 w-11 min-h-[44px] min-w-[44px] rounded-md bg-gradient-to-br from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition-colors touch-manipulation active:scale-95"
            aria-label="Motivation"
          >
            <span className="text-xl">💖</span>
          </Link>
        </div>
      </div>
    </header>
  );
})

