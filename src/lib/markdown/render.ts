import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import { toHtml } from 'hast-util-to-html';
import type { HandwritingConfig } from '../types/handwriting';
import { KATEX_OPTIONS } from './pipeline';
import { rehypeKatexErrors } from './rehype-katex-errors';
import { rehypeJitter } from './rehype-jitter';

/** Render Markdown/LaTeX en el servidor para páginas Astro sin runtime React. */
export async function renderMarkdown(source: string, seed: string, hand: HandwritingConfig): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex, KATEX_OPTIONS)
    .use(rehypeKatexErrors)
    .use(rehypeJitter, {
      seed,
      jitterY: hand.jitterY,
      jitterRot: hand.jitterRot,
      slant: hand.slant,
    });

  const mdast = processor.parse(source);
  const hast = await processor.run(mdast);
  return toHtml(hast);
}
