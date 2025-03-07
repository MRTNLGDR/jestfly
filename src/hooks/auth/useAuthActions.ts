
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as ProfileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { error };
      }

      if (data.user) {
        const profileData = await fetchProfile(data.user.id);
        return { user: data.user, profile: profileData, error: undefined };
      }

      return { error: undefined };
    } catch (error: any) {
      return { error: new Error(error.message || 'Error during sign in') };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: Partial<ProfileData>) => {
    setIsLoading(true);
    try {
      const profileType = userData?.profile_type || 'fan';
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            display_name: userData?.display_name,
            username: userData?.username,
            profileType: profileType as 'fan' | 'artist' | 'admin' | 'collaborator'
          }
        }
      });

      if (error) {
        return { error };
      }

      toast.success('Registro realizado com sucesso! Verifique seu email.');
      return { error: undefined };
    } catch (error: any) {
      return { error: new Error(error.message || 'Error during sign up') };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Erro ao sair');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<ProfileData>, userId: string, currentProfile: ProfileData | null) => {
    if (!userId || !currentProfile) {
      toast.error('Você precisa estar logado para atualizar seu perfil');
      return false;
    }

    setIsLoading(true);
    try {
      const updateData: {
        display_name?: string;
        username?: string;
        profile_type?: 'fan' | 'artist' | 'admin' | 'collaborator';
        bio?: string;
        avatar?: string;
        wallet_address?: string;
        updated_at?: string;
      } = { ...data };
      
      if (data.profile_type && !['fan', 'artist', 'admin', 'collaborator'].includes(data.profile_type)) {
        throw new Error('Invalid profile type');
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        throw error;
      }

      toast.success('Perfil atualizado com sucesso!');
      return true;
    } catch (error: any) {
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File, userId: string) => {
    if (!userId) {
      throw new Error('Você precisa estar logado para fazer upload de avatar');
    }

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (data) {
        return { avatarUrl: data.publicUrl };
      }

      throw new Error('Erro ao obter URL do avatar');
    } catch (error: any) {
      toast.error(`Erro ao fazer upload do avatar: ${error.message}`);
      throw error;
    }
  };

  return {
    isLoading,
    fetchProfile,
    signIn,
    signUp,
    signOut,
    updateProfile,
    uploadAvatar
  };
};
