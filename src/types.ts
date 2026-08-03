export interface StudentInfo {
  name: string;
  grade: string;
  school: string;
  targetUniversity: string;
  targetFaculty: string;
  examType: string;
  qualificationGoal: string;
  teacherMemo: string;
}

export interface GoalsAndDeadline {
  mainGoals: string[];
  shortTermGoals: string;
  examDate: string;
  planStartDate: string;
  planEndDate: string;
  currentDevScore: string;
  currentEikenScore: string;
  strongSkills: string;
  weakSkills: string;
  pastFailureReason: string;
  topPriorityTask: string;
}

export interface TimeAvailability {
  wakeTime: string; // e.g. "06:00"
  bedTime: string;  // e.g. "22:00"
  maxStudyMinutes: number; // e.g. 480 (8 hours)
  weekdayWeekendDiff: string;
  clubActivity: string;
  schoolHomework: string;
  extracurricular: string;
  outings: string;
  restDays: string;
  preferredStartTime: string;
  preferredEndTime: string;
}

export type EnglishSkillKey =
  | 'vocab'
  | 'grammar'
  | 'intensiveReading'
  | 'readingPractice'
  | 'listening'
  | 'summary'
  | 'essay'
  | 'shadowing'
  | 'review'
  | 'logging'
  | 'other';

export interface EnglishSkillAllocation {
  skillKey: EnglishSkillKey;
  skillName: string;
  isUsed: boolean;
  minutesPerDay: number;
  timesPerWeek: number;
  splitCount: number;
  priority: 'high' | 'medium' | 'low';
  preferredTimeSlot: string;
  teacherMemo: string;
}

export type OtherSubjectKey =
  | 'japanese'
  | 'math'
  | 'science'
  | 'social'
  | 'info'
  | 'essay'
  | 'interview'
  | 'homework'
  | 'other';

export interface OtherSubjectAllocation {
  subjectKey: OtherSubjectKey;
  subjectName: string;
  isUsed: boolean;
  minutesPerDay: number;
  teacherMemo: string;
}

export interface Material {
  id: string;
  skillKey: EnglishSkillKey | string;
  name: string;
  publisher: string;
  targetLevel: string;
  role: 'main' | 'sub';
  currentLocation: string;
  targetLocation: string;
  dailyRange: string;
  weeklyRange: string;
  purpose: string;
  teacherMemo: string;
}

export interface StudyMethodTemplate {
  skillKey: EnglishSkillKey | string;
  skillName: string;
  title: string;
  steps: string[];
  timePerSession: number; // minutes
  dailyFrequency: number;
  reviewDays: string;
  completionCriteria: string;
  fallbackAction: string;
  teacherAdditionalNotes: string;
}

export interface EnvironmentRules {
  lifestyle: {
    fixWakeTime: boolean;
    fixBedTime: boolean;
    decideNextDayScope: boolean;
    startRightAfterBreakfast: boolean;
    noLateNightCatchup: boolean;
    setRestDay: boolean;
    notes: string;
  };
  phone: {
    keepInOtherRoom: boolean;
    handToFamily: boolean;
    fixedChargingPlace: boolean;
    turnOffNotifications: boolean;
    noSnsInBreaks: boolean;
    allowedTimeWindow: string;
    notes: string;
  };
  aiSearch: {
    useQuestionNotebook: boolean;
    fixedAiTimeSlots: string[]; // e.g. ["11:25", "17:15"]
    writeDraftOnPaperFirst: boolean;
    askOneByOne: boolean;
    closeScreenAfterAnswer: boolean;
    solveBySelfAgain: boolean;
    noDirectSubmission: boolean;
    notes: string;
  };
  reporting: {
    reportToFriend: boolean;
    recordOnStudyplus: boolean;
    reportToTeacher: boolean;
    reportToParents: boolean;
    sendPhotoOfRecordSheet: boolean;
    reportTimeSlot: string; // e.g. "17:15-17:25"
    notes: string;
  };
  minimumDayPlan: {
    isConfigured: boolean;
    totalMinutes: number;
    breakdown: { skillName: string; minutes: number; materialName: string }[];
    rules: string[];
    notes: string;
  };
  ttsSettings?: {
    selectedModels: string[];
    selectedCategories: string[];
    template: string;
    voice: string;
    speed: number;
    pitch: number;
    isCustom: boolean;
    customPresets: Array<{ name: string; voice: string; speed: number; pitch: number }>;
  };
}

export interface ValidationItem {
  id: string;
  type: 'error' | 'warning';
  message: string;
  fixAdvice: string;
}

export interface PrescriptionPlan {
  id: string;
  planTitle: string;
  createdAt: string;
  updatedAt: string;
  student: StudentInfo;
  goals: GoalsAndDeadline;
  availability: TimeAvailability;
  englishAllocations: EnglishSkillAllocation[];
  otherSubjectAllocations: OtherSubjectAllocation[];
  materials: Material[];
  studyMethods: StudyMethodTemplate[];
  environment: EnvironmentRules;
  teacherGeneralNotes: string;
  uncertainties: string[];
  ignoredWarningIds: string[];
  weeklyTempPlan?: {
    enabled: boolean;
    weeklyGoal: string;
    dailyDurationHours: number;
    mindfulNotes: string;
    advanceNotices: string;
    selectedMindfulPresets: string[];
    customTasks?: { name: string; durationMinutes: number }[];
  };
}

export interface SavedPlanMeta {
  id: string;
  planTitle: string;
  studentName: string;
  updatedAt: string;
}
