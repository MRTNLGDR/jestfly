
import React from 'react';
import { Note } from '../../models/Note';

interface NotesContentProps {
  selectedNote: Note | null;
}

export const NotesContent: React.FC<NotesContentProps> = ({ selectedNote }) => {
  if (!selectedNote) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        Selecione uma nota para visualizar seu conteúdo
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-white mb-4">{selectedNote.title}</h2>
      <div className="whitespace-pre-wrap text-zinc-300">{selectedNote.content}</div>
    </div>
  );
};
