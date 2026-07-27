import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SaveStatus } from './SaveStatus';

describe('SaveStatus', () => {
  it('muestra el estado guardando', () => {
    render(<SaveStatus state="saving" />);
    expect(screen.getByText('Guardando…')).toBeInTheDocument();
  });

  it('muestra el estado guardado', () => {
    render(<SaveStatus state="saved" />);
    expect(screen.getByText('Guardado')).toBeInTheDocument();
  });

  it('muestra el error', () => {
    render(<SaveStatus state="error" />);
    expect(screen.getByText('Error al guardar')).toBeInTheDocument();
  });

  it('muestra el error de carga por encima del estado', () => {
    render(<SaveStatus state="saving" error="Espacio lleno" />);
    expect(screen.getByText('Espacio lleno')).toBeInTheDocument();
  });

  it('no renderiza nada en estado idle', () => {
    const { container } = render(<SaveStatus state="idle" />);
    expect(container).toBeEmptyDOMElement();
  });
});
