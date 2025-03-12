
import React from 'react';
import { Note } from '../../models/Note';

interface GraphViewProps {
  notes: Note[];
  selectedNoteId?: string;
  onNoteSelect: (noteId: string) => void;
}

export const GraphView: React.FC<GraphViewProps> = ({
  notes,
  selectedNoteId,
  onNoteSelect
}) => {
  return (
    <div className="h-[400px] flex items-center justify-center bg-zinc-900/50 border border-zinc-800 rounded-md">
      <p className="text-zinc-500">Visualização em grafo será implementada em breve</p>
    </div>
  );
};
