import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ExportDialog } from './ExportDialog';

describe('ExportDialog · estado de carga', () => {
  it('explica qué hoja está renderizando', () => {
    render(
      <ExportDialog
        open
        busy
        progress={{ phase: 'rendering', current: 2, total: 4 }}
        error={null}
        totalPages={4}
        currentPage={0}
        onClose={vi.fn()}
        onExport={vi.fn()}
      />,
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Preparando tu PDF')).toBeInTheDocument();
    expect(screen.getByText('Renderizando hoja 2 de 4.')).toBeInTheDocument();
    expect(screen.getByText(/Mantén esta pestaña abierta/)).toBeInTheDocument();
  });
});
