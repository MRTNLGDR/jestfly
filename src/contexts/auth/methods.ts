
import { supabase } from '../../integrations/supabase/client';
import { Auth, User } from '@supabase/supabase-js';
import { 
  AuthCredentials, 
  PasswordResetDetails, 
  UserProfile,
  UserRegistrationData, 
  ProfileUpdateData 
} from './types';

// Função de login de usuário
export const loginUser = async ({ email, password }: AuthCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Função de registro de usuário
export const registerUser = async (userData: UserRegistrationData) => {
  try {
    const { email, password, profile_type, display_name } = userData;

    // Registrar o usuário com Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          profile_type,
          display_name,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Falha no registro do usuário');

    // Criar perfil na tabela profiles
    // Inclua o username obrigatório
    const profile = {
      id: authData.user.id,
      email: email,
      display_name: display_name,
      profile_type: profile_type,
      username: `user_${Date.now().toString().slice(-6)}`, // Gerando um username único
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .insert(profile);

    if (profileError) {
      // Caso haja erro na criação do perfil, tentar deletar o usuário auth
      console.error('Erro ao criar perfil:', profileError);
      throw profileError;
    }

    return authData;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};

// Função de logout
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro no logout:', error);
    throw error;
  }
};

// Função para buscar dados do usuário
export const fetchUserData = async (userId: string): Promise<UserProfile> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Perfil não encontrado');

    // Converter para o formato UserProfile
    const profile: UserProfile = {
      id: data.id,
      email: data.email,
      display_name: data.display_name,
      username: data.username,
      profile_type: data.profile_type,
      avatar_url: data.avatar || '',
      bio: data.bio || '',
      created_at: data.created_at || '',
      is_verified: data.is_verified || false,
      last_login: data.last_login || '',
      permissions: data.permissions || [],
      preferences: data.preferences || {},
      social_links: data.social_links || {},
      wallet_address: data.wallet_address || '',
      followers_count: 0, // Adicionando os campos faltantes
      following_count: 0  // Adicionando os campos faltantes
    };

    return profile;
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    throw error;
  }
};

// Função para atualizar a senha
export const resetUserPassword = async ({ email }: PasswordResetDetails) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    throw error;
  }
};

// Função para atualizar o perfil do usuário
export const updateUserProfile = async (userId: string, profileData: ProfileUpdateData) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};
