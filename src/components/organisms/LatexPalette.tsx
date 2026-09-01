import { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import katex from 'katex';
import { ChevronDown } from 'lucide-react';
import { LATEX_CATEGORIES, LATEX_SNIPPETS, type LatexSnippet } from '../../lib/latex/snippets';
import { SearchField } from '../molecules/SearchField';
import { cn } from '../../lib/utils/cn';

/**
 * Vista previa de una fórmula, reducida hasta caber entera en su tarjeta.
 *
 * Las tarjetas del catálogo miden lo mismo, pero las fórmulas no: una matriz
 * 3×3 ocupa tres veces el alto de `\alpha`, y una función a trozos se sale de
 * ancho. Antes se recortaban con `overflow: hidden` y quedaban ilegibles; ahora
 * se escalan.
 *
 * La medida usa `offsetWidth`/`offsetHeight`, que son valores de maquetación y
 * `transform: scale()` no los altera. Así se lee siempre el tamaño natural sin
 * tener que quitar la escala para medir y volver a ponerla.
 */
export const KatexPreview = memo(function KatexPreview({ latex }: { latex: string }) {
  const html = useMemo(
    () => katex.renderToString(latex, { throwOnError: false, output: 'html', displayMode: false }),
    [latex],
  );
  const boxRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);

  const fit = useCallback((): void => {
    const box = boxRef.current;
    const content = contentRef.current;
    if (!box || !content) return;

    const natural = { width: content.offsetWidth, height: content.offsetHeight };
    const available = { width: box.clientWidth, height: box.clientHeight };
    if (!natural.width || !natural.height || !available.width || !available.height) return;

    const next = Math.min(1, available.width / natural.width, available.height / natural.height);
    // Nunca se agranda una fórmula pequeña, solo se reduce la que no cabe.
    setScale((current) => (Math.abs(current - next) < 0.01 ? current : next));
  }, []);

  useLayoutEffect(() => {
    fit();
    // Las fuentes de KaTeX cambian las métricas: hay que medir otra vez cuando
    // terminan de cargar, o la primera medida sobre las de reserva se queda.
    void window.document.fonts?.ready.then(fit);

    // Cubre los dos momentos en que la caja cambia de tamaño: al redimensionar
    // el panel, y al desplegar una categoría (que arranca plegada, de modo que
    // la primera medida sería cero). El tamaño de la caja lo fija la tarjeta y
    // no su contenido, así que observarla no puede realimentarse.
    const observer = new ResizeObserver(fit);
    if (boxRef.current) observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, [fit, html]);

  return (
    <span
      ref={boxRef}
      aria-hidden
      className="pointer-events-none flex min-h-0 flex-1 items-center justify-center overflow-hidden text-[13px] text-foreground"
    >
      <span
        ref={contentRef}
        className="inline-block shrink-0 [&_.katex]:text-[1em]"
        style={scale === 1 ? undefined : { transform: `scale(${scale})` }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </span>
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
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-1.5 text-[13px] font-medium text-foreground hover:bg-hover [&::-webkit-details-marker]:hidden">
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
                      // Sin `items-center`: la vista previa ocupa todo el ancho
                      // de la tarjeta para tener contra qué escalarse.
                      'flex h-16 flex-col justify-center gap-0.5 overflow-hidden rounded-md border border-outline bg-surface px-1 py-1',
                      'transition-colors duration-[var(--dur-fast)] hover:border-outline-strong hover:bg-hover',
                    )}
                  >
                    <KatexPreview latex={snippet.latex} />
                    <span className="block max-w-full truncate text-center text-[10.5px] text-muted">
                      {snippet.label}
                    </span>
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
