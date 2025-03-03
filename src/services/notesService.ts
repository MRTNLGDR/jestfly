
import { supabase } from '../integrations/supabase/client';
import { Note } from '../models/Note';

// Função para buscar todas as notas do usuário
export const fetchNotes = async (userId: string): Promise<Note[]> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as Note[];
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};

// Função para buscar uma nota específica
export const fetchNote = async (noteId: string): Promise<Note | null> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .single();
    
    if (error) throw error;
    
    return data as Note;
  } catch (error) {
    console.error('Error fetching note:', error);
    return null;
  }
};

// Função para criar uma nova nota
export const createNote = async (userId: string, note: Partial<Note>): Promise<Note | null> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ ...note, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Note;
  } catch (error) {
    console.error('Error creating note:', error);
    return null;
  }
};

// Função para atualizar uma nota existente
export const updateNote = async (noteId: string, updates: Partial<Note>): Promise<Note | null> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', noteId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Note;
  } catch (error) {
    console.error('Error updating note:', error);
    return null;
  }
};

// Função para excluir uma nota
export const deleteNote = async (noteId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
};
