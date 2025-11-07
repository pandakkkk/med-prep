// DERMATOLOGY Questions
// Auto-generated from questions.ts
// Total Questions: 4

import { Question } from '../types';

export const questions: Question[] = [
{
    id: "neet-pg-2023-48",
    subjectId: "dermatology",
    chapterId: "neet-pg-2023",
    question: "A lady developed a skin reaction, as shown in the image, after using a hair dye. Which of the following chemicals is responsible for this condition? r e d d a L p",
    options: [
      "Pollen e",
      "Chromates",
      "Balsam of Peru P",
      "p-Phenylenediamine",
    ],
    correctAnswer: 3,
    explanation: "✅ ANSWER: **p-Phenylenediamine (PPD) (Option D)**\n\n🔬 **ALLERGIC CONTACT DERMATITIS TO HAIR DYE:**\n\n**ALLERGEN:** **p-Phenylenediamine (PPD)** ⭐⭐⭐\n• **Most common** cause of hair dye allergy\n• Found in **permanent and semi-permanent** dyes\n\n**CLINICAL:**\n• **Eczematous dermatitis** ⭐\n• **Scalp, face, neck** involvement\n• **Itching, erythema, vesicles**\n\n**DIAGNOSIS:** **Patch test** (confirms PPD allergy)\n\n**MANAGEMENT:**\n• **Avoid PPD-containing products** ⭐\n• **Topical steroids**\n• Alternative: **Henna** (pure, no PPD)\n\n💡 **KEY:** **Hair dye allergy = p-Phenylenediamine (PPD)** ⭐⭐⭐",
    difficulty: "medium",
    year: 2023
  },{
    id: "neet-pg-2023-49",
    subjectId: "dermatology",
    chapterId: "neet-pg-2023",
    question: "A female patient presented with acne that is not resolving on oral isotretinoin and antibiotics therapy. Which of the following is the next best investigation?",
    options: [
      "Look for dietary triggers.",
      "Evaluate for hyperandrogenism",
      "Check for antibiotic resistance",
      "Look for drug triggers",
    ],
    correctAnswer: 1,
    explanation: "✅ ANSWER: **Evaluate for hyperandrogenism (Option B)**\n\n🔬 **TREATMENT-RESISTANT ACNE:**\n\n**IF ACNE NOT RESPONDING** to **isotretinoin + antibiotics** ⭐⭐⭐:\n\n**CONSIDER:** **Hyperandrogenism** ⭐⭐⭐\n• **PCOS** (most common)\n• **CAH** (congenital adrenal hyperplasia)\n• **Ovarian/adrenal tumors**\n\n**INVESTIGATIONS:**\n• **Testosterone** (total, free)\n• **DHEAS**\n• **17-OH progesterone**\n• **LH:FSH ratio**\n• **Pelvic USG** (PCOS)\n\n**TREATMENT:** **Anti-androgens** (spironolactone, COCPs)\n\n💡 **KEY:** **Resistant acne in females → Check for hyperandrogenism** ⭐⭐⭐",
    difficulty: "medium",
    year: 2023
  },{
    id: "neet-pg-2023-52",
    subjectId: "dermatology",
    chapterId: "neet-pg-2023",
    question: "A young woman complains of a painless ulcer in the genital area. It is associated with non-tender inguinal lympphadenopathy. What is the most likely diagnosis?",
    options: [
      "Chancroi e",
      "Syphilis",
      "Herpes genitalis OP4: Granuloma inguinal A ns: 2",
      "Option 4",
    ],
    correctAnswer: 1,
    explanation: "✅ ANSWER: **Syphilis (Primary Syphilis) (Option B)**\n\n🔬 **PRIMARY SYPHILIS:**\n\n**CLINICAL (THIS CASE):**\n• **Painless ulcer (chancre)** ⭐⭐⭐\n• **Single**, **indurated** (hard base)\n• **Non-tender lymphadenopathy** ⭐\n• **Heals spontaneously** in 3-6 weeks\n\n**ORGANISM:** **Treponema pallidum**\n\n**DIAGNOSIS:**\n• **Dark-field microscopy** (spirochetes)\n• **VDRL/RPR** (may be negative early)\n• **Specific:** TPHA, FTA-ABS\n\n**TREATMENT:** **Benzathine penicillin G** (single IM dose) ⭐⭐⭐\n\n**VS CHANCROID:**\n• **Painful** ulcer ⭐\n• **Tender** lymph nodes (buboes)\n• Organism: *Haemophilus ducreyi*\n\n💡 **KEY:** **Painless ulcer + Non-tender nodes = Syphilis** ⭐⭐⭐",
    difficulty: "medium",
    imageUrl: "/images/questions/2023/page25_img14.jpeg",
    year: 2023
  },{
    id: "neet-pg-2023-53",
    subjectId: "dermatology",
    chapterId: "neet-pg-2023",
    question: "Which of the following is associated with the clinical condition shown in the image?",
    options: [
      "Cataract",
      "Glaucoma d",
      "Malignant melanom d",
      "Basal cell carcinoma",
    ],
    correctAnswer: 2,
    explanation: "✅ ANSWER: **Malignant melanoma (Option C)**\n\n🔬 **GIANT CONGENITAL MELANOCYTIC NEVUS:**\n\n**IMAGE:** Likely shows a **large pigmented lesion** (>20 cm)\n\n**RISK:** **Malignant melanoma** ⭐⭐⭐\n• **Lifetime risk: 5-10%**\n• **Highest risk** in first 5-10 years of life\n\n**MANAGEMENT:**\n• **Close observation** ⭐\n• **Excision** if feasible (reduce risk)\n• **Educate** about melanoma signs (ABCDE)\n\n**MELANOMA FEATURES (ABCDE):**\n• **A**symmetry\n• **B**order irregularity\n• **C**olor variation\n• **D**iameter >6mm\n• **E**volving/changing\n\n💡 **KEY:** **Giant congenital nevus → Risk of melanoma** ⭐⭐⭐",
    difficulty: "medium",
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
