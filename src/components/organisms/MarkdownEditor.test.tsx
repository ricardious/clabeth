import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MarkdownEditor } from './MarkdownEditor';

function renderEditor(value = '') {
  const onChange = vi.fn();
  render(<MarkdownEditor value={value} onChange={onChange} />);
  const textarea = screen.getByLabelText('Editor Markdown') as HTMLTextAreaElement;
  return { onChange, textarea };
}

describe('MarkdownEditor', () => {
  it('renderiza el textarea y la toolbar', () => {
    renderEditor('texto');
    expect(screen.getByLabelText('Editor Markdown')).toHaveValue('texto');
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('aplica negrita a la selección con el botón de la toolbar', () => {
    const { onChange, textarea } = renderEditor('hola mundo');
    textarea.focus();
    textarea.setSelectionRange(0, 4);
    fireEvent.click(screen.getByLabelText(/Negrita/));
    expect(onChange).toHaveBeenCalledWith('**hola** mundo');
  });

  it('convierte la línea en encabezado', () => {
    const { onChange, textarea } = renderEditor('mi título');
    textarea.setSelectionRange(0, 9);
    fireEvent.click(screen.getByLabelText(/Título \(encabezado 1\)/));
    expect(onChange).toHaveBeenCalledWith('# mi título');
  });

  it('crea una lista de tareas', () => {
    const { onChange, textarea } = renderEditor('pendiente');
    textarea.setSelectionRange(0, 9);
    fireEvent.click(screen.getByLabelText(/Lista de tareas/));
    expect(onChange).toHaveBeenCalledWith('- [ ] pendiente');
  });

  it('inserta una tabla', () => {
    const { onChange, textarea } = renderEditor('abc');
    textarea.setSelectionRange(0, 0);
    fireEvent.click(screen.getByLabelText('Tabla'));
    expect(onChange.mock.calls[0][0]).toContain('| Columna 1 |');
  });

  it('inserta fórmula en línea con el botón Sigma', () => {
    const { onChange, textarea } = renderEditor('');
    textarea.focus();
    fireEvent.click(screen.getByLabelText(/Fórmula en línea/));
    expect(onChange.mock.calls[0][0]).toBe('$f(x)$');
  });

  it('abre la búsqueda y encuentra coincidencias', () => {
    const { onChange } = renderEditor('hola hola');
    fireEvent.click(screen.getByLabelText(/Buscar en el documento/));
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'hola' } });
    expect(screen.getByText('1 de 2')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Siguiente'));
    expect(screen.getByText('2 de 2')).toBeInTheDocument();
    // sin cambios de contenido
    expect(onChange).not.toHaveBeenCalled();
  });
});
