
import { Note } from '../models/Note';
import { supabase } from '../integrations/supabase/client';

export const notesService = {
  getUserNotes: async (userId: string): Promise<Note[]> => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      
      return data.map((note: any) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        tags: note.tags || [],
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at),
        userId: note.user_id
      }));
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  },
  
  saveNote: async (note: Note): Promise<Note | null> => {
    try {
      if (note.id) {
        // Update existing note
        const { data, error } = await supabase
          .from('notes')
          .update({
            title: note.title,
            content: note.content,
            tags: note.tags,
            updated_at: new Date().toISOString()
          })
          .eq('id', note.id)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } else {
        // Create new note
        const { data, error } = await supabase
          .from('notes')
          .insert({
            title: note.title,
            content: note.content,
            tags: note.tags,
            user_id: note.userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error saving note:', error);
      return null;
    }
  },
  
  deleteNote: async (noteId: string): Promise<boolean> => {
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
  }
};

export default notesService;
