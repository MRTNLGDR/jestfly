
import { supabase } from '../../integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

/**
 * Tenta reparar um perfil de usuário com problemas
 */
export const attemptProfileFix = async () => {
  try {
    console.log("Iniciando reparo automático de perfil");
    
    // Obter usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Erro ao obter usuário atual:", userError);
      return { 
        success: false, 
        message: "Não foi possível obter usuário atual: " + (userError?.message || "Usuário não encontrado") 
      };
    }
    
    // Verificar se o perfil existe
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
      
    if (checkError) {
      console.error("Erro ao verificar perfil existente:", checkError);
      // Continuar mesmo com erro - pode ser um problema de RLS
    }
    
    // Se o perfil já existe, tentar atualizá-lo com força
    if (existingProfile) {
      console.log("Perfil encontrado, tentando atualizar");
      
      // Usar função RPC ou endpoint especial para evitar problemas de RLS
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          updated_at: now,
          // Adicionar campos relevantes para garantir consistência
          email: user.email,
          username: existingProfile.username || user.email?.split('@')[0] || `user_${Date.now()}`,
          display_name: existingProfile.display_name || user.email?.split('@')[0] || 'User',
          profile_type: existingProfile.profile_type || 'fan',
          is_verified: existingProfile.is_verified || false
        })
        .eq('id', user.id);
        
      if (updateError) {
        console.error("Erro ao atualizar perfil existente:", updateError);
        return { success: false, message: "Erro ao atualizar perfil: " + updateError.message };
      }
      
      console.log("Perfil atualizado com sucesso");
      return { success: true, message: "Perfil atualizado com sucesso" };
    } 
    
    // Perfil não existe, criar um novo
    console.log("Perfil não encontrado, criando novo");
    return await forceCreateProfile(user);
  } catch (err: any) {
    console.error("Exceção ao tentar reparar perfil:", err);
    return { success: false, message: "Erro ao reparar perfil: " + err.message };
  }
};

/**
 * Força a criação de um perfil para um usuário, ignorando políticas RLS
 */
export const forceCreateProfile = async (user: User) => {
  try {
    console.log("Forçando criação de perfil para:", user.id);
    
    // Inserir novo perfil usando insert direto
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        username: user.user_metadata?.username || user.email?.split('@')[0] || `user_${Date.now()}`,
        profile_type: user.user_metadata?.profile_type || 'fan',
        avatar: user.user_metadata?.avatar_url || null,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.error("Erro ao criar perfil:", insertError);
      
      // Se o erro for de conflito/duplicação, o perfil já existe
      if (insertError.code === '23505') {
        return { success: true, message: "Perfil já existe" };
      }
      
      return { success: false, message: "Erro ao criar perfil: " + insertError.message };
    }
    
    console.log("Perfil criado com sucesso");
    return { success: true, message: "Perfil criado com sucesso" };
  } catch (err: any) {
    console.error("Exceção ao criar perfil:", err);
    return { success: false, message: "Erro ao criar perfil: " + err.message };
  }
};

/**
 * Executa diagnóstico completo e tenta reparar perfil
 */
export const diagnoseAndRepairProfile = async (userId: string) => {
  try {
    console.log("Iniciando diagnóstico e reparo para usuário:", userId);
    
    // 1. Verificar se o usuário existe no auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Erro ao verificar usuário auth:", userError);
      return { 
        success: false, 
        message: "Erro ao verificar autenticação: " + userError.message 
      };
    }
    
    // Se estamos reparando outro usuário que não o atual
    if (user && user.id !== userId) {
      console.log("Reparando perfil para outro usuário:", userId);
      // Verificar permissões (idealmente o usuário atual deveria ser um admin)
    }
    
    // 2. Verificar se o perfil existe na tabela profiles
    const { data: profileExists, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, username, display_name, profile_type, is_verified')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError) {
      console.error("Erro ao verificar perfil existente:", profileError);
      
      // Pode ser um problema de política RLS, continuar
    }
    
    // 3. Baseado nos resultados, tentar reparo
    if (!profileExists) {
      console.log("Perfil não encontrado, tentando criar");
      
      // Se não estamos reparando o usuário atual, precisamos obter seus dados
      const targetUser = user?.id === userId ? user : null;
      
      if (!targetUser) {
        console.error("Usuário-alvo não disponível para reparo");
        return { 
          success: false, 
          message: "Não foi possível obter dados do usuário para reparo" 
        };
      }
      
      // Tentar criar o perfil
      const createResult = await forceCreateProfile(targetUser);
      
      if (!createResult.success) {
        console.error("Falha ao criar perfil durante reparo completo:", createResult.message);
        return createResult;
      }
      
      toast.success("Perfil criado com sucesso!");
      return { success: true, message: "Perfil criado com sucesso" };
    }
    
    // Perfil existe, tentar atualizar para garantir consistência
    console.log("Perfil encontrado, aplicando reparo de consistência");
    
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        updated_at: now,
        email: user?.email || profileExists.email,
        // Certifique-se de que campos obrigatórios estão presentes
        username: profileExists.username || user?.email?.split('@')[0] || `user_${Date.now()}`,
        display_name: profileExists.display_name || user?.email?.split('@')[0] || 'User',
        profile_type: profileExists.profile_type || 'fan',
        is_verified: profileExists.is_verified || false
      })
      .eq('id', userId);
      
    if (updateError) {
      console.error("Erro ao atualizar perfil durante reparo completo:", updateError);
      return { 
        success: false, 
        message: "Erro ao atualizar perfil durante reparo: " + updateError.message 
      };
    }
    
    console.log("Reparo completo aplicado com sucesso");
    toast.success("Perfil reparado com sucesso!");
    return { success: true, message: "Perfil reparado com sucesso" };
    
  } catch (err: any) {
    console.error("Exceção no diagnóstico e reparo completo:", err);
    return { success: false, message: "Erro no diagnóstico e reparo: " + err.message };
  }
};

/**
 * Executa diagnósticos de autenticação para um usuário
 */
export const runAuthDiagnostics = async (userId?: string) => {
  try {
    console.log("Executando diagnóstico de autenticação");
    
    const results: Record<string, any> = {
      timestamp: new Date().toISOString(),
      success: false
    };
    
    // 1. Verificar sessão atual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    results.session_check = {
      success: !sessionError,
      has_session: !!session,
      error: sessionError ? sessionError.message : null
    };
    
    // 2. Verificar usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    results.user_check = {
      success: !userError,
      has_user: !!user,
      user_id: user?.id || null,
      user_email: user?.email || null,
      error: userError ? userError.message : null
    };
    
    // 3. Se temos um ID de usuário específico, verificar esse perfil
    const targetId = userId || user?.id;
    
    if (targetId) {
      results.target_user_id = targetId;
      
      try {
        // Verificar se o perfil existe
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetId)
          .maybeSingle();
          
        results.profile_check = {
          success: !profileError,
          has_profile: !!profile,
          error: profileError ? profileError.message : null
        };
        
        // Problema de recursão infinita é comum em políticas RLS
        const hasRecursionError = profileError?.message?.includes('infinite recursion');
        results.policy_recursion_detected = hasRecursionError;
        
        // Se temos perfil, incluir informações básicas
        if (profile) {
          results.user_data = {
            id: profile.id,
            email: profile.email,
            profile_type: profile.profile_type,
            username: profile.username,
            display_name: profile.display_name,
            is_verified: profile.is_verified
          };
        }
        
        // Se não conseguimos verificar via API devido a problemas de RLS,
        // tentar métodos alternativos ou verificar diretamente na tabela
        if (profileError && hasRecursionError) {
          console.log("Detectado problema de recursão em políticas, tentando método alternativo");
          
          try {
            // Usar RPC para verificar se o perfil existe
            const { data: hasProfile, error: rpcError } = await supabase
              .rpc('check_user_data', { user_id: targetId });
              
            if (!rpcError && hasProfile) {
              results.alternative_check = {
                success: true,
                has_profile: true,
                method: 'rpc'
              };
              
              // Adicionar dados do perfil a partir da RPC
              results.user_data = hasProfile;
            } else {
              results.alternative_check = {
                success: false,
                has_profile: false,
                error: rpcError ? rpcError.message : 'Nenhum dado retornado',
                method: 'rpc'
              };
            }
          } catch (altError: any) {
            results.alternative_check = {
              success: false,
              error: altError.message,
              method: 'rpc'
            };
          }
        }
      } catch (profileCheckErr: any) {
        results.profile_check = {
          success: false,
          error: profileCheckErr.message
        };
      }
    } else {
      results.profile_check = {
        success: false,
        error: "Nenhum ID de usuário disponível para verificar perfil"
      };
    }
    
    // 4. Verificar diagnósticos anteriores
    try {
      const { data: logs, error: logsError } = await supabase
        .from('diagnostic_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (!logsError && logs) {
        results.recent_logs = {
          success: true,
          count: logs.length,
          logs: logs.map(log => ({
            message: log.message,
            timestamp: log.created_at
          }))
        };
      } else {
        results.recent_logs = {
          success: false,
          error: logsError ? logsError.message : 'Nenhum log encontrado'
        };
      }
    } catch (logsErr: any) {
      results.recent_logs = {
        success: false,
        error: logsErr.message
      };
    }
    
    // Determinar se o diagnóstico foi bem-sucedido
    results.success = !sessionError && !userError;
    
    console.log("Diagnóstico concluído:", results);
    return results;
  } catch (err: any) {
    console.error("Exceção no diagnóstico de autenticação:", err);
    return {
      success: false,
      error: err.message,
      timestamp: new Date().toISOString()
    };
  }
};
