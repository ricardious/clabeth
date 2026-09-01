import type { HandwritingConfig } from '../types/handwriting';
import type { PaperStyleId } from '../types/paper';

/** Glifo ya colocado por el navegador; el Canvas sólo cambia cómo se pinta. */
export interface PositionedGlyph {
  char: string;
  x: number;
  y: number;
  width: number;
  height: number;
  font: string;
  fontSize: number;
  /** Tinta con la que se pinta: la del texto o la de los títulos. */
  inkId: string;
}

export interface CanvasPaperConfig {
  style: PaperStyleId;
  baseColor: string;
  lineColor: string;
  marginColor: string;
  lineHeight: number;
  lineOffset: number;
  gridSize: number;
  marginX: number;
  textureUrl: string;
}

export interface HandwritingCanvasConfig {
  width: number;
  height: number;
  quality: number;
  seed: string;
  realismLevel: 1 | 2 | 3 | 4 | 5;
  glyphs: PositionedGlyph[];
  handwriting: HandwritingConfig;
  paper: CanvasPaperConfig;
}

export interface CanvasRenderMetrics {
  durationMs: number;
  glyphCount: number;
}
