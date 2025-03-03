
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/types/auth';

export const useProfileFetch = () => {
  const [loading, setLoading] = useState(false);

  const fetchProfile = async (userId: string): Promise<ProfileData | null> => {
    try {
      console.log(`Buscando perfil para userId: ${userId}`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }
      
      console.log('Perfil recuperado:', data);
      return data as ProfileData;
    } catch (error) {
      console.error('Exceção ao buscar perfil:', error);
      return null;
    }
  };

  return {
    fetchProfile,
    loading,
    setLoading
  };
};
