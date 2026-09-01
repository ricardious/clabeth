import type { PositionedGlyph } from './canvas-types';

/**
 * Usa el layout real de Markdown para obtener las cajas de cada carácter.
 * No dibuja ni muta contenido: convierte el DOM medido en datos para el motor.
 */
export function collectPositionedGlyphs(
  source: HTMLElement,
  page: HTMLElement,
  /** Tinta a usar si el DOM no declara `--hand-ink-id` (la del texto). */
  fallbackInkId = 'grafito',
): PositionedGlyph[] {
  const pageRect = page.getBoundingClientRect();
  const scaleX = pageRect.width / page.offsetWidth || 1;
  const scaleY = pageRect.height / page.offsetHeight || 1;
  const glyphs: PositionedGlyph[] = [];

  source.querySelectorAll<HTMLElement>('.jw').forEach((word) => {
    const textNode = Array.from(word.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
    if (!textNode?.textContent) return;
    const computed = window.getComputedStyle(word);
    const fontSize = Number.parseFloat(computed.fontSize) || 16;
    const font = `${computed.fontStyle} ${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
    // El CSS decide qué tinta lleva cada parte (los títulos redefinen
    // `--hand-ink-id`); aquí solo se lee lo que ya resolvió el navegador.
    const inkId = computed.getPropertyValue('--hand-ink-id').trim() || fallbackInkId;
    let utf16Offset = 0;

    for (const char of Array.from(textNode.textContent)) {
      const range = window.document.createRange();
      const nextOffset = utf16Offset + char.length;
      range.setStart(textNode, utf16Offset);
      range.setEnd(textNode, nextOffset);
      const rect = range.getBoundingClientRect();
      utf16Offset = nextOffset;
      if (rect.width <= 0 || rect.height <= 0) continue;
      glyphs.push({
        char,
        x: (rect.left - pageRect.left) / scaleX,
        y: (rect.top - pageRect.top) / scaleY,
        width: rect.width / scaleX,
        height: rect.height / scaleY,
        font,
        fontSize,
        inkId,
      });
    }
  });

  return glyphs;
}
