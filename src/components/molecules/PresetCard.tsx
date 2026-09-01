import type { HandwritingPreset } from '../../lib/types/handwriting';
import { getHandwritingFont } from '../../lib/handwriting/fonts';
import { getInk } from '../../lib/handwriting/inks';
import { cn } from '../../lib/utils/cn';

export interface PresetCardProps {
  preset: HandwritingPreset;
  fontId: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function PresetCard({ preset, fontId, selected, onSelect }: PresetCardProps) {
  const font = getHandwritingFont(fontId);
  const ink = getInk(preset.config.inkId);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(preset.id)}
      className={cn(
        'w-full rounded-md border p-3 text-left transition-colors duration-[var(--dur-fast)]',
        selected
          ? 'border-focus-ring bg-primary-soft/40'
          : 'border-outline bg-surface hover:border-outline-strong',
      )}
    >
      {/* La muestra va sobre papel, no sobre la tarjeta: las tintas están
          pensadas para la hoja y ninguna llega al mínimo de contraste sobre una
          superficie oscura (la más clara, la roja, se queda en 2,2:1). El papel
          es claro en ambos temas, así que además previene lo que verás de
          verdad en la hoja. */}
      <span aria-hidden className="paper-bg block rounded-sm border border-outline px-2 py-1.5">
        <span
          className="block text-[19px] leading-tight"
          // La fuente activa se conserva; la tarjeta anticipa los demás ajustes del estilo.
          style={{
            fontFamily: font.family,
            color: `var(${ink.token})`,
            fontWeight: preset.config.weight,
            letterSpacing: `${preset.config.letterSpacing}px`,
            wordSpacing: `${preset.config.wordSpacing}px`,
            opacity: preset.config.opacity,
            transform: `skewX(${preset.config.slant}deg)`,
          }}
        >
          Escribir a mano
        </span>
      </span>
      <span className="mt-1.5 block text-[13px] font-medium text-foreground">{preset.name}</span>
      <span className="block text-xs text-muted">{preset.description}</span>
    </button>
  );
}
