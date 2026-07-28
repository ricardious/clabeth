import type { PaperConfig, PaperStyleId } from '../../types/paper';
import { PAPER_STYLES, PAGE_SIZES, getPaperStyle } from '../../lib/paper/styles';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Switch } from '../atoms/Switch';
import { Separator } from '../atoms/Separator';
import { PaperStyleCard } from '../molecules/PaperStyleCard';

export interface PaperPanelProps {
  config: PaperConfig;
  onChange: (patch: Partial<PaperConfig>) => void;
}

export function PaperPanel({ config, onChange }: PaperPanelProps) {
  const styleDef = getPaperStyle(config.style);

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
          <label className="block">
            <span className="mb-1 block text-[13px] text-foreground">Tamaño</span>
            <Select
              value={config.size}
              onChange={(event) => onChange({ size: event.target.value as PaperConfig['size'] })}
            >
              {Object.entries(PAGE_SIZES).map(([id, def]) => (
                <option key={id} value={id}>
                  {def.name}
                </option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] text-foreground">Orientación</span>
            <Select
              value={config.orientation}
              onChange={(event) => onChange({ orientation: event.target.value as PaperConfig['orientation'] })}
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </Select>
          </label>
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
