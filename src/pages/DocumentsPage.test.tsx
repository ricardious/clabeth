import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { DocumentsPage } from '../pages/DocumentsPage';
import { useDocumentsStore } from '../store/documents';
import { createDocument } from '../lib/defaults';

function seedDocuments() {
  const { init, createAndAdd } = useDocumentsStore.getState();
  init();
  useDocumentsStore.setState({ documents: [] });
  const a = createAndAdd({ title: 'Apuntes de cálculo', content: 'límites y derivadas' });
  const b = createAndAdd({ title: 'Carta a mamá', content: 'cariñosos recuerdos' });
  return { a, b };
}

describe('DocumentsPage', () => {
  beforeEach(() => {
    useDocumentsStore.setState({ documents: [], loaded: true, saveState: 'idle', loadError: null });
  });

  it('muestra los documentos guardados', () => {
    seedDocuments();
    render(
      <MemoryRouter initialEntries={['/app']}>
        <DocumentsPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Apuntes de cálculo')).toBeInTheDocument();
    expect(screen.getByText('Carta a mamá')).toBeInTheDocument();
  });

  it('muestra el estado vacío cuando no hay documentos', () => {
    render(
      <MemoryRouter initialEntries={['/app']}>
        <DocumentsPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Todavía no hay documentos/)).toBeInTheDocument();
  });

  it('filtra por búsqueda', () => {
    seedDocuments();
    render(
      <MemoryRouter initialEntries={['/app']}>
        <DocumentsPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'mamá' } });
    expect(screen.queryByText('Apuntes de cálculo')).not.toBeInTheDocument();
    expect(screen.getByText('Carta a mamá')).toBeInTheDocument();
  });

  it('filtra por tipo de papel', () => {
    seedDocuments();
    render(
      <MemoryRouter initialEntries={['/app']}>
        <DocumentsPage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText('Filtrar por tipo de papel'), { target: { value: 'rayada' } });
    expect(screen.queryByText('Apuntes de cálculo')).not.toBeInTheDocument();
  });

  it('elimina un documento tras confirmar', async () => {
    seedDocuments();
    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/app" element={<DocumentsPage />} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getAllByLabelText('Eliminar')[0]);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Eliminar' }));
    await waitFor(() => {
      expect(useDocumentsStore.getState().documents).toHaveLength(1);
    });
  });

  it('abre el documento al hacer clic en su título', () => {
    const { a } = seedDocuments();
    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/app" element={<DocumentsPage />} />
          <Route path="/app/editor/:id" element={<div>EDITOR</div>} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('Apuntes de cálculo'));
    expect(screen.getByText('EDITOR')).toBeInTheDocument();
    expect(a).toBeDefined();
  });

  it('renombra un documento', () => {
    seedDocuments();
    render(
      <MemoryRouter initialEntries={['/app']}>
        <DocumentsPage />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getAllByLabelText('Renombrar')[0]);
    const input = screen.getByLabelText('Nuevo título');
    fireEvent.change(input, { target: { value: 'Nuevo nombre' } });
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Renombrar' }));
    expect(useDocumentsStore.getState().documents[0].title).toBe('Nuevo nombre');
  });

  it('duplica y abre la copia', () => {
    seedDocuments();
    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/app" element={<DocumentsPage />} />
          <Route path="/app/editor/:id" element={<div>EDITOR</div>} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getAllByLabelText('Duplicar')[0]);
    expect(screen.getByText('EDITOR')).toBeInTheDocument();
    const store = useDocumentsStore.getState();
    expect(store.documents).toHaveLength(3);
    expect(store.documents.some((d) => d.title.includes('(copia)'))).toBe(true);
  });

  it('crea un documento nuevo', () => {
    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/app" element={<DocumentsPage />} />
          <Route path="/app/editor/:id" element={<div>EDITOR</div>} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Crear primer documento/ }));
    expect(screen.getByText('EDITOR')).toBeInTheDocument();
    expect(useDocumentsStore.getState().documents).toHaveLength(1);
  });
});

describe('createDocument', () => {
  it('aplica el preset y papel por defecto', () => {
    const doc = createDocument({ title: 'X' });
    expect(doc.handwriting.fontId).toBe('caveat');
    expect(doc.paper.style).toBe('libreta');
  });
});
