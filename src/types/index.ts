export type AppTheme = 'default' | 'emerald' | 'rose' | 'amber' | 'ocean';
export type AppFont = 'Inter' | 'Playfair Display' | 'JetBrains Mono' | 'Quicksand';
export type AppShape = 'sharp' | 'default' | 'rounded';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  difficulty: string;
}

export interface FlashcardItem {
  q: string;
  a: string;
}

export interface KeyTerm {
  term: string;
  meaning: string;
  example: string;
}

export interface ImportantQuestion {
  question: string;
  answer: string;
  marks: 1 | 3 | 5;
}

export interface NoteSection {
  title: string;
  content: string;
}

export interface MindMapData {
  mermaidCode: string;
}

export interface StudyPackData {
  meta: {
    subject: string;
    grade: string;
    chapter_title: string;
    language: string;
  };
  summary: {
    tl_dr: string;
    important_points: string[];
  };
  notes: NoteSection[];
  key_terms: KeyTerm[];
  flashcards: FlashcardItem[];
  quiz: {
    instructions: string;
    questions: QuizQuestion[];
  };
  important_questions?: ImportantQuestion[];
  mind_map?: MindMapData;
}

export interface StudyPack extends StudyPackData {
  id: string;
  user_id: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  theme: AppTheme;
  font: AppFont;
  shape: AppShape;
}

export interface UserInput {
  grade: string;
  subject: string;
  chapterTitle: string;
  language: string;
  chapterText: string;
  pdfFile?: File;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
