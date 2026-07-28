import { memo, useMemo, useState } from 'react';
import katex from 'katex';
import { ChevronDown } from 'lucide-react';
import { LATEX_CATEGORIES, LATEX_SNIPPETS, type LatexSnippet } from '../../lib/latex/snippets';
import { SearchField } from '../molecules/SearchField';
import { cn } from '../../lib/utils/cn';

export const KatexPreview = memo(function KatexPreview({ latex }: { latex: string }) {
  const html = useMemo(
    () => katex.renderToString(latex, { throwOnError: false, output: 'html', displayMode: false }),
    [latex],
  );
  return (
    <span
      aria-hidden
      className="pointer-events-none block max-w-full overflow-hidden text-[13px] text-foreground [&_.katex]:text-[1em]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

export interface LatexPaletteProps {
  onInsert: (snippet: LatexSnippet) => void;
}

/** Catálogo de fórmulas LaTeX con vista previa, listo para insertar. */
export function LatexPalette({ onInsert }: LatexPaletteProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === '') return LATEX_SNIPPETS;
    return LATEX_SNIPPETS.filter(
      (snippet) => snippet.label.toLowerCase().includes(q) || snippet.latex.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-outline p-3">
        <SearchField value={query} onChange={setQuery} placeholder="Buscar fórmula…" ariaLabel="Buscar fórmula LaTeX" />
        <p className="mt-2 text-xs text-muted">Toca una fórmula para insertarla en el cursor.</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {LATEX_CATEGORIES.map((category, catIndex) => {
          const items = filtered.filter((snippet) => snippet.category === category);
          if (items.length === 0) return null;
          return (
            <details key={category} open={query !== '' || catIndex === 0} className="group mb-1">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-1.5 text-[13px] font-medium text-foreground hover:bg-panel [&::-webkit-details-marker]:hidden">
                {category}
                <ChevronDown size={14} aria-hidden className="text-muted transition-transform group-open:rotate-180" />
              </summary>
              <div className="grid grid-cols-2 gap-1 p-1">
                {items.map((snippet) => (
                  <button
                    key={snippet.id}
                    type="button"
                    title={`${snippet.label} — ${snippet.latex}`}
                    onClick={() => onInsert(snippet)}
                    className={cn(
                      'flex h-12 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-md border border-outline bg-surface px-1',
                      'transition-colors duration-[var(--dur-fast)] hover:border-outline-strong hover:bg-panel',
                    )}
                  >
                    <KatexPreview latex={snippet.latex} />
                    <span className="max-w-full truncate text-[10.5px] text-muted">{snippet.label}</span>
                  </button>
                ))}
              </div>
            </details>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-muted">Sin fórmulas para «{query}».</p>
        )}
      </div>
    </div>
  );
}
