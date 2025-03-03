
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../../integrations/supabase/client';
import { User as AppUser } from '../../../models/User';
import { fetchUserData } from './fetchUserData';

type AuthChangeHandler = (
  session: Session | null,
  user: User | null,
  userData: AppUser | null
) => void;

/**
 * Sets up auth state subscription
 */
export const setupAuthSubscription = (
  onAuthChange: AuthChangeHandler
): (() => void) => {
  console.log('Configurando assinatura de autenticação');
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('Evento de autenticação Supabase:', event);
      
      const user = session?.user || null;
      let userData = null;
      
      if (user) {
        console.log('Usuário autenticado, buscando dados do perfil');
        userData = await fetchUserData(user.id);
      }
      
      onAuthChange(session, user, userData);
    }
  );

  return () => {
    console.log('Cancelando assinatura de autenticação');
    subscription.unsubscribe();
  };
};

/**
 * Gets initial session
 */
export const getInitialSession = async (): Promise<{
  session: Session | null;
  user: User | null;
  userData: AppUser | null;
}> => {
  console.log('Obtendo sessão inicial');
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Sessão obtida:', session ? 'Sessão válida' : 'Sem sessão');
    
    const user = session?.user || null;
    
    let userData = null;
    if (user) {
      console.log('Usuário encontrado na sessão, buscando dados do perfil');
      userData = await fetchUserData(user.id);
    }
    
    return { session, user, userData };
  } catch (error) {
    console.error('Erro ao obter sessão inicial:', error);
    return { session: null, user: null, userData: null };
  }
};
