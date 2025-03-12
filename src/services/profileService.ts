
import { supabase } from '../integrations/supabase/client';
import { UserProfile } from '../models/User';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    if (data) {
      // Buscar contagens de seguidores e seguindo
      const { data: followersCount, error: followersError } = await supabase
        .rpc('count_followers', { user_id: userId });

      const { data: followingCount, error: followingError } = await supabase
        .rpc('count_following', { user_id: userId });

      if (followersError) {
        console.error('Erro ao buscar seguidores:', followersError);
      }
      
      if (followingError) {
        console.error('Erro ao buscar seguindo:', followingError);
      }
      
      // Convertendo para o formato esperado por UserProfile
      const userProfile: UserProfile = {
        id: data.id,
        email: data.email || '',
        display_name: data.display_name || '',
        username: data.username || '',
        avatar_url: data.avatar_url || '',
        bio: data.bio || '',
        followers_count: followersCount || 0,
        following_count: followingCount || 0,
        profile_type: data.profile_type || 'fan',
        is_verified: Boolean(data.is_verified),
        social_links: data.social_links || {},
        preferences: data.preferences || {
          email_notifications: true,
          push_notifications: true,
          theme: 'dark',
          language: 'pt'
        },
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        last_login: data.last_login || new Date().toISOString()
      };
      
      return userProfile;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string, 
  data: Partial<UserProfile>
): Promise<UserProfile | null> => {
  try {
    const { data: updatedData, error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    if (updatedData) {
      return await fetchUserProfile(userId);
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return null;
  }
};
