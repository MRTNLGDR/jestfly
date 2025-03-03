
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar?: string;
  profile_type: 'fan' | 'artist' | 'collaborator' | 'admin';
  created_at: string;
  updated_at: string;
  bio?: string;
  wallet_address?: string;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: User | null;
  }>;
  signUp: (email: string, password: string, username: string, displayName: string, profileType: 'fan' | 'artist' | 'collaborator' | 'admin') => Promise<{
    error: Error | null;
    data: User | null;
  }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar o perfil do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchUserProfile(user.id);
      setProfile(profile);
    }
  };

  useEffect(() => {
    // Obter sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setProfile(profile);
      }
      
      setLoading(false);
    });

    // Monitorar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setProfile(profile);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(`Erro ao fazer login: ${error.message}`);
        return { data: null, error };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        setProfile(profile);
        toast.success('Login realizado com sucesso!');
        navigate('/');
      }

      return { data: data?.user ?? null, error: null };
    } catch (error) {
      toast.error(`Erro ao fazer login: ${(error as Error).message}`);
      return { data: null, error: error as Error };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    username: string, 
    displayName: string, 
    profileType: 'fan' | 'artist' | 'collaborator' | 'admin'
  ) => {
    try {
      // Verificar se o username já existe
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (checkError) {
        console.error('Erro ao verificar username:', checkError);
      }

      if (existingUser) {
        toast.error('Nome de usuário já está em uso');
        return { data: null, error: new Error('Nome de usuário já está em uso') };
      }

      // Criar novo usuário
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username,
            displayName,
            profileType
          }
        }
      });

      if (error) {
        toast.error(`Erro ao criar conta: ${error.message}`);
        return { data: null, error };
      }

      toast.success('Conta criada com sucesso! Verifique seu email para confirmar o cadastro.');
      navigate('/auth/login');
      
      return { data: data?.user ?? null, error: null };
    } catch (error) {
      toast.error(`Erro ao criar conta: ${(error as Error).message}`);
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      toast.success('Logout realizado com sucesso');
      navigate('/auth/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error(`Erro ao fazer logout: ${(error as Error).message}`);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
