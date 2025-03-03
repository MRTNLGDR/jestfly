
import { supabase } from "../../integrations/supabase/client";
import { User } from "../../models/User";
import { toast } from "sonner";

// Função para verificar se o Google Auth está habilitado
const checkGoogleAuthEnabled = async (): Promise<boolean> => {
  try {
    // Esta é uma requisição leve para verificar a configuração de autenticação
    const { data, error } = await supabase.auth.getSession();
    
    // Se houver erro, provavelmente a configuração está errada
    if (error) {
      console.error("Erro ao verificar sessão Supabase:", error);
      return false;
    }
    
    // Se supabase estiver funcionando, podemos assumir que a autenticação básica está ok
    // Mas o Google auth precisa ser verificado de outra forma ou assumido com base na configuração
    return true; // Por enquanto, retornamos true e tratamos erros específicos ao tentar login
  } catch (error) {
    console.error("Erro ao verificar configuração de autenticação:", error);
    return false;
  }
};

export const supabaseAuthService = {
  // Nova função para verificar se o Google Auth está habilitado
  isGoogleAuthEnabled: async (): Promise<boolean> => {
    return await checkGoogleAuthEnabled();
  },

  // Função para verificar se o usuário atual é um admin no Supabase
  async checkAdminStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('profile_type')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao verificar status de admin:', error);
        return false;
      }

      // Now we can check the profile_type directly
      return data?.profile_type === 'admin';
    } catch (error) {
      console.error('Erro inesperado ao verificar status de admin:', error);
      return false;
    }
  },

  // Função para criar ou atualizar o perfil do usuário
  async syncUserProfile(userId: string, userData: Partial<User>): Promise<void> {
    try {
      // Verificar se o perfil já existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        // Atualizar perfil existente
        const { error } = await supabase
          .from('profiles')
          .update({
            username: userData.username,
            full_name: userData.displayName,
            profile_type: userData.profileType,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) throw error;
      } else {
        // Criar novo perfil
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: userData.username,
            full_name: userData.displayName,
            profile_type: userData.profileType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Erro ao sincronizar perfil com Supabase:', error);
      toast.error('Erro ao atualizar perfil: ' + error.message);
    }
  },

  // Função para fazer login e verificar se é admin no Supabase
  async loginAndCheckAdmin(email: string, password: string): Promise<{ isAdmin: boolean, user: any }> {
    try {
      // Realizar login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se é admin
      const isAdmin = await this.checkAdminStatus(data.user.id);

      return { isAdmin, user: data.user };
    } catch (error: any) {
      console.error('Erro ao fazer login e verificar admin:', error);
      throw error;
    }
  },

  // Cadastrar um novo usuário
  async registerUser(email: string, password: string, userData: Partial<User>): Promise<any> {
    try {
      // Registrar o usuário
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.displayName, 
            profile_type: userData.profileType
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Sincronizar perfil
        await this.syncUserProfile(data.user.id, userData);
      }

      return data.user;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  },

  // Login com Google
  async loginWithGoogle(): Promise<any> {
    try {
      // Primeiro tentamos verificar se o Google Auth está habilitado
      const isEnabled = await checkGoogleAuthEnabled();
      if (!isEnabled) {
        throw new Error('Google Auth não está habilitado no Supabase');
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        if (error.message.includes('provider is not enabled')) {
          throw new Error('Login com Google não está habilitado. Entre em contato com o administrador.');
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      throw error;
    }
  },

  // Recuperar senha
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      throw error;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  },

  // Obter usuário atual
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session?.user || null;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  },

  // Obter perfil do usuário
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao obter perfil do usuário:', error);
      return null;
    }
  }
};
