import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: User | null;
  }>;
  signUp: (email: string, password: string, userData: SignUpUserData) => Promise<{
    error: Error | null;
    data: User | null;
  }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<ProfileData>) => Promise<{
    error: Error | null;
    data: ProfileData | null;
  }>;
  uploadAvatar: (file: File) => Promise<{
    error: Error | null;
    avatarUrl: string | null;
  }>;
  refreshProfile: () => Promise<void>;
}

export interface ProfileData {
  id: string;
  username: string;
  display_name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  profile_type: 'fan' | 'artist' | 'collaborator' | 'admin';
  wallet_address: string | null;
  created_at: string;
  updated_at: string;
  is_verified: boolean | null;
  social_links: Record<string, string> | null;
  preferences: Record<string, any> | null;
}

interface SignUpUserData {
  display_name: string;
  username: string;
  profile_type: 'fan' | 'artist' | 'collaborator' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Função para buscar o perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      console.log(`Buscando perfil para userId: ${userId}`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }
      
      console.log('Perfil recuperado:', data);
      return data as ProfileData;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  // Função para atualizar o perfil
  const refreshProfile = async () => {
    if (user) {
      console.log('Atualizando dados do perfil');
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
    }
  };

  useEffect(() => {
    // Obter sessão inicial
    console.log('Verificando sessão inicial');
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Sessão inicial:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      }
      
      setLoading(false);
    });

    // Monitorar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Evento de autenticação:', _event, 'Session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log(`Tentando login com email: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!error && data.user) {
        console.log('Login bem-sucedido:', data.user);
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo de volta, ${data.user.email}!`,
          variant: "default",
        });
        
        // Buscar perfil após login
        const profileData = await fetchProfile(data.user.id);
        setProfile(profileData);
        
        // Verificar o tipo de perfil e redirecionar adequadamente
        if (profileData?.profile_type === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else if (error) {
        console.error('Erro no login:', error);
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return { data: data?.user ?? null, error };
    } catch (error) {
      console.error('Exceção durante login:', error);
      const err = error as Error;
      toast({
        title: "Erro ao fazer login",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err };
    }
  };

  const signUp = async (email: string, password: string, userData: SignUpUserData) => {
    try {
      // Registrar o usuário
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
      
      if (!error && data.user) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu e-mail para confirmar o cadastro.",
          variant: "default",
        });
        
        navigate('/');
      } else if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return { data: data?.user ?? null, error };
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: (error as Error).message,
        variant: "destructive",
      });
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Realizando logout');
      await supabase.auth.signOut();
      setProfile(null);
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso.",
        variant: "default",
      });
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (profileData: Partial<ProfileData>) => {
    if (!user) {
      return { data: null, error: new Error('Usuário não autenticado') };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao atualizar perfil",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }

      setProfile(data as ProfileData);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
        variant: "default",
      });

      return { data: data as ProfileData, error: null };
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: (error as Error).message,
        variant: "destructive",
      });
      return { data: null, error: error as Error };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      return { error: new Error('Usuário não autenticado'), avatarUrl: null };
    }

    try {
      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload do arquivo para o bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública do arquivo
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Atualizar perfil com a nova URL do avatar
      const avatarUrl = data.publicUrl;
      await updateProfile({ avatar: avatarUrl });

      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso.",
        variant: "default",
      });

      return { error: null, avatarUrl };
    } catch (error) {
      toast({
        title: "Erro ao fazer upload",
        description: (error as Error).message,
        variant: "destructive",
      });
      return { error: error as Error, avatarUrl: null };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    uploadAvatar,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
