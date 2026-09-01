import { fireEvent, render, screen, within } from '@testing-library/react';
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

  it('permite elegir una tinta de títulos distinta a la del texto', () => {
    const onChange = vi.fn();
    render(<HandwritingPanel config={{ ...DEFAULT_HANDWRITING, inkId: 'grafito' }} onChange={onChange} />);

    const titulos = screen.getByRole('radiogroup', { name: 'Tinta de los títulos' });
    fireEvent.click(within(titulos).getByRole('radio', { name: 'Tinta Rojo tinta' }));

    expect(onChange).toHaveBeenCalledWith({ headingInkId: 'rojo' });
  });

  it('la tinta de los títulos parte de la del texto mientras no se elija otra', () => {
    const { headingInkId: _omitted, ...legacy } = { ...DEFAULT_HANDWRITING, inkId: 'verde' };
    render(<HandwritingPanel config={legacy as typeof DEFAULT_HANDWRITING} onChange={vi.fn()} />);

    const titulos = screen.getByRole('radiogroup', { name: 'Tinta de los títulos' });
    expect(within(titulos).getByRole('radio', { name: 'Tinta Verde bosque' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
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
