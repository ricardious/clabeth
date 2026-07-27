import { Search, X } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function SearchField({ value, onChange, placeholder = 'Buscar…', ariaLabel = 'Buscar' }: SearchFieldProps) {
  return (
    <div className="relative">
      <Search
        aria-hidden
        size={16}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        type="search"
        role="searchbox"
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-[var(--control-h-md)] w-full rounded-md border border-outline bg-surface pl-8 pr-8 text-sm text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-1 [&::-webkit-search-cancel-button]:hidden"
      />
      {value !== '' && (
        <IconButton
          label="Limpiar búsqueda"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          onClick={() => onChange('')}
        >
          <X size={14} aria-hidden />
        </IconButton>
      )}
    </div>
  );
}
