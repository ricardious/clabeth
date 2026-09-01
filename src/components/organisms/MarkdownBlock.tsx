import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import type { HandwritingConfig } from '../../lib/types/handwriting';
import type { MdBlock } from '../../lib/markdown/blocks';
import { KATEX_OPTIONS } from '../../lib/markdown/pipeline';
import { rehypeKatexErrors } from '../../lib/markdown/rehype-katex-errors';
import { rehypeJitter } from '../../lib/markdown/rehype-jitter';

export interface MarkdownBlockProps {
  block: MdBlock;
  /** Semilla del jitter (normalmente el id del documento). */
  seed: string;
  hand: HandwritingConfig;
}

const REMARK_PLUGINS = [remarkGfm, remarkMath];

/**
 * `splitIntoBlocks` devuelve objetos nuevos en cada pasada, así que la
 * comparación por identidad no evitaría ningún trabajo: al escribir se
 * volverían a renderizar todos los bloques del documento. Comparando el
 * Markdown y los ajustes que afectan al dibujado, solo se rehace el bloque
 * que cambió.
 */
function sameBlock(previous: MarkdownBlockProps, next: MarkdownBlockProps): boolean {
  return (
    previous.block.markdown === next.block.markdown &&
    previous.block.key === next.block.key &&
    previous.block.pageBreak === next.block.pageBreak &&
    previous.seed === next.seed &&
    previous.hand.jitterY === next.hand.jitterY &&
    previous.hand.jitterRot === next.hand.jitterRot &&
    previous.hand.slant === next.hand.slant
  );
}

/** Renderiza un bloque Markdown/LaTeX con la apariencia manuscrita. */
export const MarkdownBlock = memo(function MarkdownBlock({ block, seed, hand }: MarkdownBlockProps) {
  // Evita repetir el mismo patrón al inicio de cada bloque Markdown.
  const blockSeed = `${seed}:${block.key}`;
  const rehypePlugins = useMemo(
    () =>
      [
        [rehypeKatex, KATEX_OPTIONS],
        rehypeKatexErrors,
        [rehypeJitter, { seed: blockSeed, jitterY: hand.jitterY, jitterRot: hand.jitterRot, slant: hand.slant }],
      ] as never,
    [blockSeed, hand.jitterY, hand.jitterRot, hand.slant],
  );

  if (block.pageBreak) return null;

  return (
    <ReactMarkdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={rehypePlugins}>
      {block.markdown}
    </ReactMarkdown>
  );
}, sameBlock);
