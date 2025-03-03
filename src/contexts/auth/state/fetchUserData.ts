
import { supabase } from '../../../integrations/supabase/client';
import { User as AppUser } from '../../../models/User';
import { createSupabaseUserData } from '../userDataTransformer';

/**
 * Fetches user data from Supabase database
 */
export const fetchUserData = async (userId: string): Promise<AppUser | null> => {
  try {
    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
      return null;
    }

    // Buscar roles do usuário
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (rolesError) {
      console.error('Erro ao buscar roles:', rolesError);
    }
    
    // Obter email da sessão
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!profile || !session?.user) {
      return null;
    }
    
    // Converter campos JSON se necessário
    const parsedPreferences = typeof profile.preferences === 'string' 
      ? JSON.parse(profile.preferences) 
      : (profile.preferences || {});
      
    const parsedSocialLinks = typeof profile.social_links === 'string'
      ? JSON.parse(profile.social_links)
      : (profile.social_links || {});
    
    // Criar perfil completo com roles
    const profileWithRoles = {
      ...profile,
      profile_type: (profile.profile_type || 'fan') as 'artist' | 'fan' | 'admin' | 'collaborator',
      preferences: parsedPreferences,
      social_links: parsedSocialLinks,
      roles: roles?.map(r => r.role) || []
    };
    
    // Transformar dados para o modelo User da aplicação
    const supabaseAuthUser = {
      email: session.user.email || '',
      email_confirmed_at: session.user.email_confirmed_at
    };
    
    return createSupabaseUserData(
      supabaseAuthUser,
      profileWithRoles
    );
  } catch (err) {
    console.error("Erro ao buscar dados do usuário do Supabase:", err);
    return null;
  }
};
