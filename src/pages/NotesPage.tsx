
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth';
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
  const { userData } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'list' | 'graph'>('list');
  
  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);
      try {
        if (userData?.id) {
          console.log('Fetching notes for user:', userData.id);
          const fetchedNotes = await fetchUserNotes(userData.id);
          console.log('Fetched notes:', fetchedNotes);
          setNotes(fetchedNotes);
        } else {
          console.log('No user data available, skipping note fetch');
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast.error('Falha ao carregar notas');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotes();
  }, [userData]);
  
  const handleNoteSelect = async (noteId: string) => {
    console.log('Selecting note:', noteId);
    const foundNote = notes.find(note => note.id === noteId);
    
    if (foundNote) {
      setSelectedNote(foundNote);
    } else {
      // Pode ser um link para uma nota que ainda não existe
      const newNote = {
        id: noteId,
        userId: userData?.id || '',
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
    console.log('Creating new note');
    const newNote = {
      id: generateUniqueId(),
      userId: userData?.id || '',
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
  
  const handleSaveNote = async (noteData: Partial<Note>): Promise<Note | void> => {
    if (!userData) {
      console.error('Cannot save note: No user data available');
      toast.error('Você precisa estar logado para salvar notas');
      return;
    }
    
    try {
      console.log('Saving note:', noteData);
      const savedNote = await saveNote(noteData, userData.id, notes);
      console.log('Note saved successfully:', savedNote);
      
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
      
      return savedNote;
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      toast.error('Falha ao salvar nota');
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
