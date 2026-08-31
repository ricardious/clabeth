import type { SaveState } from '../../lib/types/document';
import { formatNumber } from '../../lib/utils/format';
import { SaveStatus } from '../molecules/SaveStatus';

export interface StatusBarProps {
  words: number;
  characters: number;
  pages: number;
  saveState: SaveState;
  saveError?: string | null;
}

export function StatusBar({ words, characters, pages, saveState, saveError }: StatusBarProps) {
  return (
    <div className="flex h-[var(--statusbar-h)] shrink-0 items-center gap-3 border-t border-outline bg-surface px-3 text-xs text-muted">
      <SaveStatus state={saveState} error={saveError} />
      <span className="ml-auto tabular-nums">
        {formatNumber(words)} palabras · {formatNumber(characters)} caracteres · ≈ {pages}{' '}
        {pages === 1 ? 'página' : 'páginas'}
      </span>
    </div>
  );
}
