import { cn } from '../../lib/utils/cn';

export function Separator({ vertical = false, className }: { vertical?: boolean; className?: string }) {
  return (
    <div
      role="separator"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      className={cn(vertical ? 'w-px self-stretch bg-outline' : 'h-px w-full bg-outline', className)}
    />
  );
}
