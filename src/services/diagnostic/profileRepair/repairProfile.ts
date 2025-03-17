
import { supabase } from '../../../integrations/supabase/client';
import { UserProfile } from '../../../types/auth';
import { toast } from 'sonner';
import { logAuthDiagnostic } from '../../../contexts/auth/utils/diagnosticUtils';
import { ProfileType } from '../../../integrations/supabase/schema';

/**
 * Creates a profile for a user that doesn't have one
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
 * Repairs missing fields in a profile
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
 * Repairs corrupted fields in a profile
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
