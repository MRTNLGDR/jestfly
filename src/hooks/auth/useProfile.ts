
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { ProfileData } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

export const useProfile = (user: User | null, setProfile: (profile: ProfileData | null) => void) => {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const updateProfile = async (profileData: Partial<ProfileData>) => {
    if (!user) {
      console.error('Tentativa de atualizar perfil sem usuário autenticado');
      return { data: null, error: new Error('Usuário não autenticado') };
    }

    try {
      setUpdating(true);
      console.log('Atualizando perfil para usuário:', user.id, 'com dados:', profileData);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        toast({
          title: "Erro ao atualizar perfil",
          description: error.message,
          variant: "destructive",
        });
        setUpdating(false);
        return { data: null, error };
      }

      console.log('Perfil atualizado com sucesso:', data);
      setProfile(data as ProfileData);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
        variant: "default",
      });

      setUpdating(false);
      return { data: data as ProfileData, error: null };
    } catch (error) {
      console.error('Exceção ao atualizar perfil:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: (error as Error).message,
        variant: "destructive",
      });
      setUpdating(false);
      return { data: null, error: error as Error };
    }
  };

  return {
    updateProfile,
    updating
  };
};
