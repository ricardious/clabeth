import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { LATEX_CATEGORIES, LATEX_SNIPPETS, type LatexSnippet } from '../lib/latex/snippets';
import { KatexPreview } from '../components/organisms/LatexPalette';
import { IconButton } from '../components/atoms/IconButton';

function CopySnippet({ snippet }: { snippet: LatexSnippet }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (): void => {
    void navigator.clipboard?.writeText(snippet.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-outline bg-surface p-3 shadow-panel transition-colors hover:border-outline-strong">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="w-14 shrink-0 text-center">
          <KatexPreview latex={snippet.latex} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-foreground">{snippet.label}</p>
          <p className="truncate font-mono text-[11.5px] text-muted">{snippet.latex}</p>
        </div>
      </div>
      <IconButton
        label={copied ? 'Copiado' : `Copiar ${snippet.latex}`}
        size="sm"
        onClick={handleCopy}
        className="shrink-0"
      >
        {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      </IconButton>
    </div>
  );
}

export function LatexGuidePage() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground-strong">Guía de LaTeX</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          El catálogo de fórmulas de Clabeth. Copia el código o abrelo en el editor desde el
          panel de Fórmulas para insertarlo en el cursor.
        </p>
      </header>
      <div className="space-y-6">
        {LATEX_CATEGORIES.map((category) => {
          const items = LATEX_SNIPPETS.filter((snippet) => snippet.category === category);
          return (
            <section key={category} aria-label={category}>
              <h3 className="mb-2 font-display text-[15px] font-semibold text-foreground-strong">{category}</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {items.map((snippet) => (
                  <CopySnippet key={snippet.id} snippet={snippet} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
