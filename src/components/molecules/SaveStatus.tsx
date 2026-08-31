import { Check, CloudAlert } from 'lucide-react';
import type { SaveState } from '../../lib/types/document';
import { Spinner } from '../atoms/Spinner';

export function SaveStatus({ state, error }: { state: SaveState; error?: string | null }) {
  if (error) {
    return (
      <span role="status" className="inline-flex items-center gap-1.5 text-xs text-error">
        <CloudAlert size={14} aria-hidden /> {error}
      </span>
    );
  }
  if (state === 'saving') {
    return (
      <span role="status" className="inline-flex items-center gap-1.5 text-xs text-muted">
        <Spinner className="h-3 w-3 border" label="Guardando" /> Guardando…
      </span>
    );
  }
  if (state === 'saved') {
    return (
      <span role="status" className="inline-flex items-center gap-1.5 text-xs text-success">
        <Check size={14} aria-hidden /> Guardado
      </span>
    );
  }
  if (state === 'error') {
    return (
      <span role="status" className="inline-flex items-center gap-1.5 text-xs text-error">
        <CloudAlert size={14} aria-hidden /> Error al guardar
      </span>
    );
  }
  return null;
}
