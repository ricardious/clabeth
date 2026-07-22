import type { HandwritingConfig } from './handwriting';
import type { PaperConfig } from './paper';

export interface ClabethDocument {
  id: string;
  title: string;
  content: string;
  handwriting: HandwritingConfig;
  paper: PaperConfig;
  createdAt: number;
  updatedAt: number;
}

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';
