import type { ReactNode } from 'react';
import { cn } from '../../lib/utils/cn';

type Tone = 'neutral' | 'success' | 'warning' | 'error' | 'brand';

const TONES: Record<Tone, string> = {
  neutral: 'bg-panel text-muted',
  success: 'bg-[color-mix(in_oklch,var(--success)_14%,transparent)] text-success',
  warning: 'bg-[color-mix(in_oklch,var(--warning)_18%,transparent)] text-warning',
  error: 'bg-[color-mix(in_oklch,var(--error)_12%,transparent)] text-error',
  brand: 'bg-primary-soft text-primary',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}
