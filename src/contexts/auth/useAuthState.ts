
import { useState, useEffect, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { UserProfile } from '../../types/auth';
import { fetchUserData } from './methods/profileMethods';
import { ProfileType } from '../../integrations/supabase/schema';
import { hasPermission, isUserAdmin, isUserArtist } from './utils/permissionUtils';
import { refreshUserSession } from './utils/sessionUtils';
import { initializeAuthState } from './utils/initAuthState';
import { logAuthDiagnostic } from './utils/diagnosticUtils';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Valores derivados (memoizados)
  const isAdmin = useMemo(() => isUserAdmin(userData), [userData]);
  const isArtist = useMemo(() => isUserArtist(userData), [userData]);
  
  // Função para verificar permissões específicas
  const checkPermission = (requiredPermission: ProfileType | ProfileType[]) => {
    return hasPermission(userData, requiredPermission);
  };
  
  // Função para atualizar dados do usuário
  const refreshUserData = async () => {
    if (!currentUser) {
      console.log('Não é possível atualizar dados sem usuário autenticado');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { user, profile, error } = await refreshUserSession(currentUser);
      
      if (error) {
        setError(error);
        console.error('Erro ao atualizar dados do usuário:', error);
        
        // Registrar falha de atualização
        await logAuthDiagnostic('Falha ao atualizar dados do usuário', {
          user_id: currentUser.id,
          error,
          timestamp: new Date().toISOString()
        });
        
        return;
      }
      
      if (user) {
        setCurrentUser(user);
      }
      
      if (profile) {
        setUserData(profile);
      }
      
      // Registrar sucesso
      await logAuthDiagnostic('Dados do usuário atualizados com sucesso', {
        user_id: currentUser.id,
        timestamp: new Date().toISOString()
      });
      
    } catch (err: any) {
      console.error('Exceção ao atualizar dados do usuário:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Efeito de inicialização - buscar usuário atual e configurar listener de alterações de auth
  useEffect(() => {
    // Inicializar estado de autenticação
    const initialize = async () => {
      setLoading(true);
      
      try {
        const { user, profile, error } = await initializeAuthState();
        
        if (error) {
          setError(error);
        }
        
        setCurrentUser(user);
        setUserData(profile);
      } catch (err: any) {
        console.error('Erro na inicialização de auth:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    initialize();
    
    // Configurar listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Evento de autenticação:', event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setCurrentUser(session.user);
            
            try {
              const profile = await fetchUserData(session.user.id);
              setUserData(profile as UserProfile);
            } catch (err) {
              console.error('Erro ao buscar dados após evento de auth:', err);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setUserData(null);
        }
      }
    );
    
    // Cleanup: remover listener ao desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return {
    currentUser,
    userData,
    loading,
    error,
    setError,
    setUserData,
    isAdmin,
    isArtist,
    hasPermission: checkPermission,
    refreshUserData
  };
};
