
import { User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Executa diagnósticos de autenticação para resolver problemas
 */
export const runAuthDiagnostics = async (userId?: string): Promise<Record<string, any>> => {
  try {
    if (!userId) {
      return {
        success: false,
        error: "ID de usuário não fornecido",
        timestamp: new Date().toISOString()
      };
    }

    console.log("Executando diagnóstico para usuário:", userId);
    
    // Verificar conectividade básica com Supabase
    const connectivityTest = await testSupabaseConnectivity();
    
    // Verificar se o usuário existe na auth.users
    let authUserExists = false;
    let userProfile = null;
    let profileError = null;
    
    try {
      // Tentar buscar perfil público
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileErr) {
        console.error("Erro ao buscar perfil durante diagnóstico:", profileErr);
        profileError = profileErr;
      } else if (profile) {
        userProfile = profile;
        authUserExists = true; // Se o perfil existe, assumimos que o auth user também existe
      }
    } catch (err) {
      console.error("Exceção ao buscar perfil durante diagnóstico:", err);
      profileError = err;
    }
    
    // Registrar resultados do diagnóstico
    try {
      await supabase.from('diagnostic_logs').insert({
        message: 'Diagnóstico de autenticação executado',
        metadata: {
          user_id: userId,
          connectivity: connectivityTest,
          profile_found: !!userProfile,
          timestamp: new Date().toISOString()
        }
      });
    } catch (logErr) {
      console.error("Erro ao registrar diagnóstico:", logErr);
    }
    
    return {
      success: true,
      connectivity: connectivityTest,
      auth_user_exists: authUserExists,
      user_data: userProfile,
      errors: {
        profile_error: profileError ? String(profileError) : null
      },
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error("Erro durante diagnóstico de autenticação:", err);
    return {
      success: false,
      error: String(err),
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Testa a conectividade básica com o Supabase
 */
export const testSupabaseConnectivity = async () => {
  try {
    const start = Date.now();
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    const duration = Date.now() - start;
    
    return {
      success: !error,
      error: error ? String(error) : null,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    return {
      success: false,
      error: String(err),
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Tenta corrigir problemas de perfil detectados
 */
export const attemptProfileFix = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      console.error("Nenhuma sessão de usuário para tentar correção de perfil");
      return false;
    }
    
    const user = session.user;
    console.log("Tentando correção de perfil para:", user.id);
    
    // Verificar se o perfil existe
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
    
    if (checkError) {
      console.error("Erro ao verificar perfil existente:", checkError);
      return false;
    }
    
    // Se o perfil já existe, atualizar timestamp
    if (existingProfile) {
      console.log("Perfil encontrado, atualizando last_login");
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (updateError) {
        console.error("Erro ao atualizar perfil:", updateError);
        return false;
      }
      
      return true;
    }
    
    // Se o perfil não existe, criar um novo
    return await forceCreateProfile(user);
  } catch (err) {
    console.error("Erro durante tentativa de correção de perfil:", err);
    return false;
  }
};

/**
 * Força a criação de um perfil para o usuário
 */
export const forceCreateProfile = async (user: User) => {
  if (!user || !user.id) {
    toast.error("Dados de usuário inválidos para criação de perfil");
    return false;
  }
  
  try {
    console.log("Criando perfil forçado para:", user.id);
    
    // Tentar excluir qualquer perfil existente com erro
    try {
      await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
    } catch (deleteErr) {
      console.log("Nenhum perfil existente para excluir ou erro:", deleteErr);
      // Continuar mesmo se falhar
    }
    
    // Criar novo perfil
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        username: user.user_metadata?.username || user.email?.split('@')[0] || `user_${Date.now()}`,
        profile_type: user.email?.includes('admin') ? 'admin' : 'fan',
        is_verified: false,
        avatar: user.user_metadata?.avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      });
    
    if (insertError) {
      console.error("Erro ao criar perfil forçado:", insertError);
      
      // Registrar diagnóstico
      await supabase.from('diagnostic_logs').insert({
        message: 'Falha na criação forçada de perfil',
        metadata: {
          user_id: user.id,
          error: String(insertError),
          timestamp: new Date().toISOString()
        }
      });
      
      return false;
    }
    
    console.log("Perfil forçado criado com sucesso");
    
    // Registrar diagnóstico
    await supabase.from('diagnostic_logs').insert({
      message: 'Perfil forçado criado com sucesso',
      metadata: {
        user_id: user.id,
        timestamp: new Date().toISOString()
      }
    });
    
    toast.success("Perfil criado com sucesso!");
    return true;
  } catch (err) {
    console.error("Exceção durante criação forçada de perfil:", err);
    toast.error("Erro ao criar perfil: " + String(err));
    return false;
  }
};
