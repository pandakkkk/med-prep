// Personalization utilities for NEET PG Prep

export interface UserProfile {
  name: string;
  targetExamDate?: string;
  dailyGoal?: number; // questions per day - must be set by user
  favoriteSubjects: string[];
  studyPreference: 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';
  motivationLevel: 'high' | 'medium' | 'low';
  examYear: number;
  profilePhoto?: string;
  customMessage?: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Preeti',
  dailyGoal: undefined, // Let Preeti set her own goal
  favoriteSubjects: [],
  studyPreference: 'anytime',
  motivationLevel: 'high',
  examYear: 2025,
};

// Get user profile from localStorage
export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  
  try {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error reading user profile:', error);
  }
  return DEFAULT_PROFILE;
}

// Save user profile to localStorage
export function saveUserProfile(profile: Partial<UserProfile>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const current = getUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem('userProfile', JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
}

// Get personalized greeting based on time of day
export function getPersonalizedGreeting(name: string = 'Preeti'): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return `Hey ${name}! ☀️`;
  } else if (hour < 17) {
    return `Hey ${name}! 🌤️`;
  } else if (hour < 21) {
    return `Hey ${name}! 🌆`;
  } else {
    return `Hey ${name}! 🌙`;
  }
}

// Get personalized motivation based on progress
export function getPersonalizedMotivation(
  accuracy: number,
  streak: number,
  attempted: number,
  name: string = 'Preeti'
): string {
  if (attempted === 0) {
    return `Hey ${name}! Ready to start your amazing journey? Let's conquer NEET PG together! 💪✨`;
  }
  
  if (accuracy >= 85 && streak >= 7) {
    return `Wow ${name}! You're absolutely crushing it! ${accuracy.toFixed(0)}% accuracy and ${streak} day streak! You're unstoppable! 🔥🌟`;
  }
  
  if (accuracy >= 75) {
    return `Excellent work, ${name}! Your ${accuracy.toFixed(0)}% accuracy shows real mastery! Keep this momentum going! 📈💪`;
  }
  
  if (streak >= 5) {
    return `Amazing ${name}! ${streak} days of consistent effort! Your dedication is truly inspiring! 🎯✨`;
  }
  
  if (attempted >= 100) {
    return `Wow ${name}! ${attempted} questions completed! You're making incredible progress! Every question brings you closer! 🚀`;
  }
  
  if (attempted >= 50) {
    return `Great going ${name}! You've answered ${attempted} questions! Your hard work is definitely paying off! 💖`;
  }
  
  return `Keep pushing forward ${name}! Every question you solve makes you stronger! I believe in you! 💕`;
}

// Get time-based study encouragement
export function getStudyTimeMessage(preference: string = 'anytime'): string {
  const hour = new Date().getHours();
  
  if (preference === 'morning' && hour >= 5 && hour < 12) {
    return '🌅 Perfect time for your morning study session! Your brain is fresh and ready!';
  }
  
  if (preference === 'afternoon' && hour >= 12 && hour < 17) {
    return '☀️ Great afternoon study time! Let\'s make the most of it!';
  }
  
  if (preference === 'evening' && hour >= 17 && hour < 21) {
    return '🌆 Evening study session! Calm and focused - perfect for learning!';
  }
  
  if (preference === 'night' && hour >= 21) {
    return '🌙 Night study time! Quiet and peaceful - great for concentration!';
  }
  
  return '✨ It\'s a great time to study! Let\'s make progress together!';
}

// Get daily goal progress message
export function getDailyGoalMessage(
  todayCount: number,
  dailyGoal: number | undefined,
  name: string = 'Preeti'
): string | null {
  // If no daily goal is set, return null
  if (!dailyGoal || dailyGoal === 0) {
    return null;
  }
  
  const percentage = (todayCount / dailyGoal) * 100;
  
  if (percentage >= 100) {
    return `🎉 Amazing ${name}! You've crushed your daily goal! ${todayCount}/${dailyGoal} questions done!`;
  }
  
  if (percentage >= 75) {
    return `🔥 Almost there ${name}! Just ${dailyGoal - todayCount} more to hit your goal!`;
  }
  
  if (percentage >= 50) {
    return `💪 Halfway there ${name}! ${todayCount}/${dailyGoal} - Keep going!`;
  }
  
  if (todayCount > 0) {
    return `✨ Good start ${name}! ${todayCount}/${dailyGoal} - You've got this!`;
  }
  
  return `🎯 Ready to tackle your daily goal of ${dailyGoal} questions, ${name}?`;
}

// Get exam countdown message
export function getExamCountdown(targetDate?: string): string | null {
  if (!targetDate) return null;
  
  const target = new Date(targetDate);
  const today = new Date();
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return null;
  
  if (diffDays === 0) {
    return '🎯 Today is the day! You\'ve got this! 💪';
  }
  
  if (diffDays <= 7) {
    return `⚡ ${diffDays} days until your exam! Final sprint! 🚀`;
  }
  
  if (diffDays <= 30) {
    return `📅 ${diffDays} days to go! Stay focused and consistent! 💪`;
  }
  
  if (diffDays <= 90) {
    return `🎯 ${diffDays} days remaining! Great time to build momentum! ✨`;
  }
  
  return `📚 ${diffDays} days until your exam! Plenty of time to prepare well! 🌟`;
}

// Get personalized subject recommendation
export function getRecommendedSubject(
  subjectsProgress: any[],
  favoriteSubjects: string[]
): string | null {
  if (subjectsProgress.length === 0) return null;
  
  // Find subjects with low attempts
  const needAttention = subjectsProgress
    .filter(sp => sp.attempted < 10 || sp.accuracy < 70)
    .sort((a, b) => a.attempted - b.attempted);
  
  // Prioritize favorite subjects that need attention
  const favNeedAttention = needAttention.filter(sp => 
    favoriteSubjects.includes(sp.subjectId)
  );
  
  if (favNeedAttention.length > 0) {
    return favNeedAttention[0].subjectName;
  }
  
  if (needAttention.length > 0) {
    return needAttention[0].subjectName;
  }
  
  return null;
}

// Get achievement message
export function getAchievementMessage(
  milestone: 'first' | '50' | '100' | '250' | '500' | 'streak7' | 'streak30' | 'perfect',
  name: string = 'Preeti'
): string {
  const achievements = {
    first: `🎊 First question answered! This is the beginning of something amazing, ${name}!`,
    '50': `🌟 50 questions milestone! You're building great momentum, ${name}!`,
    '100': `🎉 Century! 100 questions completed! You're on fire, ${name}!`,
    '250': `🚀 250 questions! Your dedication is phenomenal, ${name}!`,
    '500': `👑 500 questions! You're a champion, ${name}! Incredible work!`,
    streak7: `🔥 7 day streak! Your consistency is inspiring, ${name}!`,
    streak30: `💎 30 day streak! You're absolutely unstoppable, ${name}!`,
    perfect: `⭐ Perfect accuracy on this topic! You've mastered it, ${name}!`,
  };
  
  return achievements[milestone] || `Amazing work, ${name}! 💖`;
}

// Get custom motivational messages
export function getCustomMessages(customMessage?: string): string[] {
  const defaultMessages = [
    "Every question brings you closer to your dream! 💫",
    "Your hard work today creates your success tomorrow! 🌟",
    "Believe in yourself - you're capable of amazing things! 💪",
    "One step at a time, one question at a time! 🎯",
    "Your dedication is your superpower! ⚡",
  ];
  
  if (customMessage) {
    return [customMessage, ...defaultMessages];
  }
  
  return defaultMessages;
}

// Calculate today's question count
export function getTodayQuestionCount(): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const stored = localStorage.getItem('answeredQuestions');
    if (!stored) return 0;
    
    const questions = JSON.parse(stored);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get unique questions attempted today
    const todayQuestions = questions.filter((q: any) => {
      const qDate = new Date(q.timestamp);
      qDate.setHours(0, 0, 0, 0);
      return qDate.getTime() === today.getTime();
    });
    
    // Count only unique question IDs
    const uniqueQuestionIds = new Set(todayQuestions.map((q: any) => q.questionId));
    return uniqueQuestionIds.size;
  } catch (error) {
    console.error('Error calculating today count:', error);
    return 0;
  }
}

