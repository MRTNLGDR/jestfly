import { AuthChangeEvent, Session, SupabaseClient } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';
import { User } from '../../models/User';
import { useAuthState } from './useAuthState';

// Importar o necessário de userDataTransformer
import { createSupabaseUserData, SupabaseAuthUser, SupabaseProfileData } from './userDataTransformer';

// Define o tipo para o contexto de autenticação
export interface AuthContextType {
  supabaseClient: SupabaseClient | null;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

// Cria o contexto de autenticação com um valor padrão
export const AuthContext = createContext<AuthContextType>({
  supabaseClient: null,
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  updateUser: async () => {}
});

// Hook personalizado para acessar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};

// Define o tipo para o gerenciador de estado de autenticação
export interface AuthStateManager {
  onAuthStateChange: (
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) => { data: { subscription: { unsubscribe: () => void; id: string } } };
  getSession: () => Promise<{ data: { session: Session | null } }>;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

/**
 * Configura a autenticação com Supabase
 */
export const setupSupabaseAuth = (): AuthStateManager => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      'As variáveis de ambiente Supabase URL e Anon Key devem ser definidas.'
    );
  }

  const supabase = useAuthState();

  const signIn = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert('Verifique seu email para o link mágico.');
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  const updateUser = async (data: Partial<User>): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser(data);
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  // Função para processar os dados de perfil do usuário
  const processProfileData = async (session: Session): Promise<User> => {
    if (!session?.user) {
      throw new Error('Sessão inválida ou usuário não encontrado.');
    }
    
    // Buscar perfil do usuário
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*, user_roles(role)')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
      
      // Se não encontrar perfil, criar um novo
      const newProfileData: SupabaseProfileData = {
        id: session.user.id,
        username: session.user.email?.split('@')[0] || '',
        full_name: session.user.email?.split('@')[0] || '',
        profile_type: 'fan',
        preferences: {
          theme: 'system',
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          language: 'pt',
          currency: 'BRL'
        }
      };

      // Criar o perfil inicial
      const { error: createError } = await supabase
        .from('profiles')
        .insert(newProfileData);

      if (createError) {
        console.error('Erro ao criar perfil:', createError);
      }

      return createSupabaseUserData(
        { 
          email: session.user.email || '', 
          email_confirmed_at: session.user.email_confirmed_at 
        }, 
        newProfileData
      );
    }

    // Transformar os papéis do formato do banco para o formato da aplicação
    const roles = profileData.user_roles 
      ? profileData.user_roles.map((r: any) => r.role)
      : [];

    // Converter dados para o formato da aplicação
    return createSupabaseUserData(
      { 
        email: session.user.email || '', 
        email_confirmed_at: session.user.email_confirmed_at 
      },
      { 
        ...profileData, 
        roles 
      }
    );
  };

  return {
    onAuthStateChange: supabase.auth.onAuthStateChange,
    getSession: supabase.auth.getSession,
    signIn,
    signOut,
    updateUser
  };
};
