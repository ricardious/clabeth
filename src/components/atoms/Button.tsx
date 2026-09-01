import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-strong active:bg-primary-strong',
  secondary:
    'bg-surface text-foreground border border-outline hover:bg-hover active:bg-panel',
  ghost: 'text-foreground hover:bg-hover active:bg-panel',
  danger: 'bg-error text-primary-foreground hover:brightness-110',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-[var(--control-h-sm)] px-2.5 text-[13px] gap-1.5',
  md: 'h-[var(--control-h-md)] px-3.5 text-sm gap-2',
  lg: 'h-[var(--control-h-lg)] px-5 text-[15px] gap-2',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium select-none',
        'transition-colors duration-[var(--dur-fast)]',
        'disabled:opacity-45 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});
