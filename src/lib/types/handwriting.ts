/** Apariencia de las fórmulas LaTeX. */
export type FormulaStyle = 'tipografica' | 'sutil' | 'manuscrita';

/** Configuración manuscrita de un documento. */
export interface HandwritingConfig {
  /** Familia manuscrita: id del catálogo (reenie, patrick, ...). */
  fontId: string;
  /** Tamaño en px. */
  fontSize: number;
  /** Interlineado (unitario). */
  lineHeight: number;
  /** Espaciado entre letras en px. */
  letterSpacing: number;
  /** Espaciado entre palabras en px. */
  wordSpacing: number;
  /** Inclinación en grados (skew por palabra). */
  slant: number;
  /** Grosor 300–700. */
  weight: number;
  /** Tinta: id del catálogo (grafito, azul, rojo, ...). */
  inkId: string;
  /**
   * Tinta de los títulos. Los documentos anteriores a este campo no la tienen
   * y usan la del texto, de modo que su aspecto no cambia: léela siempre con
   * `getHeadingInkId`.
   */
  headingInkId?: string;
  /** Opacidad de la tinta 0.4–1. */
  opacity: number;
  /** Amplitud de variación vertical por palabra en px. */
  jitterY: number;
  /** Amplitud de rotación por palabra en grados. */
  jitterRot: number;
  /**
   * Cómo se dibujan las fórmulas:
   * - `manuscrita`: letras y dígitos en la fuente manuscrita; los símbolos
   *   (∑ ∫ √ …) caen en los glifos precisos de KaTeX; con inclinación del texto.
   * - `sutil`: tipografía KaTeX intacta, pero con la inclinación y la tinta.
   * - `tipografica`: apariencia tipográfica estándar de KaTeX.
   */
  formulaStyle: FormulaStyle;
}

export interface HandwritingPreset {
  id: string;
  name: string;
  description: string;
  config: HandwritingConfig;
}

export interface HandwritingFont {
  id: string;
  name: string;
  /** Stack CSS usable como valor de font-family. */
  family: string;
  weights: number[];
}

export interface InkColor {
  id: string;
  name: string;
  /** Variable CSS que contiene el color (p. ej. --ink-rojo). */
  token: string;
}
