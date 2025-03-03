
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { User as AppUser } from '../../../models/User';
import { getInitialSession, setupAuthSubscription } from './authSubscription';

/**
 * Hook personalizado para gerenciar o estado da autenticação
 */
export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Inicializar com a sessão atual
    const initializeAuth = async () => {
      try {
        const { session, user, userData } = await getInitialSession();
        
        setSession(session);
        setUser(user);
        setUserData(userData);
      } catch (err) {
        console.error("Erro ao inicializar autenticação:", err);
        setError("Falha ao carregar dados de autenticação");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Configurar inscrição para mudanças de estado de autenticação
    const unsubscribe = setupAuthSubscription((session, user, userData) => {
      setSession(session);
      setUser(user);
      setUserData(userData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { 
    session, 
    user, 
    userData, 
    setUserData, 
    loading, 
    error, 
    setError 
  };
};
