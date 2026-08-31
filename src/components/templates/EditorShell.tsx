import type { ReactNode } from 'react';
import { Eye, PenLine, SlidersHorizontal } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useIsMobile } from '../../hooks/use-media-query';
import { useUiStore } from '../../lib/store/ui';
import { Tabs } from '../atoms/Tabs';

export interface EditorShellProps {
  topbar: ReactNode;
  editor: ReactNode;
  preview: ReactNode;
  /** Panel derecho (personalizar). */
  inspector: ReactNode;
  statusbar: ReactNode;
}

/**
 * Layout del editor: en escritorio, paneles redimensionables
 * (editor · vista previa · inspector); en móvil, pestañas
 * Escribir / Vista previa / Personalizar.
 */
export function EditorShell({ topbar, editor, preview, inspector, statusbar }: EditorShellProps) {
  const isMobile = useIsMobile();
  const mobileTab = useUiStore((state) => state.mobileTab);
  const setMobileTab = useUiStore((state) => state.setMobileTab);

  if (isMobile) {
    return (
      <div className="flex h-full flex-col bg-surface">
        {topbar}
        <div className="min-h-0 flex-1">
          {mobileTab === 'escribir' && editor}
          {mobileTab === 'vista' && preview}
          {mobileTab === 'personalizar' && inspector}
        </div>
        <Tabs
          ariaLabel="Vista del editor"
          items={[
            { id: 'escribir', label: 'Escribir', icon: <PenLine size={15} aria-hidden /> },
            { id: 'vista', label: 'Vista previa', icon: <Eye size={15} aria-hidden /> },
            { id: 'personalizar', label: 'Personalizar', icon: <SlidersHorizontal size={15} aria-hidden /> },
          ]}
          active={mobileTab}
          onChange={setMobileTab}
          className="shrink-0 border-t border-outline bg-surface px-2 py-1.5"
        />
        {statusbar}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-surface">
      {topbar}
      <div className="min-h-0 flex-1">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={42} minSize={24}>
            {editor}
          </Panel>
          <PanelResizeHandle className="w-px bg-outline outline-none data-[resize-handle-active]:bg-primary" />
          <Panel minSize={30} defaultSize={44}>
            {preview}
          </Panel>
          {inspector && (
            <>
              <PanelResizeHandle className="w-px bg-outline outline-none data-[resize-handle-active]:bg-primary" />
              <Panel defaultSize={14} minSize={12} maxSize={24}>
                {inspector}
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
      {statusbar}
    </div>
  );
}
