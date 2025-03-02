
import React, { createContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { User } from '../../models/User';
import { AuthContextType } from './types';
import { authService } from './authService';
import { supabaseAuthService } from './supabaseAuthService';
import { supabase } from '../../integrations/supabase/client';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito para verificar autenticação do Supabase
  useEffect(() => {
    const checkSupabaseAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          // Se tiver usuário autenticado no Supabase, buscar o perfil
          const profile = await supabaseAuthService.getUserProfile(data.session.user.id);
          if (profile) {
            // Converter o formato do perfil do Supabase para nosso formato User
            const userDataFromSupabase: User = {
              id: profile.id,
              email: data.session.user.email || '',
              username: profile.username || '',
              displayName: profile.display_name || data.session.user.email?.split('@')[0] || '',
              profileType: profile.profile_type as any,
              createdAt: new Date(profile.created_at),
              updatedAt: new Date(profile.updated_at),
              lastLogin: new Date(),
              isVerified: data.session.user.email_confirmed_at !== null,
              twoFactorEnabled: false,
              socialLinks: {},
              preferences: {
                theme: 'system',
                language: 'pt',
                currency: 'BRL',
                notifications: {
                  email: true,
                  push: true,
                  sms: false
                }
              },
              collectionItems: [],
              transactions: []
            };
            
            setUserData(userDataFromSupabase);
          }
        }
      } catch (err) {
        console.error("Erro ao verificar autenticação do Supabase:", err);
      }
    };

    // Ainda mantemos o Firebase por compatibilidade
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Verificar se é um email admin específico
        const isAdminEmail = user.email === 'admin@jestfly.com' || 
                            user.email === 'lucas@martynlegrand.com';
        
        try {
          console.log("Fetching user data for:", user.uid);
          const userData = await authService.getUserData(user.uid);
          
          if (userData) {
            // Auto-assign admin role for specific email if not already set
            if (isAdminEmail && userData.profileType !== 'admin') {
              await authService.updateUserToAdmin(user.uid);
              userData.profileType = 'admin';
              
              // Sincronizar com Supabase se for admin
              await supabaseAuthService.syncUserProfile(user.uid, {
                ...userData,
                profileType: 'admin'
              });
            }
            
            console.log("User data found:", userData);
            setUserData(userData);
          } else if (isAdminEmail) {
            // Create admin user if doesn't exist
            const adminUserData = await authService.createAdminUser(user);
            
            // Sincronizar com Supabase
            await supabaseAuthService.syncUserProfile(user.uid, {
              ...adminUserData,
              profileType: 'admin'
            });
            
            setUserData(adminUserData);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        // Verificar se há usuário no Supabase
        await checkSupabaseAuth();
      }
      
      setLoading(false);
    });

    // Listener para mudanças na autenticação do Supabase
    const supAuthListener = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await supabaseAuthService.getUserProfile(session.user.id);
        
        if (profile) {
          const userDataFromSupabase: User = {
            id: profile.id,
            email: session.user.email || '',
            username: profile.username || '',
            displayName: profile.display_name || session.user.email?.split('@')[0] || '',
            profileType: profile.profile_type as any,
            createdAt: new Date(profile.created_at),
            updatedAt: new Date(profile.updated_at),
            lastLogin: new Date(),
            isVerified: session.user.email_confirmed_at !== null,
            twoFactorEnabled: false,
            socialLinks: {},
            preferences: {
              theme: 'system',
              language: 'pt',
              currency: 'BRL',
              notifications: {
                email: true,
                push: true,
                sms: false
              }
            },
            collectionItems: [],
            transactions: []
          };
          
          setUserData(userDataFromSupabase);
        }
      } else if (event === 'SIGNED_OUT') {
        setUserData(null);
      }
    });

    return () => {
      unsubscribe();
      supAuthListener.data.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Primeiro tentamos login com Supabase
      try {
        const { isAdmin, user } = await supabaseAuthService.loginAndCheckAdmin(email, password);
        
        // Se for admin no Supabase, obtemos o perfil
        if (user) {
          const profile = await supabaseAuthService.getUserProfile(user.id);
          
          if (profile) {
            const userDataFromSupabase: User = {
              id: profile.id,
              email: user.email || '',
              username: profile.username || '',
              displayName: profile.display_name || user.email?.split('@')[0] || '',
              profileType: profile.profile_type as any,
              createdAt: new Date(profile.created_at),
              updatedAt: new Date(profile.updated_at),
              lastLogin: new Date(),
              isVerified: user.email_confirmed_at !== null,
              twoFactorEnabled: false,
              socialLinks: {},
              preferences: {
                theme: 'system',
                language: 'pt',
                currency: 'BRL',
                notifications: {
                  email: true,
                  push: true,
                  sms: false
                }
              },
              collectionItems: [],
              transactions: []
            };
            
            setUserData(userDataFromSupabase);
            return;
          }
        }
      } catch (supabaseError) {
        console.error("Erro no login Supabase, tentando Firebase:", supabaseError);
        // Se falhar no Supabase, tentamos no Firebase
      }
      
      // Se chegou aqui, é porque não conseguiu no Supabase, então tentamos no Firebase
      await authService.login(email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      
      // Primeiro tentamos com Supabase
      try {
        await supabaseAuthService.loginWithGoogle();
        return;
      } catch (supabaseError) {
        console.error("Erro no login Google pelo Supabase, tentando Firebase:", supabaseError);
      }
      
      // Se falhar, tenta com Firebase
      await authService.loginWithGoogle();
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setError(null);
      
      // Registro no Supabase
      try {
        await supabaseAuthService.registerUser(email, password, userData);
        return;
      } catch (supabaseError) {
        console.error("Erro no registro pelo Supabase, tentando Firebase:", supabaseError);
      }
      
      // Se falhar no Supabase, tenta no Firebase
      await authService.register(email, password, userData);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      // Logout do Supabase
      try {
        await supabaseAuthService.logout();
      } catch (supabaseError) {
        console.error("Erro no logout do Supabase:", supabaseError);
      }
      
      // Logout do Firebase
      await authService.logout();
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      
      // Reset de senha pelo Supabase
      try {
        await supabaseAuthService.resetPassword(email);
        return;
      } catch (supabaseError) {
        console.error("Erro no reset de senha pelo Supabase, tentando Firebase:", supabaseError);
      }
      
      // Se falhar no Supabase, tenta no Firebase
      await authService.resetPassword(email);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
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
