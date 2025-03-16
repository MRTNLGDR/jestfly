
// Import como dinâmico para evitar dependência circular
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Busca os dados básicos do perfil do usuário
 */
export const fetchBasicProfile = async (userId: string) => {
  console.log("Buscando perfil básico para usuário:", userId);
  const startTime = Date.now();
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    console.log("Tempo para buscar perfil básico:", Date.now() - startTime, "ms");
    
    if (error) {
      console.error("Erro ao buscar perfil:", error);
      
      // Se for erro de permissão, tentar com RPC para evitar problemas de RLS
      if (error.message.includes('permission') || error.message.includes('policy')) {
        try {
          const { data: rpcData, error: rpcError } = await supabase
            .rpc('get_profile_by_id', { user_id: userId });
            
          if (rpcError) {
            console.error("Erro ao buscar perfil via RPC:", rpcError);
            throw error; // Manter o erro original se o RPC também falhar
          }
          
          return rpcData;
        } catch (rpcErr) {
          console.error("Exceção ao buscar perfil via RPC:", rpcErr);
          throw error; // Manter o erro original
        }
      }
      
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    throw err;
  }
};

/**
 * Atualiza o perfil do usuário
 */
export const updateProfile = async (userId: string, data: any) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
    
    toast.success("Perfil atualizado com sucesso!");
    return true;
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    toast.error("Erro ao atualizar perfil: " + String(err));
    throw err;
  }
};

/**
 * Cria um novo perfil se não existir
 */
export const createProfileIfNotExists = async (user: any) => {
  if (!user || !user.id) {
    return false;
  }
  
  try {
    // Verificar se o perfil já existe
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error("Erro ao verificar perfil existente:", error);
      return false;
    }
    
    // Se o perfil já existe, retorne verdadeiro
    if (data) {
      return true;
    }
    
    // Criar novo perfil
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        display_name: user.email?.split('@')[0] || 'User',
        username: user.email?.split('@')[0] || `user_${Date.now()}`,
        profile_type: 'fan',
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.error("Erro ao criar perfil:", insertError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Erro ao criar perfil:", err);
    return false;
  }
};
