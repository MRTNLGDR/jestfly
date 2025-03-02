
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NoteEditor } from '../components/notes/NoteEditor';
import { NotesList } from '../components/notes/NotesList';
import { Button } from "../components/ui/button";
import { PlusIcon, LayoutListIcon, NetworkIcon } from "lucide-react";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { Note } from '../models/Note';
import { generateUniqueId } from '../utils/noteUtils';
import { toast } from 'sonner';

const NotesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'list' | 'graph'>('list');
  
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const notesQuery = query(
          collection(firestore, 'notes'),
          where('userId', '==', currentUser.uid),
          where('isArchived', '==', false),
          orderBy('updatedAt', 'desc')
        );
        
        const snapshot = await getDocs(notesQuery);
        const fetchedNotes: Note[] = [];
        
        snapshot.forEach((doc) => {
          fetchedNotes.push({ id: doc.id, ...doc.data() } as Note);
        });
        
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('Erro ao buscar notas:', error);
        toast.error('Falha ao carregar notas');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotes();
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
      const isNewNote = !noteData.id || !notes.some(note => note.id === noteData.id);
      const noteRef = doc(firestore, 'notes', noteData.id || generateUniqueId());
      
      if (isNewNote) {
        // Criar nova nota
        const newNote = {
          ...noteData,
          userId: currentUser.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
          isPinned: false,
          isArchived: false
        };
        
        await setDoc(noteRef, newNote);
        
        // Adicionar à lista local
        setNotes(prev => [newNote as Note, ...prev]);
        setSelectedNote(newNote as Note);
      } else {
        // Atualizar nota existente
        await updateDoc(noteRef, {
          ...noteData,
          updatedAt: new Date()
        });
        
        // Atualizar na lista local
        setNotes(prev => 
          prev.map(note => 
            note.id === noteData.id 
              ? { ...note, ...noteData, updatedAt: new Date() } 
              : note
          )
        );
        
        // Atualizar seleção se for a nota atual
        if (selectedNote?.id === noteData.id) {
          setSelectedNote(prev => prev ? { ...prev, ...noteData, updatedAt: new Date() } : null);
        }
        
        // Atualizar links bidirecionais
        if (noteData.links && noteData.links.outgoing) {
          // Para cada link de saída, verificar/atualizar o link de entrada correspondente
          for (const targetId of noteData.links.outgoing) {
            const targetNoteRef = doc(firestore, 'notes', targetId);
            const targetNoteSnap = await getDoc(targetNoteRef);
            
            if (targetNoteSnap.exists()) {
              const targetNote = targetNoteSnap.data() as Note;
              if (!targetNote.links.incoming || !targetNote.links.incoming.includes(noteData.id!)) {
                // Adicionar o link de entrada no targetNote
                const updatedIncoming = [...(targetNote.links.incoming || []), noteData.id!];
                await updateDoc(targetNoteRef, {
                  'links.incoming': updatedIncoming,
                  updatedAt: new Date()
                });
                
                // Atualizar na lista local
                setNotes(prev => 
                  prev.map(note => 
                    note.id === targetId 
                      ? { 
                          ...note, 
                          links: { 
                            ...note.links, 
                            incoming: updatedIncoming 
                          },
                          updatedAt: new Date()
                        } 
                      : note
                  )
                );
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      throw error;
    }
  };
  
  return (
    <div className="container mx-auto py-6 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Base de Conhecimento</h1>
        <div className="flex items-center gap-4">
          <div className="bg-zinc-800 rounded-md p-1 flex">
            <Button
              size="sm"
              variant={view === 'list' ? 'default' : 'ghost'}
              onClick={() => setView('list')}
              className={view === 'list' ? 'bg-zinc-700' : ''}
            >
              <LayoutListIcon size={18} />
            </Button>
            <Button
              size="sm"
              variant={view === 'graph' ? 'default' : 'ghost'}
              onClick={() => setView('graph')}
              className={view === 'graph' ? 'bg-zinc-700' : ''}
            >
              <NetworkIcon size={18} />
            </Button>
          </div>
          <Button onClick={handleCreateNote} size="sm">
            <PlusIcon size={16} className="mr-1" />
            Nova Nota
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 lg:col-span-3">
          {view === 'list' ? (
            <NotesList 
              notes={notes} 
              selectedNoteId={selectedNote?.id}
              onNoteSelect={handleNoteSelect}
              isLoading={isLoading}
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center bg-zinc-900/50 border border-zinc-800 rounded-md">
              <p className="text-zinc-500">Visualização em grafo será implementada em breve</p>
            </div>
          )}
        </div>
        
        <div className="md:col-span-8 lg:col-span-9">
          {selectedNote ? (
            <NoteEditor 
              initialNote={selectedNote}
              onSave={handleSaveNote}
              onLinkClick={handleNoteSelect}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-zinc-900/50 rounded-md border border-zinc-800 text-zinc-400">
              <p>Selecione uma nota ou crie uma nova</p>
              <Button 
                onClick={handleCreateNote} 
                variant="outline" 
                className="mt-4"
              >
                <PlusIcon size={16} className="mr-1" />
                Criar Nota
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
