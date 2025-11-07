// ANESTHESIOLOGY Questions
// Auto-generated from questions.ts
// Total Questions: 3

import { Question } from '../types';

export const questions: Question[] = [
{
    id: "neet-pg-2023-50",
    subjectId: "anesthesiology",
    chapterId: "neet-pg-2023",
    question: "Question 50 - [Content needs manual review]",
    options: [
      "Option 1",
      "Jaw thrust",
      "Head extension",
      "d. In-line manual stabilization",
    ],
    correctAnswer: 0,
    explanation: "✅ ANSWER: **Option 1**\n\n🔬 Detailed explanation to be added.",
    difficulty: "medium",
    imageUrl: "/images/questions/2023/page24_img13.jpeg",
    year: 2023
  },{
    id: "neet-pg-2023-54",
    subjectId: "anesthesiology",
    chapterId: "neet-pg-2023",
    question: "p Which of the following is the drug of choice for preoperative antibiotic prophylaxis in a patient undergoing cardiac surgery?",
    options: [
      "Penicillin G",
      "Erythromycin",
      "P Azithromycin",
      "Cefazolin",
    ],
    correctAnswer: 3,
    explanation: "✅ ANSWER: **Cefazolin (Option D)**\n\n🔬 **CARDIAC SURGERY ANTIBIOTIC PROPHYLAXIS:**\n\n**DRUG OF CHOICE:** **Cefazolin** ⭐⭐⭐\n• **1st generation cephalosporin**\n• **Covers** Staph aureus, Staph epidermidis (most common pathogens)\n\n**DOSING:**\n• **1-2g IV** within **60 minutes** before incision ⭐\n• **Repeat** q4-8h intraoperatively\n• **Discontinue** within **48 hours** post-op ⭐\n\n**ALTERNATIVE (if penicillin allergy):**\n• **Vancomycin**\n\n💡 **KEY:** **Cardiac surgery prophylaxis = Cefazolin** ⭐⭐⭐",
    difficulty: "medium",
    imageUrl: "/images/questions/2023/page26_img15.jpeg",
    year: 2023
  },{
    id: "neet-pg-2023-148",
    subjectId: "anesthesiology",
    chapterId: "neet-pg-2023",
    question: "During resuscitation, when is the given position indicated? r e d d a",
    options: [
      "Unconsciousness with pulse and breathing absent",
      "Unconsciousness with pulse present and breathing absent",
      "Unconsciousness with pulse and breathing present e",
      "Unconsciousness with pulse absent and breathing present",
    ],
    correctAnswer: 2,
    explanation: "✅ ANSWER: **Unconsciousness with pulse and breathing present (Option C)**\n\n🔬 **RECOVERY POSITION (Lateral decubitus):**\n\n**INDICATION:** ⭐⭐⭐\n• **Unconscious** ⭐\n• **Pulse PRESENT** ⭐⭐⭐\n• **Breathing PRESENT** ⭐⭐⭐\n• = **Protects airway** while awaiting help\n\n**PURPOSE:**\n• **Prevents aspiration** ⭐⭐⭐ (vomit, secretions drain out)\n• **Maintains airway patency**\n• **Prevents tongue from falling back**\n\n**HOW TO POSITION:**\n• **Lateral** (on side)\n• **Lower arm extended**\n• **Upper leg bent** (stability)\n• **Head tilted** (airway open)\n\n**WHY NOT FOR OTHER SCENARIOS:**\n\n• **No pulse, No breathing:** **CPR** (supine) ⭐\n• **No pulse, Breathing present:** Impossible (agonal breathing only)\n• **Pulse present, No breathing:** **Rescue breathing** (supine)\n\n**REMEMBER:**\n• **Breathing + Pulse** = Recovery position\n• **No pulse** = CPR (supine)\n\n💡 **KEY:** **Unconscious + Breathing + Pulse = Recovery position** ⭐⭐⭐",
    difficulty: "medium",
    imageUrl: "/images/questions/2023/page73_img39.jpeg",
    year: 2023
  }
];

export default questions;

// Helper function to get questions by chapter
export function getQuestionsByChapter(chapterId: string): Question[] {
  return questions.filter(q => q.chapterId === chapterId);
}

// Export question count
export const questionCount = questions.length;
