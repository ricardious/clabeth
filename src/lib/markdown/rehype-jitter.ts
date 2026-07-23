import type { Element, ElementContent, Root } from 'hast';
import { needsWordSpans, wordVariation } from '../handwriting/jitter';

export interface RehypeJitterOptions {
  /** Semilla por documento: la misma entrada siempre produce la misma hoja. */
  seed: string;
  jitterY: number;
  jitterRot: number;
  slant: number;
}

const SKIP_TAGS = new Set(['code', 'pre', 'script', 'style', 'textarea', 'math', 'annotation']);

function isSkipped(element: Element): boolean {
  if (SKIP_TAGS.has(element.tagName)) return true;
  const classes = element.properties?.className;
  if (!Array.isArray(classes)) return false;
  return classes.some((cls) => {
    const name = String(cls);
    return name.startsWith('katex') || name === 'latex-error-chip';
  });
}

/**
 * Envuelve cada palabra en un span .jw con variación determinista.
 * Las fórmulas KaTeX y el código quedan intactos para conservar precisión.
 * Recorre el árbol construyendo un array nuevo por elemento (sin mutar
 * mientras se itera), lo que evita los problemas de unist-util-visit.
 */
export function rehypeJitter(options: RehypeJitterOptions) {
  const { seed, jitterY, jitterRot, slant } = options;

  return (tree: Root): void => {
    if (!needsWordSpans(jitterY, jitterRot, slant)) return;
    let wordIndex = 0;

    const processElement = (element: Element): void => {
      if (isSkipped(element)) return;

      const replacement: ElementContent[] = [];
      for (const child of element.children) {
        if (child.type === 'text') {
          if (!/\S/.test(child.value)) {
            replacement.push(child);
            continue;
          }
          const parts = child.value.split(/(\s+)/);
          for (const part of parts) {
            if (part === '') continue;
            if (/^\s+$/.test(part)) {
              replacement.push({ type: 'text', value: part });
              continue;
            }
            const variation = wordVariation(seed, wordIndex, jitterY, jitterRot);
            wordIndex += 1;
            replacement.push({
              type: 'element',
              tagName: 'span',
              properties: {
                className: ['jw'],
                style: `--jy:${variation.dy}px;--jr:${variation.rot}deg;--js:${slant}deg`,
              },
              children: [{ type: 'text', value: part }],
            });
          }
        } else if (child.type === 'element') {
          processElement(child);
          replacement.push(child);
        } else {
          replacement.push(child);
        }
      }
      element.children = replacement;
    };

    for (const child of tree.children) {
      if (child.type === 'element') processElement(child);
    }
  };
}
