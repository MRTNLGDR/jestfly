
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface ProfileData {
  id?: string;
  email?: string;
  display_name?: string;
  username?: string;
  profile_type?: string;
  bio?: string;
  avatar?: string;
  wallet_address?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  is_verified?: boolean;
  two_factor_enabled?: boolean;
  preferences?: any;
}

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: ProfileData | null;
  isLoading: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{error?: Error}>;
  signUp: (email: string, password: string, userData?: Partial<ProfileData>) => Promise<{error?: Error}>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<{avatarUrl: string}>;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  profile: null,
  isLoading: false,
  loading: false,
  signIn: async () => ({error: undefined}),
  signUp: async () => ({error: undefined}),
  signOut: async () => {},
  updateProfile: async () => {},
  uploadAvatar: async () => ({avatarUrl: ''})
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as ProfileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          fetchProfile(session.user.id)
            .then(profileData => {
              setProfile(profileData);
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error("Error getting session:", error);
        setIsLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { error };
      }

      // Fetch user profile after successful login
      if (data.user) {
        const profileData = await fetchProfile(data.user.id);
        setProfile(profileData);
      }

      return { error: undefined };
    } catch (error: any) {
      return { error: new Error(error.message || 'Error during sign in') };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: Partial<ProfileData>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            display_name: userData?.display_name,
            username: userData?.username,
            profileType: userData?.profile_type || 'fan'
          }
        }
      });

      if (error) {
        return { error };
      }

      toast.success('Registro realizado com sucesso! Verifique seu email.');
      return { error: undefined };
    } catch (error: any) {
      return { error: new Error(error.message || 'Error during sign up') };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setProfile(null);
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao sair');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    if (!user || !profile) {
      toast.error('Você precisa estar logado para atualizar seu perfil');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local profile state
      setProfile({ ...profile, ...data });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      throw new Error('Você precisa estar logado para fazer upload de avatar');
    }

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      if (data) {
        await updateProfile({ avatar: data.publicUrl });
        return { avatarUrl: data.publicUrl };
      }

      throw new Error('Erro ao obter URL do avatar');
    } catch (error: any) {
      toast.error(`Erro ao fazer upload do avatar: ${error.message}`);
      throw error;
    }
  };

  const value: AuthContextProps = { 
    session, 
    user, 
    profile, 
    isLoading, 
    loading: isLoading, 
    signIn, 
    signUp, 
    signOut, 
    updateProfile,
    uploadAvatar
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
