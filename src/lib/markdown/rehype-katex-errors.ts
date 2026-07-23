import { visitParents } from 'unist-util-visit-parents';
import type { Root } from 'hast';

/**
 * Convierte los fallos de KaTeX (renderizados con throwOnError:false) en un
 * chip comprensible: conserva el código original y explica el problema
 * en el tooltip, sin romper el resto del documento.
 */
export function rehypeKatexErrors() {
  return (tree: Root): void => {
    visitParents(tree, 'element', (node) => {
      const classes = node.properties?.className;
      if (!Array.isArray(classes) || !classes.includes('katex-error')) return;

      const detail = typeof node.properties?.title === 'string' ? node.properties.title : '';
      node.properties = {
        className: ['latex-error-chip'],
        title: detail === '' ? 'Fórmula LaTeX inválida' : `Fórmula LaTeX inválida — ${detail}`,
      };
    });
  };
}
