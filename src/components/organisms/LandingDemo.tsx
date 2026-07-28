import { useMemo, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import type { MdBlock } from '../../lib/markdown/blocks';
import { splitIntoBlocks } from '../../lib/markdown/blocks';
import { DEFAULT_HANDWRITING } from '../../lib/handwriting/presets';
import { handCssVars } from '../../lib/handwriting/css-vars';
import { MarkdownBlock } from './MarkdownBlock';
import { cn } from '../../lib/utils/cn';

const DEMO_CONTENT = `## Cómo funciona

Escribe **Markdown** aquí y mira la hoja de la derecha. La energía se expresa como $E = mc^2$.

$$
f'(x) = \\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h}
$$

- [x] Markdown a escritura manuscrita
- [ ] Fórmulas LaTeX precisas
- [ ] Exportar a PDF`;

const DEMO_HAND = { ...DEFAULT_HANDWRITING, fontSize: 21, jitterY: 1.2, jitterRot: 0.5 };

/**
 * Demo funcional de la portada: un mini editor Markdown que se convierte
 * en escritura manuscrita en tiempo real. No es una maqueta: procesa de verdad.
 */
export function LandingDemo() {
  const [content, setContent] = useState(DEMO_CONTENT);

  const blocks = useMemo(() => splitIntoBlocks(content), [content]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1.15fr] lg:items-start">
      {/* Editor */}
      <div className="overflow-hidden rounded-lg border border-outline bg-surface shadow-panel">
        <div className="flex items-center gap-1.5 border-b border-outline bg-panel px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[color-mix(in_oklch,var(--primary)_55%,transparent)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[color-mix(in_oklch,var(--accent)_60%,transparent)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-outline-strong" />
          <span className="ml-2 text-[11px] text-muted">apuntes.md</span>
        </div>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          aria-label="Demo: escribe tu Markdown"
          spellCheck={false}
          className="editor-textarea block h-64 w-full resize-none bg-surface p-3.5 font-mono text-[13px] leading-relaxed text-foreground placeholder:text-muted focus-visible:outline-none"
        />
      </div>

      {/* Flecha de transformación */}
      <div className="flex items-center justify-center self-center text-primary lg:flex-col">
        <span className="hidden rounded-full border border-outline bg-surface p-2 lg:inline-flex" aria-hidden>
          <ArrowRight size={18} />
        </span>
        <span className="inline-flex rounded-full border border-outline bg-surface p-2 lg:hidden" aria-hidden>
          <ArrowDown size={18} />
        </span>
      </div>

      {/* Hoja manuscrita */}
      <div className="overflow-hidden rounded-lg shadow-pop">
        <div
          className={cn('page paper-libreta has-margin-line w-full')}
          style={
            {
              '--_page-w': '100%',
              '--_page-h': '320px',
              ...handCssVars(DEMO_HAND, 24),
              '--_line-offset': '26px',
              borderRadius: 8,
            } as CSSProperties
          }
        >
          <div className="page-margin-line" aria-hidden />
          <div className="page-content hand-scope" style={{ top: 22, bottom: 18, left: 'var(--paper-margin-inline-start)', right: 'var(--paper-margin-inline)' }}>
            {blocks.map((block: MdBlock) => (
              <MarkdownBlock key={block.key} block={block} seed="landing" hand={DEMO_HAND} />
            ))}
            {content.trim() === '' && (
              <p className="text-muted">Escribe arriba y tu hoja aparecerá aquí.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
