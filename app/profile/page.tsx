"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Heart, Target, Calendar, Clock, Sparkles, User } from "lucide-react";
import { getUserProfile, saveUserProfile, UserProfile } from "@/lib/utils/personalization";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const userProfile = getUserProfile();
    setProfile(userProfile);
  }, []);

  const handleSave = () => {
    if (profile) {
      saveUserProfile(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  if (!profile) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">👤</div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <Link 
          href="/"
          className="inline-flex items-center justify-center h-10 px-4 mb-4 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors touch-manipulation active:scale-95"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex items-center justify-center gap-3 mb-4">
          <User className="w-10 h-10 text-pink-600" />
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
        </div>
        <p className="text-center text-sm sm:text-base text-gray-600">
          Personalize your NEET PG preparation journey 💖
        </p>
      </div>

      {saved && (
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-center">
          <p className="text-green-700 font-semibold">✅ Profile saved successfully!</p>
        </div>
      )}

      {/* Personal Information */}
      <Card className="mb-6 border-2 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-600" />
            Personal Information
          </CardTitle>
          <CardDescription>Make this app truly yours!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 transition-colors"
              placeholder="Enter your name"
            />
            <p className="text-xs text-gray-500 mt-1">
              This name will appear throughout the app 💕
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Motivational Message
            </label>
            <textarea
              value={profile.customMessage || ''}
              onChange={(e) => handleChange('customMessage', e.target.value)}
              className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 transition-colors"
              placeholder="A personal message to motivate yourself..."
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Your personal reminder that will appear on the home page ✨
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Study Goals */}
      <Card className="mb-6 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Study Goals
          </CardTitle>
          <CardDescription>Set your targets and track progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Question Goal {!profile.dailyGoal && <span className="text-pink-600 font-semibold">*</span>}
            </label>
            {!profile.dailyGoal && (
              <div className="mb-2 p-2 rounded-lg bg-pink-50 border border-pink-200">
                <p className="text-xs text-pink-700 font-medium">
                  ⚠️ Set your daily goal to start tracking your progress!
                </p>
              </div>
            )}
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={profile.dailyGoal || 20}
                onChange={(e) => handleChange('dailyGoal', parseInt(e.target.value))}
                className="flex-1"
              />
              <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {profile.dailyGoal || 20}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Questions to answer per day 🎯
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Exam Date
            </label>
            <input
              type="date"
              value={profile.targetExamDate || ''}
              onChange={(e) => handleChange('targetExamDate', e.target.value)}
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-400 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll show you a countdown to keep you motivated! 📅
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Year
            </label>
            <select
              value={profile.examYear}
              onChange={(e) => handleChange('examYear', parseInt(e.target.value))}
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-400 transition-colors"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Study Preferences */}
      <Card className="mb-6 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Study Preferences
          </CardTitle>
          <CardDescription>When do you study best?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Study Time
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { value: 'morning', label: '🌅 Morning', time: '5 AM - 12 PM' },
                { value: 'afternoon', label: '☀️ Afternoon', time: '12 PM - 5 PM' },
                { value: 'evening', label: '🌆 Evening', time: '5 PM - 9 PM' },
                { value: 'night', label: '🌙 Night', time: '9 PM - 2 AM' },
                { value: 'anytime', label: '✨ Anytime', time: 'Flexible' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleChange('studyPreference', option.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    profile.studyPreference === option.value
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.time}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivation Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'high', label: '🔥 High Energy', desc: 'Lots of motivation!' },
                { value: 'medium', label: '💪 Steady', desc: 'Balanced approach' },
                { value: 'low', label: '🌱 Gentle', desc: 'Easy reminders' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleChange('motivationLevel', option.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    profile.motivationLevel === option.value
                      ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-red-50 shadow-md'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="sticky bottom-4 bg-white border-2 border-pink-300 rounded-lg p-4 shadow-lg">
        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg py-6 hover:from-pink-600 hover:to-purple-600 transition-all"
          size="lg"
        >
          <Save className="mr-2 h-5 w-5" />
          Save Profile
        </Button>
      </div>

      {/* Info Card */}
      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 border-2 border-pink-200">
        <p className="text-sm text-center text-gray-700">
          💡 <strong>Tip:</strong> Your preferences are saved locally and will persist across sessions!
        </p>
      </div>
    </div>
  );
}

