
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfileFetch } from './useProfileFetch';

export const useProfileRefresh = (setProfile: (profile: any) => void) => {
  const [loading, setLoading] = useState(false);
  const { fetchProfile } = useProfileFetch();

  const refreshProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('Atualizando dados do perfil para usuário:', user.id);
        const profileData = await fetchProfile(user.id);
        if (profileData) {
          console.log('Perfil atualizado com sucesso:', profileData);
          setProfile(profileData);
          setLoading(false);
          return true;
        } else {
          console.warn('Não foi possível atualizar o perfil do usuário:', user.id);
          setLoading(false);
          return false;
        }
      } else {
        console.log('Tentativa de atualizar perfil sem usuário autenticado');
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setLoading(false);
      return false;
    }
  };

  return {
    refreshProfile,
    loading
  };
};
