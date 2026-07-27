import { cn } from '../../lib/utils/cn';

/**
 * Wordmark «Clabeth»: Fraunces con el punto de tinta roja.
 * El nombre siempre se muestra completo y legible.
 */
export function Logo({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'text-lg', md: 'text-[22px]', lg: 'text-4xl' } as const;
  return (
    <span
      className={cn(
        'font-display font-semibold tracking-tight text-foreground-strong select-none',
        sizes[size],
        className,
      )}
    >
      Clabeth<span className="text-primary" aria-hidden>.</span>
    </span>
  );
}
