/**
 * Opciones de KaTeX: nunca rompe el documento; los errores se marcan
 * como chips editables (ver rehype-katex-errors.ts).
 * Tipadas de forma laxa a propósito: rehype-katex no reexporta KatexOptions.
 */
export const KATEX_OPTIONS = {
  throwOnError: false,
  strict: false,
  errorColor: 'currentColor',
  output: 'html' as const,
};
