import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export interface MdBlock {
  key: string;
  /** Markdown original del bloque (recorte exacto del documento). */
  markdown: string;
  /** El bloque es un salto de página explícito (`\newpage`). */
  pageBreak: boolean;
  /** No debe quedar solo al final de una página (encabezados). */
  keepWithNext: boolean;
}

const parser = remark().use(remarkGfm).use(remarkMath);

export const PAGEBREAK_TOKEN = '\\newpage';

const PAGEBREAK_RE = /^\\newpage\s*$/;

/**
 * Divide el documento en bloques de primer nivel conservando el texto
 * original de cada uno. Es la unidad mínima del paginador.
 */
export function splitIntoBlocks(source: string): MdBlock[] {
  const trimmed = source.trim();
  if (trimmed === '') return [];

  const tree = parser.parse(source);
  const blocks: MdBlock[] = [];

  tree.children.forEach((node, index) => {
    const start = node.position?.start.offset ?? 0;
    const end = node.position?.end.offset ?? 0;
    const markdown = source.slice(start, end);

    if (node.type === 'paragraph' && PAGEBREAK_RE.test(markdown.trim())) {
      blocks.push({ key: `b${index}`, markdown: '', pageBreak: true, keepWithNext: false });
      return;
    }

    blocks.push({
      key: `b${index}`,
      markdown,
      pageBreak: false,
      keepWithNext: node.type === 'heading',
    });
  });

  return blocks;
}
