import { supabase } from '../../integrations/supabase/client';
import { User } from '../../models/User';
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
    
    // Mensagens de erro mais amigáveis
    if (error.message.includes('Invalid login credentials')) {
      toast.error('Email ou senha incorretos');
    } else if (error.message.includes('Email not confirmed')) {
      toast.error('Email não confirmado. Por favor, verifique sua caixa de entrada');
    } else {
      toast.error(error.message || 'Erro ao fazer login');
    }
    
    throw error;
  }
};

export const registerUser = async (email: string, password: string, userData: Partial<User>) => {
  try {
    console.log('Registrando usuário:', { email, userData });
    
    // Verificar se o email já existe
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle();
      
    if (checkError) {
      console.error('Erro ao verificar email existente:', checkError);
    }
    
    if (existingUsers) {
      toast.error('Este email já está sendo usado');
      throw new Error('Este email já está sendo usado');
    }
    
    // Garantir que o profileType seja um dos valores válidos
    const validProfileTypes = ['admin', 'artist', 'fan', 'collaborator'];
    const profileType = userData.profileType && validProfileTypes.includes(userData.profileType) 
      ? userData.profileType 
      : 'fan';
    
    // Registrar o usuário
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName: userData.displayName,
          username: userData.username,
          profileType: profileType,
        }
      }
    });
    
    if (error) throw error;
    
    let successMessage = '';
    
    switch (profileType) {
      case 'admin':
        successMessage = 'Conta de administrador criada com sucesso!';
        break;
      case 'artist':
        successMessage = 'Conta de artista criada com sucesso!';
        break;
      case 'collaborator':
        successMessage = 'Conta de colaborador criada com sucesso!';
        break;
      default:
        successMessage = 'Conta de fã criada com sucesso!';
    }
    
    toast.success(successMessage);
    console.log('Conta criada com sucesso:', data);
    return data;
  } catch (error: any) {
    console.error('Erro ao criar conta:', error);
    
    // Traduzir mensagens de erro comuns
    if (error.message.includes('already registered')) {
      toast.error('Este email já está sendo usado por outra conta');
    } else if (error.message.includes('invalid email')) {
      toast.error('Formato de email inválido');
    } else if (error.message.includes('weak password')) {
      toast.error('Senha muito fraca. Use uma senha mais forte');
    } else if (error.message.includes('network error')) {
      toast.error('Erro de conexão. Verifique sua internet e tente novamente');
    } else {
      toast.error(error.message || 'Falha ao criar conta');
    }
    
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast.success('Logout realizado com sucesso');
  } catch (error: any) {
    console.error('Erro ao fazer logout:', error);
    toast.error('Erro ao fazer logout');
    throw error;
  }
};

export const resetUserPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    toast.success('Email de recuperação de senha enviado');
  } catch (error: any) {
    console.error('Erro ao resetar senha:', error);
    toast.error('Erro ao enviar email de recuperação de senha');
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
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
    toast.error('Erro ao atualizar perfil');
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
    
    if (error) throw error;
    
    // Converter os campos de data de string para Date
    if (data) {
      // Converter as datas para objetos Date
      const userData = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        lastLogin: data.last_login ? new Date(data.last_login) : new Date(),
      } as unknown as User;
      
      return userData;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
};
