
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type ProfileType = 'fan' | 'artist' | 'admin' | 'collaborator';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  profile_type: ProfileType;
  permissions: string[];
  roles: string[];
  is_verified: boolean;
  created_at: string;
  wallet_address: string | null;
  social_links: any | null;
  preferences: any | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: User | null;
  }>;
  signUp: (email: string, password: string, profileData?: Partial<Profile>) => Promise<{
    error: Error | null;
    data: User | null;
  }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{
    error: Error | null;
    data: Profile | null;
  }>;
  refreshProfile: () => Promise<void>;
  isAdmin: () => boolean;
  isArtist: () => boolean;
  isCollaborator: () => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile from profiles table
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

      return data as Profile;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  };

  // Refresh the user's profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    const profileData = await fetchProfile(user.id);
    if (profileData) {
      setProfile(profileData);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(profileData => {
          setProfile(profileData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(profileData => {
          setProfile(profileData);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
        return { data: null, error };
      }
      
      const profileData = await fetchProfile(data.user?.id || '');
      setProfile(profileData);
      toast.success('Login realizado com sucesso!');
      
      return { data: data?.user ?? null, error: null };
    } catch (error) {
      toast.error('Erro ao fazer login');
      return { data: null, error: error as Error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, profileData?: Partial<Profile>) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: {
          data: {
            displayName: profileData?.display_name || email.split('@')[0],
            username: profileData?.username || `user_${Math.random().toString(36).substring(2, 8)}`,
            profileType: profileData?.profile_type || 'fan'
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return { data: null, error };
      }
      
      toast.success('Conta criada com sucesso! Verifique seu email para confirmar.');
      return { data: data?.user ?? null, error: null };
    } catch (error) {
      toast.error('Erro ao criar conta');
      return { data: null, error: error as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    navigate('/auth');
    toast.info('Você saiu da sua conta');
  };

  // Update profile data
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select('*')
        .single();

      if (error) {
        toast.error('Erro ao atualizar perfil');
        return { data: null, error };
      }

      setProfile(data as Profile);
      toast.success('Perfil atualizado com sucesso');
      return { data: data as Profile, error: null };
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
      return { data: null, error: error as Error };
    }
  };

  // Utility functions to check user roles and permissions
  const isAdmin = () => profile?.profile_type === 'admin';
  const isArtist = () => profile?.profile_type === 'artist';
  const isCollaborator = () => profile?.profile_type === 'collaborator';
  const hasPermission = (permission: string) => 
    profile?.permissions?.includes(permission) || isAdmin() || false;

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
    isAdmin,
    isArtist,
    isCollaborator,
    hasPermission,
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
