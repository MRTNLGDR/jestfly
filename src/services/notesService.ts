
import { Note } from '../models/Note';
import { supabase } from '../integrations/supabase/client';

// Create custom type to handle the database response
type NotesResponse = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  links: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
  is_pinned: boolean;
  is_archived: boolean;
};

export const notesService = {
  getUserNotes: async (userId: string): Promise<Note[]> => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false }) as { data: NotesResponse[] | null, error: any };
        
      if (error) throw error;
      
      return (data || []).map((note: NotesResponse) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        tags: note.tags || [],
        links: note.links || [],
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at),
        userId: note.user_id,
        isPinned: note.is_pinned || false,
        isArchived: note.is_archived || false
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
            links: note.links,
            is_pinned: note.isPinned,
            is_archived: note.isArchived,
            updated_at: new Date().toISOString()
          })
          .eq('id', note.id)
          .select()
          .single() as { data: NotesResponse | null, error: any };
          
        if (error) throw error;
        
        if (!data) return null;
        
        return {
          id: data.id,
          title: data.title,
          content: data.content,
          tags: data.tags || [],
          links: data.links || [],
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          userId: data.user_id,
          isPinned: data.is_pinned || false,
          isArchived: data.is_archived || false
        };
      } else {
        // Create new note
        const { data, error } = await supabase
          .from('notes')
          .insert({
            title: note.title,
            content: note.content,
            tags: note.tags,
            links: note.links,
            is_pinned: note.isPinned,
            is_archived: note.isArchived,
            user_id: note.userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single() as { data: NotesResponse | null, error: any };
          
        if (error) throw error;
        
        if (!data) return null;
        
        return {
          id: data.id,
          title: data.title,
          content: data.content,
          tags: data.tags || [],
          links: data.links || [],
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          userId: data.user_id,
          isPinned: data.is_pinned || false,
          isArchived: data.is_archived || false
        };
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
