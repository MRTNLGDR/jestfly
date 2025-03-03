
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import { Note } from '../models/Note';
import { NotesList } from '../components/notes/NotesList';
import { NoteEditor } from '../components/notes/NoteEditor';
import { NotesContent } from '../components/notes/NotesContent';
import { NoteViewToggle } from '../components/notes/NoteViewToggle';
import { EmptyNoteState } from '../components/notes/EmptyNoteState';
import { notesService } from '../services/notesService';

const NotesPage: React.FC = () => {
  const { userData } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [view, setView] = useState<'list' | 'graph'>('list');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      fetchNotes();
    }
  }, [userData]);

  const fetchNotes = async () => {
    if (!userData) return;
    
    setIsLoading(true);
    try {
      const userNotes = await notesService.getUserNotes(userData.id);
      setNotes(userNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  const handleSaveNote = async (note: Note) => {
    try {
      const savedNote = await notesService.saveNote(note);
      if (savedNote) {
        if (note.id) {
          // Update existing note in the list
          setNotes(notes.map(n => n.id === savedNote.id ? savedNote : n));
          setSelectedNote(savedNote);
        } else {
          // Add new note to the list
          setNotes([savedNote, ...notes]);
          setSelectedNote(savedNote);
        }
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const success = await notesService.deleteNote(noteId);
      if (success) {
        setNotes(notes.filter(note => note.id !== noteId));
        if (selectedNote?.id === noteId) {
          setSelectedNote(null);
        }
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleCreateNote = () => {
    if (!userData) return;
    
    const newNote: Note = {
      id: '', // This will be generated by the database
      title: 'Nova Nota',
      content: '',
      tags: [],
      links: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userData.id,
      isPinned: false,
      isArchived: false
    };
    
    setSelectedNote(newNote);
  };

  return (
    <div className="flex h-full min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Notas</h1>
          <div className="flex items-center gap-4">
            <NoteViewToggle view={view} setView={setView} />
            <button
              onClick={handleCreateNote}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
            >
              Nova Nota
            </button>
          </div>
        </div>
        
        <div className="flex flex-1 gap-6 h-full">
          <div className="w-1/3 bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
            <NotesList 
              notes={notes} 
              onNoteSelect={handleSelectNote} 
              selectedNoteId={selectedNote?.id}
              isLoading={isLoading}
              view={view}
            />
          </div>
          
          <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
            {selectedNote ? (
              <NoteEditor 
                note={selectedNote} 
                onSave={handleSaveNote}
                onDelete={handleDeleteNote}
              />
            ) : (
              <EmptyNoteState onCreateNote={handleCreateNote} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
