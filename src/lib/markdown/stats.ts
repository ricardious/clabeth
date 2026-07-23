export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
}

/** Quita la sintaxis Markdown/LaTeX para contar palabras «de verdad». */
export function plainText(markdown: string): string {
  return markdown
    .replace(/\$\$[\s\S]*?\$\$/g, ' fórmula ')
    .replace(/\$[^$\n]*\$/g, ' fórmula ')
    .replace(/```[\s\S]*?```/g, ' código ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+\[[ xX]\]\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/__([^_]*)__/g, '$1')
    .replace(/_([^_]*)_/g, '$1')
    .replace(/~~([^~]*)~~/g, '$1')
    .replace(/^\|?[\s:-]*\|[\s|:-]*$/gm, '')
    .replace(/[|]/g, ' ')
    .replace(/^-{3,}\s*$/gm, ' ')
    .replace(/\\newpage/g, ' ');
}

export function textStats(markdown: string): TextStats {
  const text = plainText(markdown);
  const words = (text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? []).length;
  return {
    words,
    characters: markdown.length,
    charactersNoSpaces: markdown.replace(/\s/g, '').length,
  };
}

/**
 * Estimación heurística de páginas para las tarjetas de documentos.
 * La pantalla del editor usa el paginador real.
 */
export function estimatePages(
  words: number,
  fontSize: number,
  lineHeight: number,
  contentWidthPx: number,
  contentHeightPx: number,
): number {
  if (words === 0) return 1;
  const lineHeightPx = fontSize * lineHeight;
  const linesPerPage = Math.max(6, Math.floor(contentHeightPx / lineHeightPx));
  const wordsPerLine = Math.max(4, Math.round(contentWidthPx / (fontSize * 0.62)));
  const wordsPerPage = linesPerPage * wordsPerLine;
  return Math.max(1, Math.ceil(words / wordsPerPage));
}
