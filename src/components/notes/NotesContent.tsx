
import React from 'react';
import { Note } from '../../models/Note';
import { NotesList } from './NotesList';
import { GraphView } from './GraphView';

interface NotesContentProps {
  notes: Note[];
  selectedNoteId?: string;
  onNoteSelect: (noteId: string) => void;
  isLoading: boolean;
  view: 'list' | 'graph';
}

export const NotesContent: React.FC<NotesContentProps> = ({
  notes,
  selectedNoteId,
  onNoteSelect,
  isLoading,
  view
}) => {
  if (view === 'list') {
    return (
      <NotesList 
        notes={notes} 
        selectedNoteId={selectedNoteId}
        onNoteSelect={onNoteSelect}
        isLoading={isLoading}
      />
    );
  }
  
  return (
    <GraphView 
      notes={notes}
      selectedNoteId={selectedNoteId}
      onNoteSelect={onNoteSelect}
    />
  );
};
