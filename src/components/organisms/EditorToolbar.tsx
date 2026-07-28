import { useRef } from 'react';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Quote,
  Redo2,
  Search,
  SeparatorHorizontal,
  Sigma,
  SquareSigma,
  Strikethrough,
  Table,
  Undo2,
  Upload,
} from 'lucide-react';
import { IconButton } from '../atoms/IconButton';
import { Separator } from '../atoms/Separator';
import { ToolbarGroup } from '../molecules/ToolbarGroup';

export type EditorAction =
  | { type: 'wrap'; before: string; after?: string }
  | { type: 'prefix'; prefix: string | ((lineIndex: number) => string) }
  | { type: 'block'; snippet: string }
  | { type: 'math'; mode: 'inline' | 'block' }
  | { type: 'undo' }
  | { type: 'redo' };

export interface EditorToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  searchOpen: boolean;
  onAction: (action: EditorAction) => void;
  onToggleSearch: () => void;
  onImportFile: (file: File) => void;
}

const TABLE_SNIPPET = `| Columna 1 | Columna 2 | Columna 3 |
| --- | --- | --- |
|  |  |  |`;

export function EditorToolbar({
  canUndo,
  canRedo,
  searchOpen,
  onAction,
  onToggleSearch,
  onImportFile,
}: EditorToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div
      role="toolbar"
      aria-label="Herramientas de edición Markdown"
      className="flex flex-wrap items-center gap-x-1 gap-y-1 border-b border-outline bg-surface px-2 py-1.5"
    >
      <ToolbarGroup label="Encabezados">
        <IconButton label="Título (encabezado 1)" size="sm" onClick={() => onAction({ type: 'prefix', prefix: '# ' })}>
          <Heading1 size={15} aria-hidden />
        </IconButton>
        <IconButton label="Subtítulo (encabezado 2)" size="sm" onClick={() => onAction({ type: 'prefix', prefix: '## ' })}>
          <Heading2 size={15} aria-hidden />
        </IconButton>
        <IconButton label="Encabezado 3" size="sm" onClick={() => onAction({ type: 'prefix', prefix: '### ' })}>
          <Heading3 size={15} aria-hidden />
        </IconButton>
      </ToolbarGroup>

      <Separator vertical className="mx-0.5 h-5" />

      <ToolbarGroup label="Formato">
        <IconButton label="Negrita (Ctrl+B)" size="sm" onClick={() => onAction({ type: 'wrap', before: '**' })}>
          <Bold size={15} aria-hidden />
        </IconButton>
        <IconButton label="Cursiva (Ctrl+I)" size="sm" onClick={() => onAction({ type: 'wrap', before: '*' })}>
          <Italic size={15} aria-hidden />
        </IconButton>
        <IconButton label="Tachado" size="sm" onClick={() => onAction({ type: 'wrap', before: '~~' })}>
          <Strikethrough size={15} aria-hidden />
        </IconButton>
        <IconButton label="Código en línea" size="sm" onClick={() => onAction({ type: 'wrap', before: '`' })}>
          <Code size={15} aria-hidden />
        </IconButton>
      </ToolbarGroup>

      <Separator vertical className="mx-0.5 h-5" />

      <ToolbarGroup label="Listas y citas">
        <IconButton label="Lista con viñetas" size="sm" onClick={() => onAction({ type: 'prefix', prefix: '- ' })}>
          <List size={15} aria-hidden />
        </IconButton>
        <IconButton
          label="Lista numerada"
          size="sm"
          onClick={() => onAction({ type: 'prefix', prefix: (i) => `${i + 1}. ` })}
        >
          <ListOrdered size={15} aria-hidden />
        </IconButton>
        <IconButton label="Lista de tareas" size="sm" onClick={() => onAction({ type: 'prefix', prefix: '- [ ] ' })}>
          <ListTodo size={15} aria-hidden />
        </IconButton>
        <IconButton label="Cita" size="sm" onClick={() => onAction({ type: 'prefix', prefix: '> ' })}>
          <Quote size={15} aria-hidden />
        </IconButton>
      </ToolbarGroup>

      <Separator vertical className="mx-0.5 h-5" />

      <ToolbarGroup label="Insertar">
        <IconButton label="Enlace (Ctrl+K)" size="sm" onClick={() => onAction({ type: 'wrap', before: '[', after: '](https://)' })}>
          <Link size={15} aria-hidden />
        </IconButton>
        <IconButton
          label="Imagen"
          size="sm"
          onClick={() => onAction({ type: 'wrap', before: '![', after: '](https://)' })}
        >
          <Image size={15} aria-hidden />
        </IconButton>
        <IconButton label="Tabla" size="sm" onClick={() => onAction({ type: 'block', snippet: TABLE_SNIPPET })}>
          <Table size={15} aria-hidden />
        </IconButton>
        <IconButton label="Separador" size="sm" onClick={() => onAction({ type: 'block', snippet: '---' })}>
          <Minus size={15} aria-hidden />
        </IconButton>
        <IconButton label="Salto de página (\\newpage)" size="sm" onClick={() => onAction({ type: 'block', snippet: '\\newpage' })}>
          <SeparatorHorizontal size={15} aria-hidden />
        </IconButton>
      </ToolbarGroup>

      <Separator vertical className="mx-0.5 h-5" />

      <ToolbarGroup label="Matemáticas">
        <IconButton label="Fórmula en línea $…$" size="sm" onClick={() => onAction({ type: 'math', mode: 'inline' })}>
          <Sigma size={15} aria-hidden />
        </IconButton>
        <IconButton label="Fórmula en bloque $$…$$" size="sm" onClick={() => onAction({ type: 'math', mode: 'block' })}>
          <SquareSigma size={15} aria-hidden />
        </IconButton>
      </ToolbarGroup>

      <Separator vertical className="mx-0.5 h-5" />

      <ToolbarGroup label="Historial y búsqueda">
        <IconButton label="Deshacer (Ctrl+Z)" size="sm" disabled={!canUndo} onClick={() => onAction({ type: 'undo' })}>
          <Undo2 size={15} aria-hidden />
        </IconButton>
        <IconButton label="Rehacer (Ctrl+Y)" size="sm" disabled={!canRedo} onClick={() => onAction({ type: 'redo' })}>
          <Redo2 size={15} aria-hidden />
        </IconButton>
        <IconButton label="Buscar en el documento (Ctrl+F)" size="sm" active={searchOpen} onClick={onToggleSearch}>
          <Search size={15} aria-hidden />
        </IconButton>
      </ToolbarGroup>

      <div className="ml-auto">
        <input
          ref={fileRef}
          type="file"
          accept=".md,.markdown,.txt"
          className="hidden"
          aria-hidden
          tabIndex={-1}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onImportFile(file);
            event.target.value = '';
          }}
        />
        <IconButton
          label="Importar archivo .md o .txt (reemplaza el contenido; puedes deshacer)"
          size="sm"
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={15} aria-hidden />
        </IconButton>
      </div>
    </div>
  );
}
