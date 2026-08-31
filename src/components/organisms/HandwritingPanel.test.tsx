import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_HANDWRITING, getPresetStyle } from '../../lib/handwriting/presets';
import { HandwritingPanel } from './HandwritingPanel';

describe('HandwritingPanel', () => {
  it('aplica el estilo sin reemplazar la fuente elegida', () => {
    const onChange = vi.fn();
    const config = { ...DEFAULT_HANDWRITING, fontId: 'give-you-glory' };
    render(<HandwritingPanel config={config} onChange={onChange} />);

    fireEvent.click(screen.getByRole('radio', { name: /Elegante/ }));

    expect(onChange).toHaveBeenCalledWith(getPresetStyle('elegante'));
    expect(onChange.mock.calls[0][0]).not.toHaveProperty('fontId');
  });

  it('mantiene marcado el estilo aunque la fuente sea diferente a la del preset', () => {
    const config = {
      ...DEFAULT_HANDWRITING,
      ...getPresetStyle('apuntes'),
      fontId: 'reenie',
    };
    render(<HandwritingPanel config={config} onChange={vi.fn()} />);

    expect(screen.getByRole('radio', { name: /Apuntes/ })).toHaveAttribute('aria-checked', 'true');
  });
});
