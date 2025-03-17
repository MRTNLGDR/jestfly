
import { supabase } from '../../../integrations/supabase/client';
import { ProfileStatus, ProfileCheckResult } from './types';

/**
 * Verifies the state of a specific profile
 */
export const checkProfileStatus = async (userId: string): Promise<ProfileCheckResult> => {
  try {
    // Buscar o perfil do usuário
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Perfil não encontrado
        return {
          status: ProfileStatus.MISSING,
          canRepair: true
        };
      }
      console.error('Erro ao verificar perfil:', error);
      return {
        status: ProfileStatus.UNKNOWN,
        canRepair: false
      };
    }
    
    if (!profile) {
      return {
        status: ProfileStatus.MISSING,
        canRepair: true
      };
    }
    
    // Verificar campos essenciais
    const requiredFields = ['username', 'display_name', 'profile_type', 'is_verified'];
    const missingFields = requiredFields.filter(field => 
      !profile[field as keyof typeof profile] && 
      profile[field as keyof typeof profile] !== false
    );
    
    // Verificar campos corrompidos
    const corruptFields: string[] = [];
    if (profile.profile_type && 
        !['admin', 'artist', 'collaborator', 'fan'].includes(profile.profile_type as string)) {
      corruptFields.push('profile_type');
    }
    
    if (missingFields.length > 0) {
      return {
        status: ProfileStatus.INCOMPLETE,
        missingFields,
        canRepair: true
      };
    }
    
    if (corruptFields.length > 0) {
      return {
        status: ProfileStatus.CORRUPT,
        corruptFields,
        canRepair: true
      };
    }
    
    return {
      status: ProfileStatus.OK,
      canRepair: false
    };
  } catch (error) {
    console.error('Exceção ao verificar perfil:', error);
    return {
      status: ProfileStatus.UNKNOWN,
      canRepair: false
    };
  }
};

/**
 * Checks if a user exists in auth.users
 */
export const checkUserExists = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    
    if (error || !data.user) {
      console.error('Erro ao verificar existência do usuário:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exceção ao verificar existência do usuário:', error);
    return false;
  }
};

/**
 * Fetches user data from Supabase
 */
export const checkUserData = async (userId: string): Promise<any> => {
  try {
    // Verificar se o usuário existe na tabela auth.users
    const userExists = await checkUserExists(userId);
    
    if (!userExists) {
      return { 
        status: 'error', 
        message: 'Usuário não encontrado na autenticação',
        exists: false
      };
    }
    
    // Verificar se o perfil existe na tabela profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Erro ao verificar perfil:', profileError);
      return { 
        status: 'error', 
        message: 'Erro ao verificar perfil',
        error: profileError.message
      };
    }
    
    const hasProfile = !!profile;
    
    return {
      status: 'success',
      exists: true,
      hasProfile,
      profile: profile || null
    };
  } catch (error: any) {
    console.error('Exceção ao verificar dados do usuário:', error);
    return { 
      status: 'error', 
      message: 'Exceção ao verificar dados do usuário',
      error: error.message
    };
  }
};
