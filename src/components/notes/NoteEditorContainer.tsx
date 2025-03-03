
import React from 'react';
import { Note } from '../../models/Note';
import { NoteEditor } from './NoteEditor';
import { EmptyNoteState } from './EmptyNoteState';

interface NoteEditorContainerProps {
  selectedNote: Note | null;
  onSaveNote: (note: Note) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  onCreateNote: () => void;
}

export const NoteEditorContainer: React.FC<NoteEditorContainerProps> = ({
  selectedNote,
  onSaveNote,
  onDeleteNote,
  onCreateNote
}) => {
  if (selectedNote) {
    return (
      <NoteEditor 
        note={selectedNote}
        onSave={onSaveNote}
        onDelete={onDeleteNote}
      />
    );
  }
  
  return <EmptyNoteState onCreateNote={onCreateNote} />;
};
