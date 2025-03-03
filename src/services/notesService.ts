
import { supabase } from '../integrations/supabase/client';
import { Note } from '../models/Note';

// Helper function to transform database note to application Note model
const transformDBNoteToAppNote = (dbNote: any): Note => {
  return {
    id: dbNote.id,
    title: dbNote.title,
    content: dbNote.content,
    userId: dbNote.user_id,
    isPinned: dbNote.is_pinned || false,
    isArchived: dbNote.is_archived || false,
    tags: dbNote.tags || [],
    links: dbNote.links || [],
    createdAt: new Date(dbNote.created_at),
    updatedAt: new Date(dbNote.updated_at)
  };
};

// Helper function to transform application Note to database format
const transformAppNoteToDBNote = (appNote: Partial<Note>) => {
  const dbNote: Record<string, any> = {};
  
  if (appNote.title !== undefined) dbNote.title = appNote.title;
  if (appNote.content !== undefined) dbNote.content = appNote.content;
  if (appNote.isPinned !== undefined) dbNote.is_pinned = appNote.isPinned;
  if (appNote.isArchived !== undefined) dbNote.is_archived = appNote.isArchived;
  if (appNote.tags !== undefined) dbNote.tags = appNote.tags;
  if (appNote.links !== undefined) dbNote.links = appNote.links;
  
  return dbNote;
};

// Function to fetch all notes for a user
export const fetchNotes = async (userId: string): Promise<Note[]> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform each database note to application Note model
    return (data || []).map(transformDBNoteToAppNote);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};

// Function to fetch a specific note
export const fetchNote = async (noteId: string): Promise<Note | null> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) return null;
    
    return transformDBNoteToAppNote(data);
  } catch (error) {
    console.error('Error fetching note:', error);
    return null;
  }
};

// Function to create a new note
export const createNote = async (userId: string, note: Partial<Note>): Promise<Note | null> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ 
        ...transformAppNoteToDBNote(note), 
        user_id: userId,
        title: note.title || 'Untitled Note'
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return transformDBNoteToAppNote(data);
  } catch (error) {
    console.error('Error creating note:', error);
    return null;
  }
};

// Function to update an existing note
export const updateNote = async (noteId: string, updates: Partial<Note>): Promise<Note | null> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .update(transformAppNoteToDBNote(updates))
      .eq('id', noteId)
      .select()
      .single();
    
    if (error) throw error;
    
    return transformDBNoteToAppNote(data);
  } catch (error) {
    console.error('Error updating note:', error);
    return null;
  }
};

// Function to delete a note
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
