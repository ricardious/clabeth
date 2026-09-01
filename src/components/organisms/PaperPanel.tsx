import { useMemo } from 'react';
import type { PaperConfig, PaperStyleId } from '../../lib/types/paper';
import { PAPER_STYLES, PAGE_SIZES, getPaperStyle } from '../../lib/paper/styles';
import { Input } from '../atoms/Input';
import { Select, type SelectItem } from '../atoms/Select';
import { Switch } from '../atoms/Switch';
import { Separator } from '../atoms/Separator';
import { PaperStyleCard } from '../molecules/PaperStyleCard';

export interface PaperPanelProps {
  config: PaperConfig;
  onChange: (patch: Partial<PaperConfig>) => void;
}

const ORIENTATION_OPTIONS: SelectItem<PaperConfig['orientation']>[] = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
];

export function PaperPanel({ config, onChange }: PaperPanelProps) {
  const styleDef = getPaperStyle(config.style);
  const sizeOptions = useMemo<SelectItem<PaperConfig['size']>[]>(
    () =>
      Object.entries(PAGE_SIZES).map(([id, definition]) => ({
        value: id as PaperConfig['size'],
        label: definition.name,
      })),
    [],
  );

  return (
    <div className="space-y-4 p-3">
      <section aria-label="Tipo de papel">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Papel</h3>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de papel">
          {PAPER_STYLES.map((style) => (
            <PaperStyleCard
              key={style.id}
              style={style}
              selected={config.style === style.id}
              onSelect={(id) => {
                const next = getPaperStyle(id);
                onChange({ style: id as PaperStyleId, marginLine: next.hasMarginLine ? config.marginLine : false });
              }}
            />
          ))}
        </div>
      </section>

      <Separator />

      <section aria-label="Formato" className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Formato</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="mb-1 block text-[13px] text-foreground">Tamaño</span>
            <Select
              value={config.size}
              onChange={(size) => onChange({ size })}
              options={sizeOptions}
              label="Tamaño de la hoja"
            />
          </div>
          <div>
            <span className="mb-1 block text-[13px] text-foreground">Orientación</span>
            <Select
              value={config.orientation}
              onChange={(orientation) => onChange({ orientation })}
              options={ORIENTATION_OPTIONS}
              label="Orientación de la hoja"
            />
          </div>
        </div>
        <Switch
          label="Línea de margen roja"
          checked={config.marginLine && styleDef.hasMarginLine}
          disabled={!styleDef.hasMarginLine}
          onChange={(marginLine) => onChange({ marginLine })}
        />
      </section>

      <Separator />

      <section aria-label="Encabezado y pie" className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Encabezado y pie</h3>
        <label className="block">
          <span className="mb-1 block text-[13px] text-foreground">Encabezado</span>
          <Input
            value={config.header}
            placeholder="Sin encabezado"
            onChange={(event) => onChange({ header: event.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[13px] text-foreground">Pie de página</span>
          <Input
            value={config.footer}
            placeholder="Sin pie de página"
            onChange={(event) => onChange({ footer: event.target.value })}
          />
        </label>
        <Switch
          label="Números de página"
          checked={config.pageNumbers}
          onChange={(pageNumbers) => onChange({ pageNumbers })}
        />
      </section>
    </div>
  );
}
