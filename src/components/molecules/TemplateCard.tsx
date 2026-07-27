import type { CSSProperties } from 'react';
import type { DocumentTemplate } from '../../lib/templates-data';
import { getPreset } from '../../lib/handwriting/presets';
import { getHandwritingFont } from '../../lib/handwriting/fonts';
import { getInk } from '../../lib/handwriting/inks';
import { cn } from '../../lib/utils/cn';

export interface TemplateCardProps {
  template: DocumentTemplate;
  onUse: (template: DocumentTemplate) => void;
}

export function TemplateCard({ template, onUse }: TemplateCardProps) {
  const preset = getPreset(template.presetId);
  const font = getHandwritingFont(preset.config.fontId);
  const ink = getInk(preset.config.inkId);
  const firstLine = template.content.split('\n').find((line) => line.trim() !== '') ?? template.name;

  return (
    <button
      type="button"
      onClick={() => onUse(template)}
      aria-label={`Crear documento desde la plantilla «${template.name}»`}
      className={cn(
        'flex flex-col gap-2 rounded-lg border border-outline bg-surface p-4 text-left shadow-panel',
        'transition-all duration-[var(--dur-med)] hover:-translate-y-0.5 hover:border-outline-strong hover:shadow-pop',
      )}
    >
      <span
        aria-hidden
        className={cn('block h-24 overflow-hidden rounded-sm border border-outline p-3 paper-bg', `paper-${template.paperStyle}`)}
        style={{ '--_line-h': '12px', '--_grid': '9px', '--_line-offset': '7px' } as CSSProperties}
      >
        <span
          className="block text-[13px] leading-relaxed"
          style={{ fontFamily: font.family, color: `var(${ink.token})` }}
        >
          {firstLine.replace(/^#\s*/, '')}
        </span>
      </span>
      <span className="font-display text-[15px] font-semibold text-foreground-strong">{template.name}</span>
      <span className="text-xs text-muted">{template.description}</span>
      <span className="mt-auto text-xs font-medium text-primary">Usar plantilla →</span>
    </button>
  );
}
