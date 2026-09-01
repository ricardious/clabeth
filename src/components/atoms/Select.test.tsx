import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Select, type SelectItem } from './Select';

const OPTIONS: SelectItem[] = [
  { value: 'a4', label: 'A4' },
  { value: 'carta', label: 'Carta' },
  { value: 'oficio', label: 'Oficio', disabled: true },
];

const GROUPED: SelectItem[] = [
  { label: 'Del proyecto', options: [{ value: 'hw-1', label: 'Trazo firme' }] },
  { label: 'Alternativas', options: [{ value: 'reenie', label: 'Reenie' }] },
];

function Controlled({ options = OPTIONS, initial = 'a4' }: { options?: SelectItem[]; initial?: string }) {
  const [value, setValue] = useState(initial);
  return <Select value={value} onChange={setValue} options={options} label="Tamaño" />;
}

describe('Select', () => {
  it('muestra la etiqueta del valor seleccionado, no su identificador', () => {
    render(<Controlled />);
    expect(screen.getByRole('combobox', { name: 'Tamaño' })).toHaveTextContent('A4');
  });

  it('abre el listado y elige una opción con el ratón', () => {
    const onChange = vi.fn();
    render(<Select value="a4" onChange={onChange} options={OPTIONS} label="Tamaño" />);

    const trigger = screen.getByRole('combobox', { name: 'Tamaño' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByRole('option', { name: /Carta/ }));
    expect(onChange).toHaveBeenCalledWith('carta');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('marca la opción activa y navega con el teclado', () => {
    render(<Controlled />);
    const trigger = screen.getByRole('combobox', { name: 'Tamaño' });

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // Arranca en el valor actual (A4) y baja a la siguiente seleccionable.
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'Enter' });

    expect(trigger).toHaveTextContent('Carta');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('no permite elegir opciones deshabilitadas', () => {
    const onChange = vi.fn();
    render(<Select value="a4" onChange={onChange} options={OPTIONS} label="Tamaño" />);
    fireEvent.click(screen.getByRole('combobox', { name: 'Tamaño' }));

    fireEvent.click(screen.getByRole('option', { name: /Oficio/ }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('cierra con Escape sin cambiar el valor', () => {
    const onChange = vi.fn();
    render(<Select value="a4" onChange={onChange} options={OPTIONS} label="Tamaño" />);
    const trigger = screen.getByRole('combobox', { name: 'Tamaño' });

    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('busca por la primera letra estando cerrado', () => {
    const onChange = vi.fn();
    render(<Select value="a4" onChange={onChange} options={OPTIONS} label="Tamaño" />);

    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Tamaño' }), { key: 'c' });
    expect(onChange).toHaveBeenCalledWith('carta');
  });

  it('conserva los grupos como regiones etiquetadas', () => {
    render(<Controlled options={GROUPED} initial="hw-1" />);
    fireEvent.click(screen.getByRole('combobox', { name: 'Tamaño' }));

    const group = screen.getByRole('group', { name: 'Alternativas' });
    expect(within(group).getByRole('option', { name: /Reenie/ })).toBeInTheDocument();
  });

  it('anuncia la opción seleccionada a las tecnologías de asistencia', () => {
    render(<Controlled />);
    fireEvent.click(screen.getByRole('combobox', { name: 'Tamaño' }));

    expect(screen.getByRole('option', { name: /A4/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: /Carta/ })).toHaveAttribute('aria-selected', 'false');
  });
});
