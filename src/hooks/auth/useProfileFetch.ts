
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/types/auth';

export const useProfileFetch = () => {
  const [loading, setLoading] = useState(false);

  const fetchProfile = async (userId: string): Promise<ProfileData | null> => {
    try {
      setLoading(true);
      console.log(`Buscando perfil para userId: ${userId}`);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        setLoading(false);
        return null;
      }
      
      console.log('Perfil recuperado:', data);
      setLoading(false);
      return data as ProfileData;
    } catch (error) {
      console.error('Exceção ao buscar perfil:', error);
      setLoading(false);
      return null;
    }
  };

  return {
    fetchProfile,
    loading,
    setLoading
  };
};
