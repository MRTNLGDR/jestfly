
import { toast } from 'sonner';
import { User } from '../../models/User';
import { supabase } from '../../integrations/supabase/client';

export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Update last login timestamp
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);
    
    if (updateError) console.error('Erro ao atualizar último login:', updateError);
    
    toast.success('Login realizado com sucesso!');
    return data;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const registerUser = async (email: string, password: string, userData: Partial<User>) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName: userData.displayName,
          username: userData.username,
          profileType: userData.profileType || 'fan',
        }
      }
    });
    
    if (error) throw error;
    
    const profileType = userData.profileType || 'fan';
    toast.success(`Conta de ${profileType === 'artist' ? 'artista' : 
                  profileType === 'admin' ? 'administrador' : 
                  profileType === 'collaborator' ? 'colaborador' : 'fã'} 
                  criada com sucesso!`);
    return data;
  } catch (error: any) {
    console.error('Erro ao criar conta:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
  toast.success('Logout realizado com sucesso');
};

export const resetUserPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    console.error('Erro ao enviar email de redefinição:', error);
    throw error;
  }
  toast.success('Email de recuperação de senha enviado');
};

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
  try {
    // Atualizar metadados de autenticação se necessário
    if (data.displayName || data.username) {
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          displayName: data.displayName,
          username: data.username,
        }
      });
      
      if (authUpdateError) throw authUpdateError;
    }
    
    // Atualizar perfil no banco de dados
    const { error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success('Perfil atualizado com sucesso');
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

export const fetchUserData = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      return null;
    }
    
    // Converter o formato do Supabase para o formato User do nosso app
    const userData: User = {
      id: data.id,
      email: data.email,
      displayName: data.display_name,
      username: data.username,
      profileType: data.profile_type,
      avatar: data.avatar,
      bio: data.bio,
      socialLinks: data.social_links || {},
      walletAddress: data.wallet_address,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      lastLogin: data.last_login ? new Date(data.last_login) : new Date(),
      isVerified: data.is_verified || false,
      twoFactorEnabled: data.two_factor_enabled || false,
      permissions: data.permissions || [],
      roles: data.roles || [],
      preferences: data.preferences || {
        theme: 'dark',
        notifications: {},
        language: 'pt',
        currency: 'BRL'
      }
    };
    
    return userData;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
};
