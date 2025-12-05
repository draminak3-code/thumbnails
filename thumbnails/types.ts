export interface ReferenceImage {
  base64: string; // The raw base64 string without prefix
  mimeType: string;
  previewUrl: string; // The full data URL for display
}

export enum ThumbnailStyle {
  REALISTIC = 'Realistic & High Quality',
  CARTOON_3D = '3D Pixar/Disney Style',
  COMIC_BOOK = 'Bold Comic Book',
  NEON_CYBERPUNK = 'Neon Cyberpunk / Gamer',
  EXPRESSIVE_ILLUSTRATION = 'Expressive Digital Art',
  MINIMALIST = 'Clean & Minimalist'
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface GenerationConfig {
  concept: string;
  style: ThumbnailStyle;
  referenceImage: ReferenceImage | null;
}

// Augment window for AI Studio API key picker
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}