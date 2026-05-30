/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  viewCount: string;
  thumbnail: string;
}

export type ResourceType = 'Documentation' | 'Tutorial' | 'Article' | 'Guide';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  content?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  learningObjectives: string[];
  lessons: Lesson[];
  videos: YouTubeVideo[];
  resources: Resource[];
  exercises: string[];
}

export interface Phase {
  id: string;
  name: string; // e.g., 'Beginner Phase', 'Intermediate Phase', 'Advanced Phase'
  modules: Module[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  tags: string[];
  phases: Phase[];
  createdAt: string;
  enrollmentDate?: string;
  progressPercent: number;
  coverGradient: string;
}

export interface SavedResource extends Resource {
  roadmapId: string;
  roadmapTitle: string;
  moduleId: string;
  moduleTitle: string;
  savedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  skillLevel?: DifficultyLevel;
  learningGoals?: string;
  weeklyHours?: number;
  preferredCategories?: string[];
  isOnboarded: boolean;
  streakCount: number;
  lastActiveDate?: string;
  xpPoints: number;
  isPro: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  userAnswerIndex?: number;
}

export type QuizQuestionType = 'multiple_choice' | 'short_answer';

export interface ModuleQuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options?: string[];
  correctAnswerIndex?: number;
  explanation?: string;
  userAnswerIndex?: number;
  userShortAnswer?: string;
  feedbackGrading?: {
    isCorrect: boolean;
    score: number;
    feedback: string;
  };
}

export interface ActivityLog {
  id: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  completedItemsCount: number;
}
