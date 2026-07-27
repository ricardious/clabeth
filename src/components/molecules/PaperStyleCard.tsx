import type { CSSProperties } from 'react';
import type { PaperStyleDef } from '../../types/paper';
import { cn } from '../../lib/utils/cn';

export interface PaperStyleCardProps {
  style: PaperStyleDef;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function PaperStyleCard({ style, selected, onSelect }: PaperStyleCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(style.id)}
      className={cn(
        'w-full rounded-md border p-2 text-left transition-colors duration-[var(--dur-fast)]',
        selected
          ? 'border-focus-ring bg-primary-soft/40'
          : 'border-outline bg-surface hover:border-outline-strong',
      )}
    >
      <span
        aria-hidden
        className={cn('block h-12 w-full rounded-sm border border-outline paper-bg', `paper-${style.id}`)}
        style={{ '--_line-h': '10px', '--_grid': '8px', '--_line-offset': '6px' } as CSSProperties}
      />
      <span className="mt-1.5 block text-[13px] font-medium text-foreground">{style.name}</span>
    </button>
  );
}
