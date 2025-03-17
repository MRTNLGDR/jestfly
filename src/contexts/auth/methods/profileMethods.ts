
import { supabase } from '../../../integrations/supabase/client';
import { UserProfile } from '../../../types/auth';
import { toast } from 'sonner';
import { ProfileType } from '../../../integrations/supabase/schema';

/**
 * Atualiza os dados do perfil de um usuário
 */
export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  try {
    console.log("Atualizando perfil para usuário:", userId);
    const { error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Erro na atualização do perfil:", error);
      throw error;
    }
    
    console.log("Perfil atualizado com sucesso");
    toast.success('Perfil atualizado com sucesso');
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

/**
 * Busca os dados do perfil de um usuário
 */
export const fetchUserData = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log("Buscando dados do usuário:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      // Tratar erro específico para perfil não encontrado
      if (error.code === 'PGRST116') {
        console.warn("Nenhum perfil encontrado para usuário:", userId);
        return null;
      }
      console.error("Erro ao buscar dados do usuário:", error);
      throw error;
    }
    
    console.log("Dados do usuário recebidos:", data ? "sucesso" : "não encontrado");
    
    if (data) {
      // Buscar contagens de seguidores e seguindo
      console.log("Buscando contagens de seguidores/seguindo");
      
      let followersCount = 0;
      let followingCount = 0;
      
      try {
        const { data: followers, error: followersError } = await supabase
          .rpc('count_followers', { user_id: userId });

        if (followersError) {
          console.error('Erro ao buscar seguidores:', followersError);
        } else {
          followersCount = followers || 0;
        }
      } catch (followerErr) {
        console.error('Exceção ao buscar seguidores:', followerErr);
      }
      
      try {
        const { data: following, error: followingError } = await supabase
          .rpc('count_following', { user_id: userId });

        if (followingError) {
          console.error('Erro ao buscar seguindo:', followingError);
        } else {
          followingCount = following || 0;
        }
      } catch (followingErr) {
        console.error('Exceção ao buscar seguindo:', followingErr);
      }
      
      // Cast seguro para garantir tipos corretos
      const profileType = (data.profile_type as ProfileType) || 'fan';
      
      // Fazendo cast seguro para UserProfile com valores padrão para os campos necessários
      const userProfile: UserProfile = {
        ...data,
        followers_count: followersCount,
        following_count: followingCount,
        is_verified: data.is_verified || false,
        avatar_url: data.avatar || '',  // Mapear o campo 'avatar' do banco para 'avatar_url'
        // Garantir que social_links seja do tipo correto
        social_links: data.social_links as UserProfile['social_links'] || {},
        // Convertendo o tipo preferences para o formato esperado
        preferences: data.preferences as UserProfile['preferences'] || {
          email_notifications: true,
          push_notifications: true,
          theme: 'dark',
          language: 'pt'
        },
        profile_type: profileType
      };
      
      console.log("Perfil de usuário preparado:", userProfile.display_name);
      return userProfile;
    }
    
    console.log("Nenhum dado de usuário encontrado para:", userId);
    return null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
};
