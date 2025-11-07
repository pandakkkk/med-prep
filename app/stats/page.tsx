"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Target, TrendingUp, BookOpen, CheckCircle2, Download, Calendar, Upload, Archive } from "lucide-react";
import { calculateOverallProgress, exportProgressData } from "@/lib/utils/progress";
import { exportData, importData, getLastBackupDate, saveLastBackupDate, BackupData } from "@/lib/utils/backup";

export default function StatsPage() {
  const [progress, setProgress] = useState<ReturnType<typeof calculateOverallProgress> | null>(null);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [backupStatus, setBackupStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Calculate real progress from localStorage
    const realProgress = calculateOverallProgress();
    setProgress(realProgress);
    setLastBackup(getLastBackupDate());
  }, []);

  const handleExport = () => {
    const data = exportProgressData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preeti-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFullBackup = () => {
    try {
      exportData();
      saveLastBackupDate();
      setLastBackup(new Date().toISOString());
      setBackupStatus({ type: 'success', message: '✅ Backup downloaded successfully!' });
      setTimeout(() => setBackupStatus({ type: null, message: '' }), 5000);
    } catch (error) {
      setBackupStatus({ type: 'error', message: '❌ Failed to create backup. Please try again.' });
      setTimeout(() => setBackupStatus({ type: null, message: '' }), 5000);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const backupData: BackupData = await importData(file);
      setBackupStatus({ 
        type: 'success', 
        message: `✅ Backup restored! ${backupData.metadata.totalQuestions} questions imported.` 
      });
      
      // Refresh the page after a short delay to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setBackupStatus({ 
        type: 'error', 
        message: error instanceof Error ? `❌ ${error.message}` : '❌ Failed to restore backup.' 
      });
      setTimeout(() => setBackupStatus({ type: null, message: '' }), 5000);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Show backup even when progress is loading
  const showBackupSection = true;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20">
      <div className="mb-6 sm:mb-8">
        <Link 
          href="/"
          className="inline-flex items-center justify-center h-10 px-4 mb-3 sm:mb-4 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors touch-manipulation active:scale-95"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl">🌟</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Preeti's Progress Dashboard
          </h1>
          <span className="text-2xl">💝</span>
        </div>
        <p className="text-sm sm:text-base text-gray-700 font-medium">
          Look how far you've come! Every step counts! 💪
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Your dedication is truly inspiring! Keep shining! ✨
        </p>
      </div>

      {/* Backup Status Message */}
      {backupStatus.type && (
        <div className={`mb-6 p-4 rounded-lg border-2 text-center font-medium ${
          backupStatus.type === 'success' 
            ? 'bg-green-50 border-green-300 text-green-800' 
            : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          {backupStatus.message}
        </div>
      )}

      {/* Backup & Restore Section - Always Visible */}
      <Card className="mb-6 sm:mb-8 border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Archive className="w-6 h-6 text-purple-600" />
            <div>
              <CardTitle>Backup Your Progress</CardTitle>
              <CardDescription>Save and restore your data safely</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Export Backup */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <Download className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-green-900 mb-1">Export Backup</h3>
                    <p className="text-sm text-green-700 mb-3">
                      Download all your progress, profile, and answered questions as a JSON file.
                    </p>
                    {lastBackup && (
                      <p className="text-xs text-green-600 mb-2">
                        Last backup: {new Date(lastBackup).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleFullBackup}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Backup
                </Button>
              </div>
            </div>

            {/* Import Backup */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <Upload className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-blue-900 mb-1">Restore Backup</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Import a previously saved backup file to restore your progress.
                    </p>
                    <p className="text-xs text-blue-600 font-medium mb-2">
                      ⚠️ This will replace current data!
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleImportClick}
                  variant="outline"
                  className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import Backup
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-4 p-3 rounded-lg bg-purple-50 border border-purple-200">
            <p className="text-xs text-purple-800">
              <strong>💡 Tip:</strong> Regular backups help you switch devices, restore after clearing browser data, 
              or keep a safety copy of your hard work! Backup files are small and can be stored anywhere. 💖
            </p>
          </div>
        </CardContent>
      </Card>

      {!progress ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4 animate-pulse">💕</div>
          <p className="text-gray-600 mb-2">Start solving questions to see your progress!</p>
          <Link href="/" className="text-pink-600 font-medium hover:underline">
            Go to Subjects →
          </Link>
        </div>
      ) : (
        <>
      <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        <Card>
          <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Attempted</div>
                <div className="text-2xl sm:text-3xl font-bold">{progress.attempted}</div>
                <div className="text-xs text-gray-500">of {progress.totalQuestions}</div>
              </div>
              <Target className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Accuracy</div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">{progress.accuracy.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">{progress.correct} correct</div>
              </div>
              <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Streak</div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-600">{progress.streak} {progress.streak === 1 ? 'day' : 'days'}</div>
                <div className="text-xs text-gray-500">Keep going! 🔥</div>
              </div>
              <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Progress</div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">{progress.percentage.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Overall</div>
              </div>
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 mb-6 sm:mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Your overall question answering performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-green-600">Correct Answers</span>
                  <span className="text-sm font-medium">{progress.correct} / {progress.attempted}</span>
                </div>
                <Progress 
                  value={progress.attempted > 0 ? (progress.correct / progress.attempted) * 100 : 0} 
                  className="h-3 bg-green-100"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-orange-600">Review Needed</span>
                  <span className="text-sm font-medium">{progress.incorrect} / {progress.attempted}</span>
                </div>
                <Progress 
                  value={progress.attempted > 0 ? (progress.incorrect / progress.attempted) * 100 : 0} 
                  className="h-3 bg-orange-100"
                />
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{progress.correct}</div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{progress.incorrect}</div>
                    <div className="text-xs text-muted-foreground">Review</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{progress.totalQuestions - progress.attempted}</div>
                    <div className="text-xs text-muted-foreground">Remaining</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Study Insights</CardTitle>
                <CardDescription>Your learning journey</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progress.streak > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
                  <Trophy className="h-6 w-6 text-yellow-600 mt-1" />
                  <div>
                    <div className="font-semibold text-yellow-900">🔥 {progress.streak} Day Streak!</div>
                    <div className="text-sm text-yellow-700">Keep the momentum going! 💪</div>
                  </div>
                </div>
              )}

              {progress.attempted >= 100 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold text-green-900">✨ {progress.attempted}+ Questions Attempted</div>
                    <div className="text-sm text-green-700">You're making amazing progress! 🌟</div>
                  </div>
                </div>
              )}

              {progress.accuracy >= 70 && progress.attempted >= 10 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300">
                  <TrendingUp className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <div className="font-semibold text-blue-900">📈 {progress.accuracy.toFixed(0)}% Accuracy</div>
                    <div className="text-sm text-blue-700">Excellent understanding! Keep it up! 🎯</div>
                  </div>
                </div>
              )}

              {progress.lastStudyDate && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300">
                  <Calendar className="h-6 w-6 text-pink-600 mt-1" />
                  <div>
                    <div className="font-semibold text-pink-900">📅 Last Study Session</div>
                    <div className="text-sm text-pink-700">{progress.lastStudyDate}</div>
                  </div>
                </div>
              )}

              {progress.attempted === 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300">
                  <span className="text-2xl mt-1">💕</span>
                  <div>
                    <div className="font-semibold text-purple-900">🎯 Ready to Start?</div>
                    <div className="text-sm text-purple-700">Begin your journey - every question counts!</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Progress</CardTitle>
          <CardDescription>Your progress across all subjects with questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {progress?.subjectsProgress
              .sort((a, b) => b.attempted - a.attempted)
              .map((subject) => (
              <div key={subject.subjectId}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-medium truncate">{subject.subjectName}</span>
                    {subject.accuracy >= 80 && subject.attempted >= 5 && (
                      <span className="text-green-500 text-sm">⭐</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground flex-shrink-0">
                    {subject.attempted} / {subject.totalQuestions}
                    {subject.attempted > 0 && (
                      <span className="ml-2 text-xs font-medium text-green-600">
                        ({subject.accuracy.toFixed(0)}%)
                      </span>
                    )}
                  </div>
                </div>
                <Progress value={subject.percentage} className="h-2" />
              </div>
            ))}
            {progress && progress.subjectsProgress.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No subjects attempted yet. Start practicing! 💪</p>
              </div>
            )}
            {!progress && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Start solving questions to see subject-wise progress! 📚</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

