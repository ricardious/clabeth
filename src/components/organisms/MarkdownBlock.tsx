import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { HandwritingConfig } from '../../types/handwriting';
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

/** Renderiza un bloque Markdown/LaTeX con la apariencia manuscrita. */
export const MarkdownBlock = memo(function MarkdownBlock({ block, seed, hand }: MarkdownBlockProps) {
  const rehypePlugins = useMemo(
    () =>
      [
        [rehypeKatex, KATEX_OPTIONS],
        rehypeKatexErrors,
        [rehypeJitter, { seed, jitterY: hand.jitterY, jitterRot: hand.jitterRot, slant: hand.slant }],
      ] as never,
    [seed, hand.jitterY, hand.jitterRot, hand.slant],
  );

  if (block.pageBreak) return null;

  return (
    <ReactMarkdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={rehypePlugins}>
      {block.markdown}
    </ReactMarkdown>
  );
});
