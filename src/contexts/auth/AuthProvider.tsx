
import React, { createContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, firestore } from '../../firebase/config';
import { User } from '../../models/User';
import { AuthContextType } from './types';
import { 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { supabase } from '../../integrations/supabase/client';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to handle Supabase auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Supabase auth event:', event);
        
        if (session?.user) {
          fetchUserData(session.user.id);
        } else {
          setUserData(null);
        }
        
        setLoading(false);
      }
    );

    // Also handle Firebase auth for backward compatibility
    const unsubscribeFirebase = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user && !userData) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as User);
          }
        } catch (err) {
          console.error("Error fetching user data from Firebase:", err);
        }
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      unsubscribeFirebase();
    };
  }, []);

  // Function to fetch user data from Supabase
  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
      }
      
      // Type assertion for profile_type
      const profileType = profile.profile_type as 'artist' | 'fan' | 'admin' | 'collaborator';
      
      // Type assertion for social_links
      const socialLinks: User['socialLinks'] = profile.social_links || {};
      
      // Type assertion for preferences
      const preferences: User['preferences'] = profile.preferences || {
        theme: 'dark' as const,
        notifications: { email: true, push: true, sms: false },
        language: 'pt',
        currency: 'BRL',
      };

      // Map Supabase profile to user data format
      const user: User = {
        id: profile.id,
        email: profile.email || '',
        displayName: profile.full_name,
        username: profile.username,
        profileType,
        avatar: profile.avatar_url,
        bio: profile.bio,
        socialLinks,
        walletAddress: profile.wallet_address,
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at),
        lastLogin: new Date(),
        isVerified: true, // Assuming verified if we have the profile
        twoFactorEnabled: false,
        preferences,
        roles: roles?.map(r => r.role) || []
      };

      setUserData(user);
    } catch (err) {
      console.error("Error fetching user data from Supabase:", err);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      
      // Use Supabase for authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Update last login time is handled by the profile fetch
        toast.success('Login realizado com sucesso!');
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
      
      // Traduzir mensagens de erro comuns
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

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setError(null);
      
      // Use Supabase for Google login
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`
        }
      });
      
      if (error) {
        if (error.message.includes('provider is not enabled')) {
          throw new Error('Login com Google não está habilitado. Entre em contato com o administrador.');
        }
        throw error;
      }
      
      console.log("Supabase Google login initiated:", data);
      
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>): Promise<void> => {
    try {
      setError(null);
      
      // Preparar dados do perfil para registro
      const userMetadata = {
        full_name: userData.displayName,
        username: userData.username,
        profile_type: userData.profileType
      };
      
      // Verificar se é cadastro de admin e validar código
      if (userData.profileType === 'admin' && userData.adminCode) {
        // Verificar o código admin antes do registro
        const { data: codeValid, error } = await supabase.rpc('verify_admin_code', {
          admin_code: userData.adminCode
        });
        
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
      
      // Se o código chegou até aqui e é um admin, processar o código admin
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
      console.error("Registration error:", err);
      setError(err.message);
      
      // Traduzir mensagens de erro comuns
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

  const logout = async (): Promise<void> => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Also sign out from Firebase for backward compatibility
      await signOut(auth);
      
      setCurrentUser(null);
      setUserData(null);
      
      toast.success('Logout realizado com sucesso');
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      
      // Use Supabase for password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Instruções para redefinir senha foram enviadas para o seu email');
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message);
      
      // Traduzir mensagens de erro comuns
      let errorMessage = 'Falha ao redefinir senha';
      if (err.message.includes('Email not found')) {
        errorMessage = 'Email não encontrado';
      }
      
      toast.error(errorMessage);
      throw err;
    }
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
