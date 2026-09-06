export type ExplainMode = 'Professor' | 'Teacher' | 'Friend' | 'Beginner' | 'Interview' | 'Story';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  streakDays: number;
  isPro: boolean;
}

export interface DocumentSource {
  id: string;
  name: string;
  pages: number;
  size: string;
  uploadedAt: string;
  status: 'Processing' | 'AI Ready' | 'Failed';
  chunksCount: number;
}

export interface Citation {
  file: string;
  page: string;
  similarity: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  intent?: string;
  agent?: string;
  citation?: Citation;
  confidence?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export interface QuizResult {
  totalQuestions: number;
  score: number;
  accuracy: number;
  weakTopics: string[];
}

export interface SummaryOutput {
  id: string;
  sourceDoc: string;
  format: 'Bullet Notes' | 'Exam Notes' | 'Flashcards' | 'One Minute Revision';
  content: string;
  generatedAt: string;
}
