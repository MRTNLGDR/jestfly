
import { supabase } from '../../../integrations/supabase/client';
import { UserProfile } from '../../../models/User';
import { toast } from 'sonner';

/**
 * Updates a user's profile data
 */
export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  try {
    console.log("Updating profile for user:", userId);
    const { error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Update profile error:", error);
      throw error;
    }
    
    console.log("Profile updated successfully");
    toast.success('Perfil atualizado com sucesso');
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

/**
 * Fetches a user's profile data
 */
export const fetchUserData = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log("Fetching user data for:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.warn("No profile found for user:", userId);
        return null;
      }
      console.error("Error fetching user data:", error);
      throw error;
    }
    
    console.log("User data received:", data ? "success" : "not found");
    
    if (data) {
      // Buscar contagens de seguidores e seguindo
      console.log("Fetching followers/following counts");
      
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
      
      // Fazendo cast seguro para UserProfile com valores padrão para os campos necessários
      const userProfile: UserProfile = {
        ...data,
        followers_count: followersCount,
        following_count: followingCount,
        is_verified: data.is_verified || false,
        avatar_url: data.avatar || '',  // Map the database 'avatar' field to 'avatar_url'
        // Garantir que social_links seja do tipo correto
        social_links: data.social_links as UserProfile['social_links'] || {},
        // Convertendo o tipo preferences para o formato esperado
        preferences: data.preferences as UserProfile['preferences'] || {
          email_notifications: true,
          push_notifications: true,
          theme: 'dark',
          language: 'pt'
        }
      };
      
      console.log("User profile prepared:", userProfile.display_name);
      return userProfile;
    }
    
    console.log("No user data found for:", userId);
    return null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
};
