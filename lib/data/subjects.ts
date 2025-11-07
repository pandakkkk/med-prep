export interface Chapter {
  id: string;
  name: string;
  totalQuestions: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: Chapter[];
}

export const subjects: Subject[] = [
  {
    id: "anatomy",
    name: "Anatomy",
    icon: "🫀",
    color: "bg-red-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 12 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 8 },
    ],
  },
  {
    id: "physiology",
    name: "Physiology",
    icon: "⚡",
    color: "bg-yellow-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 6 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 8 },
    ],
  },
  {
    id: "biochemistry",
    name: "Biochemistry",
    icon: "🧬",
    color: "bg-green-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 14 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 15 },
    ],
  },
  {
    id: "pathology",
    name: "Pathology",
    icon: "🔬",
    color: "bg-purple-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 6 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 11 },
    ],
  },
  {
    id: "pharmacology",
    name: "Pharmacology",
    icon: "💊",
    color: "bg-blue-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 1 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 12 },
    ],
  },
  {
    id: "microbiology",
    name: "Microbiology",
    icon: "🦠",
    color: "bg-teal-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 1 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 13 },
    ],
  },
  {
    id: "forensic",
    name: "Forensic Medicine",
    icon: "⚖️",
    color: "bg-gray-600",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 4 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 8 },
    ],
  },
  {
    id: "medicine",
    name: "Medicine",
    icon: "🏥",
    color: "bg-indigo-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 36 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 16 },
    ],
  },
  {
    id: "surgery",
    name: "Surgery",
    icon: "🔪",
    color: "bg-orange-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 41 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 26 },
    ],
  },
  {
    id: "obgyn",
    name: "Obstetrics & Gynecology",
    icon: "👶",
    color: "bg-pink-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 16 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 6 },
    ],
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    icon: "🧸",
    color: "bg-cyan-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 2 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 10 },
    ],
  },
  {
    id: "psm",
    name: "Preventive & Social Medicine",
    icon: "🏥",
    color: "bg-teal-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 3 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 15 },
    ],
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    icon: "🦴",
    color: "bg-amber-600",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 9 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 6 },
    ],
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    icon: "👁️",
    color: "bg-sky-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 5 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 8 },
    ],
  },
  {
    id: "ent",
    name: "ENT",
    icon: "👂",
    color: "bg-violet-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 0 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 6 },
    ],
  },
  {
    id: "anesthesiology",
    name: "Anesthesiology",
    icon: "💉",
    color: "bg-red-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 4 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 3 },
    ],
  },
  {
    id: "radiology",
    name: "Radiology",
    icon: "📸",
    color: "bg-slate-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 0 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 4 },
    ],
  },
  {
    id: "dermatology",
    name: "Dermatology",
    icon: "🩺",
    color: "bg-orange-400",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 0 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 4 },
    ],
  },
  {
    id: "psychiatry",
    name: "Psychiatry",
    icon: "🧠",
    color: "bg-purple-500",
    chapters: [
      { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: 1 },
      { id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: 5 },
    ],
  },
];

