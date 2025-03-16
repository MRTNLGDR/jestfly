
import { supabase } from '../integrations/supabase/client';
import { UserProfile } from '../models/User';
import { Post } from '../models/Post';
import { ProfileType } from '../integrations/supabase/schema';
import { toast } from 'sonner';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log(`Iniciando busca de perfil para usuário: ${userId}`);
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    console.log(`Tempo para buscar perfil básico: ${Date.now() - startTime}ms`);
    
    if (error) {
      console.error(`Erro ao buscar perfil: ${error.message}`, error);
      
      // Se for um erro de RLS, mostre uma mensagem mais amigável
      if (error.message.includes('policy') || error.message.includes('permission')) {
        toast.error("Erro de permissão ao buscar perfil. Tente fazer login novamente.");
      }
      
      throw error;
    }
    
    if (!data) {
      console.warn(`Nenhum perfil encontrado para o usuário: ${userId}`);
      
      // Tente criar um perfil vazio para correção automática
      const { error: sessionError, data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionError && sessionData.session?.user) {
        const user = sessionData.session.user;
        const userMetadata = user.user_metadata || {};
        
        try {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: user.email,
              display_name: userMetadata.display_name || userMetadata.name || user.email?.split('@')[0] || 'User',
              username: userMetadata.username || user.email?.split('@')[0] || `user_${Date.now()}`,
              profile_type: userMetadata.profile_type || 'fan',
              avatar: userMetadata.avatar_url || null,
              is_verified: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_login: new Date().toISOString()
            });
            
          if (!insertError) {
            console.log("Perfil criado automaticamente. Tentando buscar novamente.");
            const { data: newData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .maybeSingle();
              
            if (newData) {
              toast.success("Perfil recuperado com sucesso!");
              console.log("Perfil recuperado após criar automaticamente");
              
              // Continue com o processamento normal usando o novo perfil
              data = newData;
            } else {
              return null; // Ainda não conseguimos encontrar mesmo após criar
            }
          } else {
            console.error("Erro ao criar perfil automaticamente:", insertError);
            return null;
          }
        } catch (e) {
          console.error("Erro ao tentar criar perfil automaticamente:", e);
          return null;
        }
      } else {
        return null;
      }
    }
    
    // Buscar contagens de seguidores e seguindo
    console.log(`Buscando contagens para usuário: ${userId}`);
    const followersStartTime = Date.now();
    
    // Fazer ambas as chamadas em paralelo
    const [followersResult, followingResult] = await Promise.all([
      supabase.rpc('count_followers', { user_id: userId }),
      supabase.rpc('count_following', { user_id: userId })
    ]);
    
    console.log(`Tempo para buscar contagens: ${Date.now() - followersStartTime}ms`);
    
    const followersCount = followersResult.data || 0;
    const followingCount = followingResult.data || 0;
    
    if (followersResult.error) {
      console.error('Erro ao buscar seguidores:', followersResult.error);
    }
    
    if (followingResult.error) {
      console.error('Erro ao buscar seguindo:', followingResult.error);
    }
    
    // Cast safely to ensure correct types
    const profileType = data.profile_type as ProfileType || 'fan';
    
    // Ensure social_links and preferences are properly typed
    const socialLinks = typeof data.social_links === 'object' && data.social_links !== null 
      ? data.social_links 
      : {};
      
    const preferences = typeof data.preferences === 'object' && data.preferences !== null 
      ? data.preferences 
      : {
          email_notifications: true,
          push_notifications: true,
          theme: 'dark' as 'dark' | 'light' | 'system',
          language: 'pt'
        };
    
    // Convertendo para o formato esperado por UserProfile
    const userProfile: UserProfile = {
      id: data.id,
      email: data.email || '',
      display_name: data.display_name || '',
      username: data.username || '',
      avatar_url: data.avatar || '', // Map the database 'avatar' field to the expected 'avatar_url'
      bio: data.bio || '',
      followers_count: followersCount || 0,
      following_count: followingCount || 0,
      profile_type: profileType,
      is_verified: Boolean(data.is_verified),
      social_links: socialLinks as UserProfile['social_links'],
      preferences: preferences as UserProfile['preferences'],
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      last_login: data.last_login || new Date().toISOString()
    };
    
    console.log(`Perfil completo carregado: ${userProfile.display_name}`);
    return userProfile;
  } catch (error: any) {
    console.error(`Erro ao buscar perfil do usuário: ${error.message}`, error);
    throw error;
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

// Due to missing function, these will need to be implemented directly
export const followUser = async (userId: string, targetUserId: string): Promise<boolean> => {
  try {
    // Check if already following
    const isAlreadyFollowing = await checkIfFollowing(userId, targetUserId);
    
    if (isAlreadyFollowing) {
      return true; // Already following
    }
    
    // Insert follow relationship
    const { error } = await supabase
      .from('user_follows')
      .insert({
        follower_id: userId,
        following_id: targetUserId
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao seguir usuário:", error);
    return false;
  }
};

export const unfollowUser = async (userId: string, targetUserId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_follows')
      .delete()
      .match({
        follower_id: userId,
        following_id: targetUserId
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao deixar de seguir usuário:", error);
    return false;
  }
};

export const checkIfFollowing = async (userId: string, targetUserId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select('*')
      .match({
        follower_id: userId,
        following_id: targetUserId
      })
      .maybeSingle();
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error("Erro ao verificar se segue usuário:", error);
    return false;
  }
};

export const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*, profiles:profiles(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as unknown as Post[] || [];
  } catch (error) {
    console.error("Erro ao buscar posts do usuário:", error);
    return [];
  }
};
