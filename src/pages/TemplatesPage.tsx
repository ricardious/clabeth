import { useNavigate } from 'react-router-dom';
import { useDocumentsStore } from '../store/documents';
import { DOCUMENT_TEMPLATES, type DocumentTemplate } from '../lib/templates-data';
import { TemplateCard } from '../components/molecules/TemplateCard';

export function TemplatesPage() {
  const createAndAdd = useDocumentsStore((state) => state.createAndAdd);
  const navigate = useNavigate();

  const handleUse = (template: DocumentTemplate): void => {
    const doc = createAndAdd({
      title: template.name,
      content: template.content,
      presetId: template.presetId,
      paperStyle: template.paperStyle,
    });
    navigate(`/app/editor/${doc.id}`);
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground-strong">Plantillas</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Empieza desde contenido realista con Markdown y LaTeX. Cada plantilla trae su propio
          estilo de escritura y tipo de papel, que puedes cambiar luego en el editor.
        </p>
      </header>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {DOCUMENT_TEMPLATES.map((template) => (
          <TemplateCard key={template.id} template={template} onUse={handleUse} />
        ))}
      </div>
    </div>
  );
}
