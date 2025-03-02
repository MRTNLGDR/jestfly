
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

export const fetchUserNotes = async (userId: string): Promise<Note[]> => {
  try {
    const notesQuery = query(
      collection(firestore, 'notes'),
      where('userId', '==', userId),
      where('isArchived', '==', false),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(notesQuery);
    const fetchedNotes: Note[] = [];
    
    snapshot.forEach((doc) => {
      fetchedNotes.push({ id: doc.id, ...doc.data() } as Note);
    });
    
    return fetchedNotes;
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    toast.error('Falha ao carregar notas');
    throw error;
  }
};

export const saveNote = async (noteData: Partial<Note>, userId: string, currentNotes: Note[]): Promise<Note> => {
  try {
    const isNewNote = !noteData.id || !currentNotes.some(note => note.id === noteData.id);
    const noteRef = doc(firestore, 'notes', noteData.id || generateUniqueId());
    
    if (isNewNote) {
      // Criar nova nota
      const newNote = {
        ...noteData,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: false,
        isArchived: false
      } as Note;
      
      await setDoc(noteRef, newNote);
      return newNote;
    } else {
      // Atualizar nota existente
      await updateDoc(noteRef, {
        ...noteData,
        updatedAt: new Date()
      });
      
      // Atualizar links bidirecionais
      if (noteData.links && noteData.links.outgoing) {
        await updateBidirectionalLinks(noteData as Note);
      }
      
      const updatedNote = currentNotes.find(note => note.id === noteData.id);
      return { 
        ...updatedNote, 
        ...noteData, 
        updatedAt: new Date() 
      } as Note;
    }
  } catch (error) {
    console.error('Erro ao salvar nota:', error);
    throw error;
  }
};

export const updateBidirectionalLinks = async (noteData: Note): Promise<void> => {
  if (!noteData.links || !noteData.links.outgoing) return;
  
  // Para cada link de saída, verificar/atualizar o link de entrada correspondente
  for (const targetId of noteData.links.outgoing) {
    const targetNoteRef = doc(firestore, 'notes', targetId);
    const targetNoteSnap = await getDoc(targetNoteRef);
    
    if (targetNoteSnap.exists()) {
      const targetNote = targetNoteSnap.data() as Note;
      if (!targetNote.links.incoming || !targetNote.links.incoming.includes(noteData.id)) {
        // Adicionar o link de entrada no targetNote
        const updatedIncoming = [...(targetNote.links.incoming || []), noteData.id];
        await updateDoc(targetNoteRef, {
          'links.incoming': updatedIncoming,
          updatedAt: new Date()
        });
      }
    }
  }
};
