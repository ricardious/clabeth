import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useDocumentsStore } from '../../store/documents';
import { Button } from '../atoms/Button';

export function TopBar({ title }: { title: string }) {
  const navigate = useNavigate();
  const createAndAdd = useDocumentsStore((state) => state.createAndAdd);

  const handleNew = (): void => {
    const doc = createAndAdd({ title: 'Sin título' });
    navigate(`/app/editor/${doc.id}`);
  };

  return (
    <header className="flex h-[var(--topbar-h)] shrink-0 items-center gap-3 border-b border-outline bg-surface px-4">
      <h1 className="font-display text-[17px] font-semibold text-foreground-strong">{title}</h1>
      <div className="ml-auto">
        <Button size="sm" onClick={handleNew}>
          <Plus size={15} aria-hidden /> Nuevo documento
        </Button>
      </div>
    </header>
  );
}
