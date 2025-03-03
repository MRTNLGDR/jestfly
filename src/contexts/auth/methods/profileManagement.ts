
import { supabase } from '../../../integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '../../../models/User';
import { createSupabaseUserData, prepareUserDataForSupabase } from '../userDataTransformer';

/**
 * Atualiza o perfil do usuário no Supabase
 */
export const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<void> => {
  try {
    const profileData = prepareUserDataForSupabase(userData);
    
    // Atualizar perfil na tabela profiles
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
    
    if (error) {
      throw error;
    }
    
    toast.success('Perfil atualizado com sucesso!');
  } catch (err: any) {
    console.error("Erro ao atualizar perfil:", err);
    toast.error('Falha ao atualizar perfil');
    throw err;
  }
};

/**
 * Busca os dados do perfil do usuário no Supabase
 */
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    // Buscar dados do usuário na tabela auth
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      throw authError;
    }
    
    if (!authData || !authData.user) {
      return null;
    }
    
    // Buscar perfil na tabela profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      throw profileError;
    }
    
    if (!profileData) {
      return null;
    }
    
    // Buscar papeis do usuário
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    const roles = rolesData ? rolesData.map(r => r.role) : [];
    
    // Transformar dados para o formato da aplicação
    return createUserDataFromProfile(authData.user, profileData, roles);
  } catch (err: any) {
    console.error("Erro ao buscar perfil:", err);
    return null;
  }
};

// Helper function to properly type and convert the profile data
function createUserDataFromProfile(
  authUser: any, 
  profileData: any, 
  roles: string[]
): User {
  return {
    id: profileData.id,
    email: authUser.email,
    username: profileData.username || '',
    displayName: profileData.full_name || profileData.username || '',
    profileType: (profileData.profile_type as 'artist' | 'fan' | 'admin' | 'collaborator') || 'fan',
    avatar: profileData.avatar_url || undefined,
    bio: profileData.bio || undefined,
    socialLinks: profileData.social_links || {},
    walletAddress: profileData.wallet_address || undefined,
    createdAt: profileData.created_at ? new Date(profileData.created_at) : new Date(),
    updatedAt: profileData.updated_at ? new Date(profileData.updated_at) : new Date(),
    lastLogin: new Date(),
    isVerified: !!authUser.email_confirmed_at,
    twoFactorEnabled: false,
    preferences: {
      theme: (profileData.preferences?.theme as 'light' | 'dark' | 'system') || 'system',
      notifications: profileData.preferences?.notifications || {
        email: true,
        push: true,
        sms: false
      },
      language: profileData.preferences?.language || 'pt',
      currency: profileData.preferences?.currency || 'BRL'
    },
    roles: roles
  };
}
