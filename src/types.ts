export type LatinCountry =
  | "Mexico"
  | "México"
  | "Colombia"
  | "Peru"
  | "Perú"
  | "Chile"
  | "Argentina"
  | "Ecuador"
  | "Guatemala"
  | "Bolivia"
  | "Otro";

export interface TargetExamProfile {
  id: string;
  country: LatinCountry;
  countryFlag: string;
  universityName: string;
  examName: string;
  maxScore: number;
  passingScoreAvg: number;
  subjects: string[];
  description: string;
  examDurationMinutes: number;
  totalQuestions: number;
}

export type PreparationDuration = 2 | 3 | 6 | 9 | 12; // Months

export interface UserPlan {
  id: string;
  studentName: string;
  targetCountry: LatinCountry;
  targetUniversity: string;
  targetExamName: string;
  targetCareer: string;
  durationMonths: PreparationDuration;
  startDate: string; // ISO string
  examDate: string; // ISO string
  dailyStudyHoursGoal: number;
  weakSubjects: string[];
  currentStreakDays: number;
  totalStudyMinutes: number;
}

export interface DailyTask {
  id: string;
  date: string; // YYYY-MM-DD
  subject: string;
  topic: string;
  estimatedMinutes: number;
  completed: boolean;
  priority: "Alta" | "Media" | "Baja";
  notes?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  subject?: string;
}

export interface SimulacroResult {
  id: string;
  date: string;
  title: string;
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  projectedExamScore: number;
  timeSpentSeconds: number;
  weakTopicsIdentified: string[];
}

export interface SubjectProgress {
  subject: string;
  masteryPercentage: number;
  completedTasks: number;
  totalTasks: number;
  color: string;
}

// --- USER MANAGEMENT MODULE TYPES ---
export type UserRole = "admin" | "student" | "parent";
export type UserStatus = "activo" | "pendiente" | "inactivo";

export interface ParentNotification {
  id: string;
  sentAt: string;
  recipientEmail: string;
  subject: string;
  summaryText: string;
  simulacrosAvg: number;
  tasksCompletedPercentage: number;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  registeredAt: string;
  targetUniversity: string;
  targetCareer: string;
  simulacrosCompletedCount: number;
  averageScorePercentage: number;
  lastActive: string;
  // Parent / Guardian monitoring details
  parentName?: string;
  parentEmail?: string;
  linkedStudentId?: string; // For parent accounts
  parentNotificationsHistory?: ParentNotification[];
}

// --- QUESTION REPOSITORY & UNIVERSITY MODULE TYPES ---
export interface BankQuestion {
  id: string;
  universityId: string; // e.g. "unmsm", "pucp", "uni", "unalm", "ulima", "upch"
  universityName: string; // e.g. "UNMSM (San Marcos)"
  subject: string; // e.g. "Matemáticas", "Física", "Química", "Razonamiento Verbal"
  topic: string;
  difficulty: "Fácil" | "Intermedio" | "Avanzado" | "Nivel Cachimbo";
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  createdAt: string;
}

export interface UniversityItem {
  id: string;
  name: string;
  shortName: string;
  country: string;
  logoEmoji: string;
  description: string;
  badgeColor: string;
  careers: string[];
}

