import { useMemo } from 'react';
import type { ClabethDocument } from '../../types/document';
import { splitIntoBlocks } from '../../lib/markdown/blocks';
import { pageDimensions } from '../../lib/paper/styles';
import { DocumentCard } from '../molecules/DocumentCard';
import { PreviewPage } from './PreviewPage';

const THUMB_WIDTH = 190;

function LiveThumbnail({ document }: { document: ClabethDocument }) {
  const blocks = useMemo(
    () => splitIntoBlocks(document.content).filter((b) => !b.pageBreak).slice(0, 6),
    [document.content],
  );
  const dims = pageDimensions(document.paper.size, document.paper.orientation);
  const zoom = THUMB_WIDTH / dims.width;

  return (
    <div style={{ maxHeight: 150, overflow: 'hidden' }}>
      <PreviewPage
        document={document}
        blocks={blocks}
        pageIndex={0}
        totalPages={1}
        zoom={zoom}
      />
    </div>
  );
}

export interface DocumentGridProps {
  documents: ClabethDocument[];
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DocumentGrid({ documents, onOpen, onDuplicate, onRename, onDelete }: DocumentGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          thumbnail={<LiveThumbnail document={doc} />}
          onOpen={onOpen}
          onDuplicate={onDuplicate}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
