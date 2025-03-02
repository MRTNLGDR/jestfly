
import React from 'react';
import { Note } from '../../models/Note';
import { NoteEditor } from './NoteEditor';
import { EmptyNoteState } from './EmptyNoteState';

interface NoteEditorContainerProps {
  selectedNote: Note | null;
  onSaveNote: (noteData: Partial<Note>) => Promise<void>;
  onNoteSelect: (noteId: string) => void;
  onCreateNote: () => void;
}

export const NoteEditorContainer: React.FC<NoteEditorContainerProps> = ({
  selectedNote,
  onSaveNote,
  onNoteSelect,
  onCreateNote
}) => {
  if (selectedNote) {
    return (
      <NoteEditor 
        initialNote={selectedNote}
        onSave={onSaveNote}
        onLinkClick={onNoteSelect}
      />
    );
  }
  
  return <EmptyNoteState onCreateNote={onCreateNote} />;
};
