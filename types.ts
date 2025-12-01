export interface DictionaryEntry {
  id: string;
  term: string;
  definition: string;
  nativeLanguage: string;
  targetLanguage: string;
  phonetic?: string;
  imageUrl?: string;
  examples: ExampleSentence[];
  usageNote: string;
  pronunciationAudio?: string; // base64
  timestamp: number;
}

export interface ExampleSentence {
  original: string;
  translation: string;
  audio?: string; // base64
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export enum AppView {
  SEARCH = 'SEARCH',
  NOTEBOOK = 'NOTEBOOK',
  STUDY = 'STUDY',
}

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export type FlashcardSide = 'front' | 'back';