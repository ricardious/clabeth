import { useState } from 'react';
import { Download } from 'lucide-react';
import type { ExportFormat, ExportOptions, ExportProgress, ExportRange } from '../../lib/types/export';
import { Button } from '../atoms/Button';
import { Dialog } from '../atoms/Dialog';
import { Input } from '../atoms/Input';
import { Select, type SelectItem } from '../atoms/Select';
import { Switch } from '../atoms/Switch';
import { Separator } from '../atoms/Separator';
import { ErrorNotice } from '../molecules/ErrorNotice';
import { RenderingStatus } from '../molecules/RenderingStatus';
import { cn } from '../../lib/utils/cn';

const SCALE_OPTIONS: SelectItem[] = [
  { value: '1', label: 'Normal (1×)' },
  { value: '2', label: 'Alta (2×)', hint: 'Recomendada' },
  { value: '3', label: 'Muy alta (3×)' },
];

export interface ExportDialogProps {
  open: boolean;
  busy: boolean;
  progress: ExportProgress | null;
  error: string | null;
  totalPages: number;
  currentPage: number;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
}

function OptionButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-[var(--dur-fast)]',
        active ? 'border-focus-ring bg-primary-soft text-primary' : 'border-outline bg-surface text-foreground hover:bg-hover',
      )}
    >
      {label}
    </button>
  );
}

export function ExportDialog({ open, busy, progress, error, totalPages, currentPage, onClose, onExport }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [range, setRange] = useState<ExportRange>('todas');
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(totalPages);
  const [scale, setScale] = useState<1 | 2 | 3>(2);
  const [includeBackground, setIncludeBackground] = useState(true);
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [includeFooter, setIncludeFooter] = useState(true);

  const rangeInvalid =
    range === 'rango' && (rangeFrom < 1 || rangeTo > totalPages || rangeFrom > rangeTo);

  const handleExport = (): void => {
    onExport({
      format,
      range,
      rangeFrom,
      rangeTo,
      scale,
      includeBackground,
      includePageNumbers,
      includeHeader,
      includeFooter,
    });
  };

  const progressDescription =
    progress?.phase === 'rendering' && progress.total > 0
      ? `Renderizando hoja ${progress.current} de ${progress.total}.`
      : progress?.phase === 'finishing'
        ? `Armando el archivo ${format.toUpperCase()} y preparando la descarga.`
        : 'Calculando páginas, márgenes y tipografía manuscrita.';

  return (
    <Dialog open={open} onClose={busy ? () => undefined : onClose} title="Exportar documento">
      {busy ? (
        <RenderingStatus
          variant="dialog"
          title={`Preparando tu ${format.toUpperCase()}`}
          description={progressDescription}
          detail="Mantén esta pestaña abierta. La descarga comenzará automáticamente."
        />
      ) : (
      <div className="p-5">
        <h2 className="font-display text-lg font-semibold text-foreground-strong">Exportar documento</h2>

        <div className="mt-4 space-y-4">
          <div>
            <span className="mb-1.5 block text-[13px] font-medium text-foreground">Formato</span>
            <div className="flex gap-2">
              <OptionButton active={format === 'pdf'} label="PDF" onClick={() => setFormat('pdf')} />
              <OptionButton active={format === 'png'} label="PNG" onClick={() => setFormat('png')} />
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-[13px] font-medium text-foreground">Páginas</span>
            <div className="flex gap-2">
              <OptionButton active={range === 'actual'} label={`Actual (${currentPage + 1})`} onClick={() => setRange('actual')} />
              <OptionButton active={range === 'todas'} label={`Todas (${totalPages})`} onClick={() => setRange('todas')} />
              <OptionButton active={range === 'rango'} label="Rango" onClick={() => setRange('rango')} />
            </div>
            {range === 'rango' && (
              <div className="mt-2 flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-[13px] text-muted">
                  De
                  <Input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={rangeFrom}
                    onChange={(event) => setRangeFrom(Number(event.target.value))}
                    className="w-20"
                    aria-label="Desde la página"
                  />
                </label>
                <label className="flex items-center gap-1.5 text-[13px] text-muted">
                  a
                  <Input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={rangeTo}
                    onChange={(event) => setRangeTo(Number(event.target.value))}
                    className="w-20"
                    aria-label="Hasta la página"
                  />
                </label>
                {rangeInvalid && (
                  <span className="text-xs text-error">Rango inválido (1–{totalPages}).</span>
                )}
              </div>
            )}
          </div>

          <div>
            <span className="mb-1.5 block text-[13px] font-medium text-foreground">Calidad</span>
            <Select
              value={String(scale)}
              onChange={(next) => setScale(Number(next) as 1 | 2 | 3)}
              options={SCALE_OPTIONS}
              label="Calidad de exportación"
            />
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Switch label="Incluir fondo del papel" checked={includeBackground} onChange={setIncludeBackground} />
            <Switch label="Incluir numeración" checked={includePageNumbers} onChange={setIncludePageNumbers} />
            <Switch label="Incluir encabezado" checked={includeHeader} onChange={setIncludeHeader} />
            <Switch label="Incluir pie" checked={includeFooter} onChange={setIncludeFooter} />
          </div>

          {error && <ErrorNotice>{error}</ErrorNotice>}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={busy || rangeInvalid || totalPages === 0}>
            <Download size={15} aria-hidden /> Exportar
          </Button>
        </div>
      </div>
      )}
    </Dialog>
  );
}
