import { Minus, Plus } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';
import { useUiStore, ZOOM_MAX, ZOOM_MIN } from '../../lib/store/ui';

export function ZoomControls() {
  const zoom = useUiStore((state) => state.zoom);
  const zoomIn = useUiStore((state) => state.zoomIn);
  const zoomOut = useUiStore((state) => state.zoomOut);
  const setZoom = useUiStore((state) => state.setZoom);

  return (
    <div className="inline-flex items-center gap-0.5" role="group" aria-label="Zoom de la vista previa">
      <IconButton label="Reducir zoom" size="sm" onClick={zoomOut} disabled={zoom <= ZOOM_MIN}>
        <Minus size={14} aria-hidden />
      </IconButton>
      <button
        type="button"
        aria-label={`Zoom ${Math.round(zoom * 100)} %. Restablecer a 100 %`}
        title="Restablecer zoom"
        onClick={() => setZoom(1)}
        className="w-12 rounded-sm text-center text-xs tabular-nums text-muted hover:text-foreground"
      >
        {Math.round(zoom * 100)}%
      </button>
      <IconButton label="Aumentar zoom" size="sm" onClick={zoomIn} disabled={zoom >= ZOOM_MAX}>
        <Plus size={14} aria-hidden />
      </IconButton>
    </div>
  );
}
