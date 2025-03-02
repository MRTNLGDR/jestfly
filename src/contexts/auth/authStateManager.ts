
import { User } from "../../models/User";
import { auth } from '../../firebase/config';
import { authService } from './authService';
import { supabaseAuthService } from './supabaseAuthService';
import { supabase } from '../../integrations/supabase/client';
import { createSupabaseUserData } from './userDataTransformer';

interface AuthStateHandlerProps {
  setCurrentUser: (user: any) => void;
  setUserData: (userData: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const handleAuthStateChange = ({ 
  setCurrentUser, 
  setUserData, 
  setLoading 
}: AuthStateHandlerProps) => {
  // Função para verificar autenticação do Supabase
  const checkSupabaseAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const profile = await supabaseAuthService.getUserProfile(data.session.user.id);
        if (profile) {
          // Use our updated transformer function
          const userDataFromSupabase = createSupabaseUserData(data.session.user, profile);
          setUserData(userDataFromSupabase);
        }
      }
    } catch (err) {
      console.error("Erro ao verificar autenticação do Supabase:", err);
    }
  };

  // Listener para Firebase Auth
  const unsubscribeFirebase = auth.onAuthStateChanged(async (user) => {
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

  // Listener para Supabase Auth
  const supAuthListener = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const profile = await supabaseAuthService.getUserProfile(session.user.id);
      
      if (profile) {
        // Use our updated transformer function
        const userDataFromSupabase = createSupabaseUserData(session.user, profile);
        setUserData(userDataFromSupabase);
      }
    } else if (event === 'SIGNED_OUT') {
      setUserData(null);
    }
  });

  // Return cleanup function
  return () => {
    unsubscribeFirebase();
    supAuthListener.data.subscription.unsubscribe();
  };
};
