
import { supabase } from '../../../integrations/supabase/client';
import { User } from '../../../models/User';
import { prepareUserDataForSupabase } from '../userDataTransformer';
import { toast } from 'sonner';

/**
 * Atualiza os dados do perfil do usuário
 */
export const updateUserProfile = async (
  userId: string,
  userData: Partial<User>
): Promise<void> => {
  try {
    // Preparar os dados para o formato do Supabase
    const profileData = prepareUserDataForSupabase(userData);
    
    // Atualizar o perfil no Supabase
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
    
    if (error) {
      throw error;
    }
    
    toast.success('Perfil atualizado com sucesso!');
  } catch (err: any) {
    console.error("Profile update error:", err);
    toast.error('Falha ao atualizar perfil');
    throw err;
  }
};

/**
 * Busca os dados completos do perfil do usuário
 */
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    // Buscar o perfil completo do usuário
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    // Buscar os papéis do usuário
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
      
    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
    }
    
    const roles = rolesData ? rolesData.map(r => r.role) : [];
    
    // Se não encontrou dados, retornar null
    if (!data) {
      return null;
    }
    
    // Transformar os dados para o formato da aplicação
    // Neste caso simplificado, apenas retornamos os dados como estão
    return {
      id: data.id,
      email: data.email || '',
      displayName: data.full_name || '',
      username: data.username || '',
      profileType: data.profile_type || 'fan',
      avatar: data.avatar_url,
      bio: data.bio,
      socialLinks: data.social_links || {},
      walletAddress: data.wallet_address,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      lastLogin: new Date(),
      isVerified: true,
      twoFactorEnabled: false,
      preferences: data.preferences || {
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        language: 'pt',
        currency: 'BRL'
      },
      roles
    };
  } catch (err: any) {
    console.error("Profile fetch error:", err);
    return null;
  }
};
