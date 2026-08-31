import type { HandwritingConfig } from '../../lib/types/handwriting';import { HANDWRITING_PRESETS, getPreset } from '../../lib/handwriting/presets';
import { HANDWRITING_FONTS } from '../../lib/handwriting/fonts';
import { INK_COLORS } from '../../lib/handwriting/inks';
import { Select } from '../atoms/Select';
import { Slider } from '../atoms/Slider';
import { Separator } from '../atoms/Separator';
import { PresetCard } from '../molecules/PresetCard';
import { InkColorSwatch } from '../molecules/InkColorSwatch';

export interface HandwritingPanelProps {
  config: HandwritingConfig;
  onChange: (patch: Partial<HandwritingConfig>) => void;
}

export function HandwritingPanel({ config, onChange }: HandwritingPanelProps) {
  const activePresetId =
    HANDWRITING_PRESETS.find((preset) => JSON.stringify(preset.config) === JSON.stringify(config))?.id ?? null;

  return (
    <div className="space-y-4 p-3">
      <section aria-label="Estilos predefinidos">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Estilos</h3>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Estilo manuscrito">
          {HANDWRITING_PRESETS.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              selected={activePresetId === preset.id}
              onSelect={(id) => onChange({ ...getPreset(id).config })}
            />
          ))}
        </div>
      </section>

      <Separator />

      <section aria-label="Fuente y tinta" className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Fuente y tinta</h3>
        <label className="block">
          <span className="mb-1 block text-[13px] text-foreground">Fuente manuscrita</span>
          <Select value={config.fontId} onChange={(event) => onChange({ fontId: event.target.value })}>
            <optgroup label="Del proyecto handwriting">
              {HANDWRITING_FONTS.filter((font) => font.id.startsWith('hw-')).map((font) => (
                <option key={font.id} value={font.id}>{font.name}</option>
              ))}
            </optgroup>
            <optgroup label="Alternativas abiertas">
              {HANDWRITING_FONTS.filter((font) => !font.id.startsWith('hw-')).map((font) => (
                <option key={font.id} value={font.id}>{font.name}</option>
              ))}
            </optgroup>
          </Select>
        </label>
        <div>
          <span className="mb-1.5 block text-[13px] text-foreground">Color de tinta</span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color de tinta">
            {INK_COLORS.map((ink) => (
              <InkColorSwatch
                key={ink.id}
                ink={ink}
                selected={config.inkId === ink.id}
                onSelect={(inkId) => onChange({ inkId })}
              />
            ))}
          </div>
        </div>
      </section>

      <Separator />

      <section aria-label="Trazo" className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Trazo</h3>
        <Slider label="Tamaño" value={config.fontSize} min={14} max={32} onChange={(fontSize) => onChange({ fontSize })} format={(v) => `${v}px`} />
        <Slider label="Grosor" value={config.weight} min={300} max={700} step={50} onChange={(weight) => onChange({ weight })} />
        <Slider label="Inclinación" value={config.slant} min={-8} max={8} step={0.5} onChange={(slant) => onChange({ slant })} format={(v) => `${v}°`} />
        <Slider label="Intensidad de tinta" value={config.opacity} min={0.5} max={1} step={0.05} onChange={(opacity) => onChange({ opacity })} format={(v) => `${Math.round(v * 100)}%`} />
      </section>

      <Separator />

      <section aria-label="Ritmo" className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Ritmo</h3>
        <Slider label="Interlineado" value={config.lineHeight} min={1.4} max={2.6} step={0.05} onChange={(lineHeight) => onChange({ lineHeight })} format={(v) => v.toFixed(2)} />
        <Slider label="Espaciado entre letras" value={config.letterSpacing} min={0} max={3} step={0.1} onChange={(letterSpacing) => onChange({ letterSpacing })} format={(v) => `${v}px`} />
        <Slider label="Espaciado entre palabras" value={config.wordSpacing} min={0} max={6} step={0.5} onChange={(wordSpacing) => onChange({ wordSpacing })} format={(v) => `${v}px`} />
      </section>

      <Separator />

      <section aria-label="Fórmulas" className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Fórmulas LaTeX</h3>
        <label className="block">
          <span className="mb-1 block text-[13px] text-foreground">Apariencia</span>
          <Select
            value={config.formulaStyle}
            onChange={(event) => onChange({ formulaStyle: event.target.value as HandwritingConfig['formulaStyle'] })}
          >
            <option value="manuscrita">Manuscrita</option>
            <option value="sutil">Sutil</option>
            <option value="tipografica">Tipográfica</option>
          </Select>
        </label>
        <p className="text-xs leading-relaxed text-muted">
          «Manuscrita» dibuja las letras con tu letra y mantiene los símbolos (∑ ∫ √) precisos.
          «Sutil» conserva la tipografía de KaTeX con la inclinación del texto.
        </p>
      </section>

      <Separator />

      <section aria-label="Variación humana" className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Variación humana</h3>
        <Slider label="Irregularidad vertical" value={config.jitterY} min={0} max={3} step={0.1} onChange={(jitterY) => onChange({ jitterY })} format={(v) => `${v}px`} />
        <Slider label="Variación de rotación" value={config.jitterRot} min={0} max={2} step={0.1} onChange={(jitterRot) => onChange({ jitterRot })} format={(v) => `${v}°`} />
      </section>
    </div>
  );
}
