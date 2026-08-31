import type { ClabethDocument } from './types/document';
import type { HandwritingConfig } from './types/handwriting';
import type { PaperConfig } from './types/paper';
import { createId } from './utils/id';
import { getPreset } from './handwriting/presets';
import { DEFAULT_PAPER, getPaperStyle } from './paper/styles';

export interface DocumentDefaults {
  presetId: string;
  paperStyle: string;
}

export function defaultHandwriting(presetId: string): HandwritingConfig {
  return { ...getPreset(presetId).config };
}

export function defaultPaper(styleId: string): PaperConfig {
  const style = getPaperStyle(styleId);
  return { ...DEFAULT_PAPER, style: style.id, marginLine: style.hasMarginLine };
}

export function createDocument(
  overrides: Partial<Pick<ClabethDocument, 'title' | 'content'>> & {
    presetId?: string;
    paperStyle?: string;
  } = {},
): ClabethDocument {
  const now = Date.now();
  return {
    id: createId(),
    title: overrides.title ?? 'Sin título',
    content: overrides.content ?? '',
    handwriting: defaultHandwriting(overrides.presetId ?? 'clara'),
    paper: defaultPaper(overrides.paperStyle ?? 'libreta'),
    createdAt: now,
    updatedAt: now,
  };
}
