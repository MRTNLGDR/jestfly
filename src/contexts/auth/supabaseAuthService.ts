
import { supabase } from "../../integrations/supabase/client";
import { User } from "../../models/User";
import { toast } from "sonner";

export const supabaseAuthService = {
  // Função para verificar se o usuário atual é um admin no Supabase
  async checkAdminStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao verificar status de admin:', error);
        return false;
      }

      // Verificamos se é admin baseado no full_name (temporariamente)
      // Isso deve ser ajustado quando a coluna profile_type for adicionada
      return data?.full_name?.includes('Admin') || false;
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
            full_name: userData.displayName
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;

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
