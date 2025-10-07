export interface User {
  id: string;
  email: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  role?: 'student' | 'teacher' | 'admin';
  completedAssessment: boolean;
  courseProgress: Record<string, number>;
  certificates: string[];
  created_at?: string | Date;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Module {
  id: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  labUrl?: string;
  completed: boolean;
  testScore?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  unlocked: boolean;
  progress: number;
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  tools: string[];
  instructions: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}