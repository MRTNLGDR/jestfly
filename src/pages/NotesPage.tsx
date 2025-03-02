
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "../components/ui/button";
import { PlusIcon } from "lucide-react";
import { Note } from '../models/Note';
import { generateUniqueId } from '../utils/noteUtils';
import { toast } from 'sonner';
import { fetchUserNotes, saveNote } from '../services/notesService';
import { NoteViewToggle } from '../components/notes/NoteViewToggle';
import { NotesContent } from '../components/notes/NotesContent';
import { NoteEditorContainer } from '../components/notes/NoteEditorContainer';

const NotesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'list' | 'graph'>('list');
  
  useEffect(() => {
    if (!currentUser) return;
    
    const loadNotes = async () => {
      setIsLoading(true);
      try {
        const fetchedNotes = await fetchUserNotes(currentUser.uid);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('Erro ao buscar notas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotes();
  }, [currentUser]);
  
  const handleNoteSelect = async (noteId: string) => {
    const foundNote = notes.find(note => note.id === noteId);
    
    if (foundNote) {
      setSelectedNote(foundNote);
    } else {
      // Pode ser um link para uma nota que ainda não existe
      const newNote = {
        id: noteId,
        userId: currentUser?.uid || '',
        title: noteId, // Usa o ID como título inicial
        content: '',
        tags: [],
        links: {
          incoming: [],
          outgoing: []
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: false,
        isArchived: false
      };
      
      await handleSaveNote(newNote);
      setSelectedNote(newNote);
    }
  };
  
  const handleCreateNote = () => {
    const newNote = {
      id: generateUniqueId(),
      userId: currentUser?.uid || '',
      title: 'Nova Nota',
      content: '',
      tags: [],
      links: {
        incoming: [],
        outgoing: []
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      isArchived: false
    };
    
    setSelectedNote(newNote);
  };
  
  const handleSaveNote = async (noteData: Partial<Note>) => {
    if (!currentUser) return;
    
    try {
      const savedNote = await saveNote(noteData, currentUser.uid, notes);
      
      // Update local state
      const isNewNote = !notes.some(note => note.id === savedNote.id);
      
      if (isNewNote) {
        setNotes(prev => [savedNote, ...prev]);
      } else {
        setNotes(prev => 
          prev.map(note => note.id === savedNote.id ? savedNote : note)
        );
      }
      
      // Update selected note if current
      if (selectedNote?.id === savedNote.id) {
        setSelectedNote(savedNote);
      }
      
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      throw error;
    }
  };
  
  const handleViewChange = (newView: 'list' | 'graph') => {
    setView(newView);
  };
  
  return (
    <div className="container mx-auto py-6 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Base de Conhecimento</h1>
        <div className="flex items-center gap-4">
          <NoteViewToggle view={view} onViewChange={handleViewChange} />
          <Button onClick={handleCreateNote} size="sm">
            <PlusIcon size={16} className="mr-1" />
            Nova Nota
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 lg:col-span-3">
          <NotesContent 
            notes={notes}
            selectedNoteId={selectedNote?.id}
            onNoteSelect={handleNoteSelect}
            isLoading={isLoading}
            view={view}
          />
        </div>
        
        <div className="md:col-span-8 lg:col-span-9">
          <NoteEditorContainer
            selectedNote={selectedNote}
            onSaveNote={handleSaveNote}
            onNoteSelect={handleNoteSelect}
            onCreateNote={handleCreateNote}
          />
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
