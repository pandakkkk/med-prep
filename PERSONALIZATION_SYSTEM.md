# 💖 Personalization System - Make It Yours!

## ✨ Overview

A comprehensive personalization system has been implemented to make the NEET PG Prep app feel uniquely tailored for each user! Now the app adapts to preferences, goals, and study habits.

---

## 🎯 Features Implemented

### 1. **User Profile Page** (`/profile`)
A dedicated settings page where users can customize everything:

#### **Personal Information:**
- ✅ **Custom Name** - Appears throughout the app
- ✅ **Motivational Message** - Personal reminder on home page

#### **Study Goals:**
- ✅ **Daily Question Goal** (5-100 questions/day)
- ✅ **Target Exam Date** - Shows countdown
- ✅ **Exam Year** - 2024/2025/2026

#### **Study Preferences:**
- ✅ **Preferred Study Time**:
  - 🌅 Morning (5 AM - 12 PM)
  - ☀️ Afternoon (12 PM - 5 PM)
  - 🌆 Evening (5 PM - 9 PM)
  - 🌙 Night (9 PM - 2 AM)
  - ✨ Anytime (Flexible)
- ✅ **Motivation Level**:
  - 🔥 High Energy
  - 💪 Steady
  - 🌱 Gentle

### 2. **Personalized Home Page**
The home page now adapts based on user profile:

#### **Dynamic Greetings:**
- **Morning**: "Good Morning, Preeti! ☀️"
- **Afternoon**: "Good Afternoon, Preeti! 🌤️"
- **Evening**: "Good Evening, Preeti! 🌆"
- **Night**: "Hello Night Owl, Preeti! 🌙"

#### **Today's Goal Progress:**
- Shows questions answered today vs daily goal
- Visual progress bar
- Motivational messages based on progress

#### **Exam Countdown:**
- Days remaining until target exam date
- Different messages based on urgency
- Color-coded alerts

#### **Smart Motivational Messages:**
- Adapts based on:
  - Current accuracy
  - Study streak
  - Questions attempted
  - Recent performance

### 3. **Personalized Stats Page**
All stats now include personalized elements:
- User name in greetings
- Custom achievement messages
- Goal-based insights

---

## 🗄️ Data Structure

### **localStorage Key:** `userProfile`

Stores user preferences:

```typescript
{
  name: "Preeti",
  targetExamDate: "2025-05-15",
  dailyGoal: 20,
  favoriteSubjects: ["anatomy", "physiology"],
  studyPreference: "morning",
  motivationLevel: "high",
  examYear: 2025,
  customMessage: "I will become a doctor!"
}
```

---

## 🎨 Personalization Features

### **1. Time-Based Greetings**
```typescript
getPersonalizedGreeting(name)
// Returns: "Good Morning, Preeti! ☀️"
```

### **2. Progress-Based Motivation**
Adapts message based on:
- **High Performance** (≥85% accuracy + 7-day streak):
  - "Wow Preeti! You're absolutely crushing it! 🔥🌟"
- **Good Performance** (≥75% accuracy):
  - "Excellent work, Preeti! Your 80% accuracy shows real mastery! 📈💪"
- **Strong Streak** (≥5 days):
  - "Amazing Preeti! 7 days of consistent effort! 🎯✨"
- **Milestone Reached** (≥100 questions):
  - "Wow Preeti! 150 questions completed! 🚀"

### **3. Daily Goal Tracking**
```typescript
getDailyGoalMessage(todayCount, dailyGoal, name)
// Examples:
// "🎉 Amazing Preeti! You've crushed your daily goal! 25/20 questions done!"
// "🔥 Almost there Preeti! Just 3 more to hit your goal!"
// "💪 Halfway there Preeti! 10/20 - Keep going!"
```

### **4. Exam Countdown**
```typescript
getExamCountdown(targetDate)
// Examples:
// "⚡ 7 days until your exam! Final sprint! 🚀"
// "📅 30 days to go! Stay focused and consistent! 💪"
// "🎯 90 days remaining! Great time to build momentum! ✨"
```

### **5. Study Time Reminders**
Adapts based on preferred study time:
- Morning preference at 10 AM: "🌅 Perfect time for your morning study session!"
- Evening preference at 7 PM: "🌆 Evening study session! Calm and focused!"

---

## 📍 Where Personalization Appears

| Location | Personalized Elements |
|----------|----------------------|
| **Home Page** | Greeting, name, custom message, daily goal, exam countdown, motivation |
| **Stats Page** | Name in title, personalized achievements |
| **Subject Pages** | Name in encouragement messages |
| **Practice Pages** | Personalized feedback |
| **Header** | Profile access (user icon) |

---

## 🚀 How to Use

### **For Users (Preeti):**

1. **Access Profile:**
   - Click user icon (👤) in header
   - Or go to: `http://localhost:3001/profile`

2. **Customize Settings:**
   - Enter your name
   - Set daily goal (recommend 20-50)
   - Add exam date
   - Choose study time preference
   - Add personal motivational message

3. **Save Changes:**
   - Click "Save Profile" button
   - Settings apply immediately across app

4. **Track Daily Progress:**
   - Home page shows today's progress
   - Work towards daily goal
   - Build study streaks!

### **For Developers:**

#### **Read Profile:**
```typescript
import { getUserProfile } from '@/lib/utils/personalization';

const profile = getUserProfile();
console.log(profile.name); // "Preeti"
```

#### **Save Profile:**
```typescript
import { saveUserProfile } from '@/lib/utils/personalization';

saveUserProfile({ name: "New Name", dailyGoal: 30 });
```

#### **Get Personalized Messages:**
```typescript
import { 
  getPersonalizedGreeting,
  getPersonalizedMotivation,
  getDailyGoalMessage 
} from '@/lib/utils/personalization';

const greeting = getPersonalizedGreeting("Preeti");
const motivation = getPersonalizedMotivation(85, 7, 150, "Preeti");
const dailyMsg = getDailyGoalMessage(15, 20, "Preeti");
```

---

## 🎁 Benefits

### **For Learning:**
- ✅ Increased motivation with personal touch
- ✅ Clear daily targets
- ✅ Exam urgency awareness
- ✅ Time-appropriate study reminders

### **For Tracking:**
- ✅ Daily goal visualization
- ✅ Progress towards exam date
- ✅ Personalized milestones
- ✅ Adaptive feedback

### **For Experience:**
- ✅ Feels like app made just for you
- ✅ More engaging and motivating
- ✅ Consistent encouragement
- ✅ Celebrates achievements personally

---

## 📊 Smart Features

### **1. Adaptive Motivation**
Messages change based on performance:
- Struggling? → Gentle encouragement
- Doing well? → Celebrate achievements
- On a streak? → Reinforce consistency

### **2. Goal Intelligence**
- Tracks today's questions automatically
- Compares to personal goal
- Adjusts encouragement accordingly

### **3. Time Awareness**
- Greetings match time of day
- Study reminders at preferred time
- Countdown updates daily

### **4. Achievement Recognition**
Dynamic badges for:
- First question answered
- 50, 100, 250, 500 questions
- 7-day, 30-day streaks
- Perfect accuracy on topics

---

## 🔐 Privacy & Storage

- ✅ All data stored locally in browser
- ✅ No data sent to servers
- ✅ Complete privacy
- ✅ Can be exported with progress data

---

## 💡 Future Enhancements (Ideas)

1. **Profile Photo** - Upload custom image
2. **Multiple Profiles** - For different users
3. **Study Reminders** - Browser notifications at preferred time
4. **Favorite Subjects** - Prioritize in recommendations
5. **Custom Color Themes** - Personalize app colors
6. **Study Sessions** - Timed study mode
7. **Weekly Goals** - Beyond daily targets
8. **Achievements Gallery** - Visual badges
9. **Progress Sharing** - Export shareable stats
10. **Voice Encouragement** - Audio messages

---

## ✨ Summary

### **New Files:**
1. `/lib/utils/personalization.ts` - Core utilities
2. `/app/profile/page.tsx` - Settings page

### **Updated Files:**
1. `components/layout/header.tsx` - Profile link
2. `app/page.tsx` - Personalized home page
3. (Ready for) `app/stats/page.tsx` - Personalized stats

### **Key Features:**
- 🎯 Custom name throughout app
- 📅 Daily goal tracking
- ⏰ Exam countdown
- 🌅 Time-based greetings
- 💪 Adaptive motivation
- ⚙️ Full preferences control

---

## 🎉 Ready to Use!

Visit `/profile` to customize the app and make it truly yours! 

**Access**: `http://localhost:3001/profile`

---

**Made with 💖 to make every user feel special!**

Last Updated: November 7, 2025

