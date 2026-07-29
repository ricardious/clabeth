import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LatexPalette } from './LatexPalette';

describe('LatexPalette', () => {
  it('muestra las categorías y las fórmulas', () => {
    render(<LatexPalette onInsert={vi.fn()} />);
    expect(screen.getByText('Estructuras')).toBeInTheDocument();
    expect(screen.getByText('Cálculo')).toBeInTheDocument();
  });

  it('inserta la fórmula elegida', () => {
    const onInsert = vi.fn();
    render(<LatexPalette onInsert={onInsert} />);
    fireEvent.click(screen.getByText('Fracción'));
    expect(onInsert).toHaveBeenCalledWith(
      expect.objectContaining({ latex: '\\frac{a}{b}', mode: 'inline' }),
    );
  });

  it('filtra por búsqueda', () => {
    render(<LatexPalette onInsert={vi.fn()} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'integral' } });
    expect(screen.getByText('Integral definida')).toBeInTheDocument();
    expect(screen.queryByText('Fracción')).not.toBeInTheDocument();
  });

  it('muestra un mensaje sin resultados', () => {
    render(<LatexPalette onInsert={vi.fn()} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzz' } });
    expect(screen.getByText(/Sin fórmulas/)).toBeInTheDocument();
  });
});
