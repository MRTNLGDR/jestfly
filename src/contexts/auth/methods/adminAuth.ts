
import { supabase } from '../../../integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Verifica o código de administrador
 */
export const verifyAdminCode = async (userId: string, adminCode: string): Promise<boolean> => {
  try {
    // Chamar a função RPC em Supabase para verificar o código
    const { data, error } = await supabase.functions.invoke('verify-admin-code', {
      body: { userId, adminCode }
    });
    
    if (error) {
      throw error;
    }
    
    if (data && data.valid) {
      // Se o código for válido, conceder o papel de admin ao usuário
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: userId,
          role: 'admin'
        });
      
      if (roleError) {
        throw roleError;
      }
      
      toast.success('Código de administrador verificado com sucesso!');
      return true;
    } else {
      throw new Error('Código de administrador inválido');
    }
  } catch (err: any) {
    console.error("Admin code verification error:", err);
    toast.error('Falha ao verificar código de administrador');
    throw err;
  }
};
