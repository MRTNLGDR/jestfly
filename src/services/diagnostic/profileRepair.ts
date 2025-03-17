
import { supabase } from '../../integrations/supabase/client';
import { UserProfile } from '../../types/auth';
import { toast } from 'sonner';
import { logAuthDiagnostic } from '../../contexts/auth/utils/diagnosticUtils';
import { ProfileType } from '../../integrations/supabase/schema';

/**
 * Status de um perfil após verificação diagnóstica
 */
export enum ProfileStatus {
  OK = 'ok',
  MISSING = 'missing',
  INCOMPLETE = 'incomplete',
  CORRUPT = 'corrupt',
  UNKNOWN = 'unknown'
}

/**
 * Resultado da verificação de perfil
 */
export interface ProfileCheckResult {
  status: ProfileStatus;
  missingFields?: string[];
  corruptFields?: string[];
  canRepair: boolean;
}

/**
 * Verifica o estado de um perfil específico
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
 * Cria um perfil para um usuário que não possui
 */
export const createMissingProfile = async (userId: string): Promise<boolean> => {
  try {
    // Buscar dados básicos do usuário na tabela auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user) {
      console.error('Erro ao buscar dados do usuário:', userError);
      return false;
    }
    
    // Criando um perfil básico com informações do auth.users
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: userData.user.email,
        username: userData.user.email?.split('@')[0] || `user_${userId.substring(0, 8)}`,
        display_name: userData.user.email?.split('@')[0] || `User ${userId.substring(0, 8)}`,
        profile_type: 'fan' as ProfileType,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Erro ao criar perfil:', error);
      return false;
    }
    
    toast.success('Perfil criado com sucesso');
    return true;
  } catch (error) {
    console.error('Exceção ao criar perfil:', error);
    return false;
  }
};

/**
 * Repara campos faltantes em um perfil
 */
export const repairIncompleteProfile = async (userId: string, missingFields: string[]): Promise<boolean> => {
  try {
    // Dados de reparo padrão
    const repairData: Partial<UserProfile> = {};
    
    // Preparar dados para cada campo faltante
    missingFields.forEach(field => {
      switch (field) {
        case 'username':
          repairData.username = `user_${userId.substring(0, 8)}`;
          break;
        case 'display_name':
          repairData.display_name = `User ${userId.substring(0, 8)}`;
          break;
        case 'profile_type':
          repairData.profile_type = 'fan';
          break;
        case 'is_verified':
          repairData.is_verified = false;
          break;
        // Adicionar outros campos conforme necessário
      }
    });
    
    // Atualizar o perfil
    const { error } = await supabase
      .from('profiles')
      .update(repairData)
      .eq('id', userId);
    
    if (error) {
      console.error('Erro ao reparar perfil:', error);
      return false;
    }
    
    await logAuthDiagnostic(`Perfil reparado: campos ${missingFields.join(', ')}`, { userId, fields: missingFields });
    toast.success('Perfil reparado com sucesso');
    return true;
  } catch (error) {
    console.error('Exceção ao reparar perfil:', error);
    return false;
  }
};

/**
 * Repara campos corrompidos em um perfil
 */
export const repairCorruptProfile = async (userId: string, corruptFields: string[]): Promise<boolean> => {
  try {
    // Dados de reparo padrão
    const repairData: Partial<UserProfile> = {};
    
    // Preparar dados para cada campo corrompido
    corruptFields.forEach(field => {
      switch (field) {
        case 'profile_type':
          repairData.profile_type = 'fan';
          break;
        // Adicionar outros campos conforme necessário
      }
    });
    
    // Atualizar o perfil
    const { error } = await supabase
      .from('profiles')
      .update(repairData)
      .eq('id', userId);
    
    if (error) {
      console.error('Erro ao reparar perfil corrompido:', error);
      return false;
    }
    
    await logAuthDiagnostic(`Perfil corrompido reparado: campos ${corruptFields.join(', ')}`, { userId, fields: corruptFields });
    toast.success('Perfil reparado com sucesso');
    return true;
  } catch (error) {
    console.error('Exceção ao reparar perfil corrompido:', error);
    return false;
  }
};

/**
 * Verifica se um usuário existe na auth.users
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
 * Busca dados do usuário no Supabase
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
