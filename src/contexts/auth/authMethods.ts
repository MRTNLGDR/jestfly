
import { supabase } from '../../integrations/supabase/client';
import { User as AppUser } from '../../models/User';
import { toast } from 'sonner';
import { prepareUserDataForSupabase } from './userDataTransformer';

/**
 * Login com email e senha
 */
export const login = async (email: string, password: string): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    if (data.user) {
      toast.success('Login realizado com sucesso!');
    }
  } catch (err: any) {
    console.error("Erro de login:", err);
    
    let errorMessage = 'Falha ao fazer login';
    if (err.message.includes('Invalid login credentials')) {
      errorMessage = 'Credenciais inválidas';
    } else if (err.message.includes('Email not confirmed')) {
      errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
    }
    
    toast.error(errorMessage);
    throw err;
  }
};

/**
 * Login com Google
 */
export const loginWithGoogle = async (): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/profile`
      }
    });
    
    if (error) {
      throw error;
    }
    
    console.log("Login com Google iniciado:", data);
  } catch (err: any) {
    console.error("Erro no login com Google:", err);
    throw err;
  }
};

/**
 * Registrar um novo usuário
 */
export const register = async (email: string, password: string, userData: Partial<AppUser>): Promise<void> => {
  try {
    // Preparar dados do perfil para registro
    const userMetadata = {
      full_name: userData.displayName,
      username: userData.username,
      profile_type: userData.profileType
    };
    
    // Verificar se é cadastro de admin e validar código
    if (userData.profileType === 'admin' && userData.adminCode) {
      // Verificar o código admin antes do registro
      const { data: codeValid, error } = await supabase.rpc(
        'has_role', 
        { user_id: 'system', required_role: 'admin' }
      );
      
      if (error || !codeValid) {
        throw new Error('Código de administrador inválido ou já utilizado');
      }
    }
    
    // Registrar usuário no Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata,
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    
    if (error) {
      throw error;
    }
    
    // Se é admin, processar o código admin
    if (data?.user && userData.profileType === 'admin' && userData.adminCode) {
      try {
        // Buscar token para autorização
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        
        if (!token) {
          console.error('Token não disponível para verificação de código admin');
          return;
        }
        
        // Chamar a edge function para verificar e processar o código admin
        const response = await fetch(`${window.location.origin}/functions/v1/verify-admin-code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: data.user.id,
            adminCode: userData.adminCode
          })
        });
        
        const result = await response.json();
        
        if (!result.success) {
          console.error('Falha ao processar código admin:', result.error);
        }
      } catch (adminErr) {
        console.error('Erro ao processar código admin:', adminErr);
      }
    }
    
    toast.success('Conta criada! Verifique seu email para confirmar o cadastro.');
    
  } catch (err: any) {
    console.error("Erro no registro:", err);
    
    let errorMessage = 'Falha ao criar conta';
    
    if (err.message.includes('User already registered')) {
      errorMessage = 'Este email já está em uso';
    } else if (err.message.includes('invalid email')) {
      errorMessage = 'Email inválido';
    } else if (err.message.includes('Password should be')) {
      errorMessage = 'A senha deve ter pelo menos 6 caracteres';
    } else if (err.message.includes('Código de administrador inválido')) {
      errorMessage = 'Código de administrador inválido ou já utilizado';
    }
    
    toast.error(errorMessage);
    throw err;
  }
};

/**
 * Fazer logout do usuário atual
 */
export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    toast.success('Logout realizado com sucesso');
  } catch (err: any) {
    console.error("Erro no logout:", err);
    throw err;
  }
};

/**
 * Resetar a senha de um usuário
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      throw error;
    }
    
    toast.success('Instruções para redefinir senha foram enviadas para o seu email');
  } catch (err: any) {
    console.error("Erro ao resetar senha:", err);
    
    let errorMessage = 'Falha ao redefinir senha';
    if (err.message.includes('Email not found')) {
      errorMessage = 'Email não encontrado';
    }
    
    toast.error(errorMessage);
    throw err;
  }
};

/**
 * Atualizar dados do perfil do usuário
 */
export const updateProfile = async (userData: Partial<AppUser>): Promise<void> => {
  try {
    const supabaseData = prepareUserDataForSupabase(userData);
    
    const { error } = await supabase
      .from('profiles')
      .update(supabaseData)
      .eq('id', userData.id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Perfil atualizado com sucesso');
  } catch (err: any) {
    console.error("Erro ao atualizar perfil:", err);
    toast.error('Falha ao atualizar perfil');
    throw err;
  }
};
