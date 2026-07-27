import { cn } from '../../lib/utils/cn';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Formatea el valor mostrado a la derecha. */
  format?: (value: number) => string;
  disabled?: boolean;
}

export function Slider({ label, value, min, max, step = 1, onChange, format, disabled }: SliderProps) {
  return (
    <label className={cn('block', disabled && 'opacity-45 pointer-events-none')}>
      <span className="flex items-baseline justify-between mb-1">
        <span className="text-[13px] text-foreground">{label}</span>
        <span className="text-xs text-muted tabular-nums">{format ? format(value) : value}</span>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full h-1.5 appearance-none rounded-full bg-outline accent-[var(--primary)] cursor-pointer"
      />
    </label>
  );
}
