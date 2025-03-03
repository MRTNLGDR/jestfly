
import { supabase } from '../../../integrations/supabase/client';

/**
 * Verify and process admin code during registration
 */
export const verifyAdminCode = async (
  userId: string, 
  adminCode: string
): Promise<boolean> => {
  try {
    // Verificar o código admin antes do registro
    const { data: codeValid, error } = await supabase.rpc(
      'has_role', // Fixed function name that should exist in Supabase
      { user_id: 'system', required_role: 'admin' }
    );
    
    if (error || !codeValid) {
      throw new Error('Código de administrador inválido ou já utilizado');
    }
    
    // Get auth session for token
    const { data: authData } = await supabase.auth.getSession();
    const token = authData.session?.access_token;
    
    if (!token) {
      console.error('Token não disponível para verificação de código admin');
      return false;
    }
    
    // Call the edge function to verify and process the admin code
    const response = await fetch(`${window.location.origin}/functions/v1/verify-admin-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId,
        adminCode
      })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      console.error('Falha ao processar código admin:', result.error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Erro ao processar código admin:', err);
    return false;
  }
};
