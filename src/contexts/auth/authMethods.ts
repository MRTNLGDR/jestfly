
import { supabase } from '../../integrations/supabase/client';
import { UserProfile } from '../../models/User';
import { toast } from 'sonner';

export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Atualizar o timestamp de último login
    if (data.user) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);
        
      if (updateError) console.error('Erro ao atualizar last_login:', updateError);
    }
    
    toast.success('Login realizado com sucesso!');
    return data;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const registerUser = async (email: string, password: string, userData: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: userData.display_name,
          username: userData.username,
          profileType: userData.profile_type || 'fan',
        }
      }
    });
    
    if (error) throw error;
    
    const profileType = userData.profile_type || 'fan';
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
  if (error) throw error;
  toast.success('Logout realizado com sucesso');
};

export const resetUserPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    
    // O toast é feito no componente para melhor feedback visual
    return true;
  } catch (error: any) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    throw error;
  }
};

export const updateUserPassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    // O toast é feito no componente para melhor feedback visual
    return true;
  } catch (error: any) {
    console.error('Erro ao atualizar senha:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  try {
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

export const fetchUserData = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    if (data) {
      // Fazendo cast seguro para UserProfile com valores padrão para os campos necessários
      const userProfile: UserProfile = {
        ...data,
        // Adicionando campos obrigatórios que podem não estar no banco de dados
        followers_count: 0, // Valor temporário para contagem
        following_count: 0, // Valor temporário para contagem
        is_verified: data.is_verified || false,
        // Convertendo o tipo preferences para o formato esperado
        preferences: data.preferences as any || {
          email_notifications: true,
          push_notifications: true,
          theme: 'dark',
          language: 'pt'
        }
      };
      
      return userProfile;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
};
