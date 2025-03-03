
import { supabase } from '@/integrations/supabase/client';
import { ProfileData, SignUpUserData } from '@/types/auth';

/**
 * Serviço de autenticação para gerenciar operações relacionadas a usuários
 */
export class AuthService {
  /**
   * Busca o perfil do usuário com base no ID
   */
  static async fetchProfile(userId: string): Promise<ProfileData | null> {
    try {
      console.log(`[AuthService] Buscando perfil para userId: ${userId}`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('[AuthService] Erro ao buscar perfil:', error);
        return null;
      }
      
      console.log('[AuthService] Perfil recuperado:', data);
      return data as ProfileData;
    } catch (error) {
      console.error('[AuthService] Exceção ao buscar perfil:', error);
      return null;
    }
  }

  /**
   * Autentica o usuário com email e senha
   */
  static async signIn(email: string, password: string) {
    try {
      console.log(`[AuthService] Iniciando login com email: ${email}`);
      
      // Validar campos
      if (!email || !password) {
        console.error('[AuthService] Email ou senha vazios');
        return { 
          data: null, 
          error: new Error('Email e senha são obrigatórios'),
          errorCode: 'EMPTY_FIELDS'
        };
      }
      
      // Tentar autenticação
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('[AuthService] Erro de autenticação:', error.message);
        return { 
          data: null, 
          error,
          errorCode: error.message.includes('Invalid login credentials') 
            ? 'INVALID_CREDENTIALS' 
            : 'AUTH_ERROR'
        };
      }
      
      if (!data.user) {
        console.error('[AuthService] Login sem dados de usuário');
        return { 
          data: null, 
          error: new Error('Dados de usuário não encontrados'),
          errorCode: 'NO_USER_DATA'
        };
      }
      
      // Buscar perfil do usuário
      const profile = await this.fetchProfile(data.user.id);
      
      return { 
        data: data.user, 
        profile,
        error: null,
        errorCode: null
      };
    } catch (error) {
      console.error('[AuthService] Exceção durante login:', error);
      return { 
        data: null, 
        error: error as Error,
        errorCode: 'EXCEPTION'
      };
    }
  }

  /**
   * Registra um novo usuário
   */
  static async signUp(email: string, password: string, userData: SignUpUserData) {
    try {
      console.log('[AuthService] Iniciando registro com email:', email);
      
      // Validações
      if (!email || !password) {
        return { 
          data: null, 
          error: new Error('Email e senha são obrigatórios'),
          errorCode: 'EMPTY_FIELDS'
        };
      }
      
      if (!userData.display_name || !userData.username) {
        return { 
          data: null, 
          error: new Error('Nome de exibição e nome de usuário são obrigatórios'),
          errorCode: 'EMPTY_PROFILE_FIELDS' 
        };
      }
      
      if (userData.profile_type === 'admin') {
        return { 
          data: null, 
          error: new Error('Não é permitido criar contas de administrador'),
          errorCode: 'ADMIN_CREATION_FORBIDDEN'
        };
      }
      
      // Registrar usuário
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            display_name: userData.display_name,
            username: userData.username,
            profile_type: userData.profile_type
          }
        }
      });
      
      if (error) {
        console.error('[AuthService] Erro no registro:', error);
        return { 
          data: null, 
          error,
          errorCode: error.message.includes('already registered') 
            ? 'EMAIL_IN_USE' 
            : 'REGISTRATION_ERROR'
        };
      }
      
      return { 
        data: data.user, 
        error: null,
        errorCode: null
      };
    } catch (error) {
      console.error('[AuthService] Exceção durante registro:', error);
      return { 
        data: null, 
        error: error as Error,
        errorCode: 'EXCEPTION'
      };
    }
  }

  /**
   * Realiza o logout do usuário
   */
  static async signOut() {
    try {
      console.log('[AuthService] Realizando logout');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[AuthService] Erro ao fazer logout:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('[AuthService] Exceção durante logout:', error);
      return { error: error as Error };
    }
  }

  /**
   * Verifica se o usuário atual tem um determinado tipo de perfil
   */
  static async hasProfileType(profileType: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const profile = await this.fetchProfile(user.id);
      return profile?.profile_type === profileType;
    } catch (error) {
      console.error('[AuthService] Erro ao verificar tipo de perfil:', error);
      return false;
    }
  }

  /**
   * Obtém o usuário atual e seu perfil
   */
  static async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { user: null, profile: null };
      
      const profile = await this.fetchProfile(user.id);
      return { user, profile };
    } catch (error) {
      console.error('[AuthService] Erro ao obter usuário atual:', error);
      return { user: null, profile: null };
    }
  }
}
