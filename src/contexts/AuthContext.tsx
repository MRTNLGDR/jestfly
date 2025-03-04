
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, ProfileData } from '@/types/auth';

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para uso do contexto sem hooks de autenticação
const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider do contexto de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializar o estado de autenticação
  useEffect(() => {
    // Obter a sessão atual
    const initAuth = async () => {
      setLoading(true);
      
      // Verificar se existe uma sessão
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession?.user) {
        setUser(currentSession.user);
        
        // Buscar o perfil do usuário
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
        
        if (data) {
          // Convert JSON object to Record<string, string> for social_links
          const socialLinks = typeof data.social_links === 'string' 
            ? JSON.parse(data.social_links) 
            : data.social_links || {};
            
          const profileData: ProfileData = {
            ...data,
            social_links: socialLinks as Record<string, string>
          };
          
          setProfile(profileData);
        }
      }
      
      setLoading(false);
    };
    
    initAuth();
    
    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      
      if (newSession?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', newSession.user.id)
          .single();
        
        if (data) {
          // Convert JSON object to Record<string, string> for social_links
          const socialLinks = typeof data.social_links === 'string' 
            ? JSON.parse(data.social_links) 
            : data.social_links || {};
            
          const profileData: ProfileData = {
            ...data,
            social_links: socialLinks as Record<string, string>
          };
          
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Funções de autenticação
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (!error && data.user) {
        // Criar perfil para o novo usuário
        await supabase.from('profiles').insert({
          id: data.user.id,
          email,
          username: userData.username,
          display_name: userData.display_name,
          profile_type: userData.profile_type,
        });
      }
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (profileData: Partial<ProfileData>) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (!error && data) {
        // Convert JSON object to Record<string, string> for social_links
        const socialLinks = typeof data.social_links === 'string' 
          ? JSON.parse(data.social_links) 
          : data.social_links || {};
          
        const profileData: ProfileData = {
          ...data,
          social_links: socialLinks as Record<string, string>
        };
        
        setProfile(profileData);
        return { data: profileData, error: null };
      }
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { url: null, error: new Error('User not authenticated') };
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      
      if (error) throw error;
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const avatarUrl = data.publicUrl;
      
      // Atualizar o perfil com a URL do avatar
      await updateProfile({ avatar: avatarUrl });
      
      return { url: avatarUrl, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    }
  };

  const refreshProfile = async () => {
    if (!user) return false;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        // Convert JSON object to Record<string, string> for social_links
        const socialLinks = typeof data.social_links === 'string' 
          ? JSON.parse(data.social_links) 
          : data.social_links || {};
          
        const profileData: ProfileData = {
          ...data,
          social_links: socialLinks as Record<string, string>
        };
        
        setProfile(profileData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      return false;
    }
  };

  const value: AuthContextType = {
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

// Exportar o hook para uso em componentes
export const useAuth = useAuthContext;
