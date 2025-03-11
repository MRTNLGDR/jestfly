
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth/useAuth';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
  is_archived: boolean;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      setNotes(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load notes');
      console.error('Error fetching notes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createNote = useCallback(async (note: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            ...note,
            user_id: user.id,
            is_archived: false
          }
        ])
        .select();
      
      if (error) throw error;
      
      setNotes(prev => [...prev, data[0]]);
      toast.success('Note created successfully');
      return data[0];
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to create note');
      console.error('Error creating note:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateNote = useCallback(async (id: string, updates: Partial<Omit<Note, 'id' | 'created_at' | 'user_id'>>) => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setNotes(prev => prev.map(note => 
        note.id === id ? { ...note, ...updates, updated_at: new Date().toISOString() } : note
      ));
      
      toast.success('Note updated successfully');
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to update note');
      console.error('Error updating note:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const archiveNote = useCallback(async (id: string) => {
    return updateNote(id, { is_archived: true });
  }, [updateNote]);

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    archiveNote
  };
}
