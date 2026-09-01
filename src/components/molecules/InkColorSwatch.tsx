import { Check } from 'lucide-react';
import type { InkColor } from '../../lib/types/handwriting';
import { cn } from '../../lib/utils/cn';

export interface InkColorSwatchProps {
  ink: InkColor;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function InkColorSwatch({ ink, selected, onSelect }: InkColorSwatchProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`Tinta ${ink.name}`}
      title={ink.name}
      onClick={() => onSelect(ink.id)}
      className={cn(
        // Disco de papel con la tinta dentro: sobre una superficie oscura, el
        // grafito queda a 1,07:1 y la muestra desaparecía por completo.
        'paper-bg flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform duration-[var(--dur-fast)]',
        selected ? 'scale-110 border-focus-ring' : 'border-outline hover:scale-105',
      )}
    >
      <span
        className="flex h-[22px] w-[22px] items-center justify-center rounded-full"
        // La tinta es una variable dinámica de escritura: se asigna aquí.
        style={{ backgroundColor: `var(${ink.token})` }}
      >
        {selected && <Check size={12} aria-hidden className="text-paper" />}
      </span>
    </button>
  );
}
