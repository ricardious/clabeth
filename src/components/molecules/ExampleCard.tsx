import type { CSSProperties, ReactNode } from 'react';
import type { HandwritingConfig } from '../../types/handwriting';
import type { MdBlock } from '../../lib/markdown/blocks';
import { DEFAULT_HANDWRITING } from '../../lib/handwriting/presets';
import { handCssVars } from '../../lib/handwriting/css-vars';
import { MarkdownBlock } from '../organisms/MarkdownBlock';
import { cn } from '../../lib/utils/cn';

export interface ExampleCardProps {
  title: string;
  source: string;
  /** Opcional: permite mostrar el código y la hoja lado a lado. */
  children?: ReactNode;
  className?: string;
}

const GUIDE_HAND: HandwritingConfig = { ...DEFAULT_HANDWRITING, fontSize: 19 };

const block: MdBlock = { key: 'guia', markdown: '', pageBreak: false, keepWithNext: false };

/**
 * Muestra el código Markdown junto a su versión manuscrita, para las guías.
 */
export function ExampleCard({ title, source, children, className }: ExampleCardProps) {
  return (
    <section
      aria-label={title}
      className={cn('rounded-lg border border-outline bg-surface shadow-panel', className)}
    >
      <h3 className="border-b border-outline px-4 py-2.5 font-display text-[15px] font-semibold text-foreground-strong">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
        <pre className="overflow-x-auto border-b border-outline bg-panel p-4 font-mono text-[12.5px] leading-relaxed text-foreground lg:border-b-0 lg:border-r">
          {source}
        </pre>
        <div
          aria-label="Resultado manuscrito"
          className="paper-bg paper-libreta hand-scope min-h-[120px] p-4"
          style={{
            ...handCssVars(GUIDE_HAND),
            '--_line-h': `${GUIDE_HAND.fontSize * GUIDE_HAND.lineHeight}px`,
            '--_line-offset': '16px',
            borderTopLeftRadius: 0,
          } as CSSProperties}
        >
          {children ?? <MarkdownBlock block={{ ...block, markdown: source }} seed="guia" hand={GUIDE_HAND} />}
        </div>
      </div>
    </section>
  );
}
