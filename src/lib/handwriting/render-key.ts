import type { HandwritingConfig } from '../types/handwriting';
import type { PaperConfig } from '../types/paper';

/** Identifica de forma estable la configuración visual aplicada a una hoja. */
export function previewRenderKey(handwriting: HandwritingConfig, paper: PaperConfig): string {
  return JSON.stringify([handwriting, paper]);
}
