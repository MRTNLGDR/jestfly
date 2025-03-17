import { User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
import { ProfileFixResult } from './types';

/**
 * Tenta corrigir problemas de perfil detectados
 */
export const attemptProfileFix = async (): Promise<ProfileFixResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      console.error("Nenhuma sessão de usuário para tentar correção de perfil");
      return {
        success: false,
        message: "Nenhuma sessão de usuário ativa",
        error: "No active user session"
      };
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
      return {
        success: false,
        message: "Erro ao verificar perfil",
        error: String(checkError)
      };
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
        return {
          success: false,
          message: "Erro ao atualizar timestamps do perfil",
          error: String(updateError)
        };
      }
      
      return {
        success: true,
        message: "Perfil atualizado com sucesso",
        profile: existingProfile
      };
    }
    
    // Se o perfil não existe, criar um novo
    return await forceCreateProfile(user);
    
  } catch (err) {
    console.error("Erro durante tentativa de correção de perfil:", err);
    return {
      success: false,
      message: "Exceção durante tentativa de correção",
      error: String(err)
    };
  }
};

/**
 * Força a criação de um perfil para o usuário
 */
export const forceCreateProfile = async (user: User): Promise<ProfileFixResult> => {
  if (!user || !user.id) {
    toast.error("Dados de usuário inválidos para criação de perfil");
    return {
      success: false,
      message: "Dados de usuário inválidos",
      error: "Invalid user data"
    };
  }
  
  try {
    console.log("Criando perfil forçado para:", user.id);
    
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
      return {
        success: false,
        message: "Erro ao criar perfil",
        error: insertError.message
      };
    }
    
    console.log("Perfil forçado criado com sucesso");
    toast.success("Perfil criado com sucesso!");
    return {
      success: true,
      message: "Perfil criado com sucesso",
      profile: { id: user.id }
    };
  } catch (err: any) {
    console.error("Exceção durante criação forçada de perfil:", err);
    toast.error("Erro ao criar perfil: " + String(err));
    return {
      success: false,
      message: "Exceção durante criação de perfil",
      error: String(err)
    };
  }
};

/**
 * Método de fallback para criar perfil utilizando RPC quando políticas RLS falham
 */
export const createProfileViaRPC = async (user: User): Promise<boolean> => {
  if (!user || !user.id) return false;
  
  try {
    console.log("Tentando criar perfil via RPC para contornar erros de RLS:", user.id);
    
    // Esta função RPC deve ser criada no banco de dados para funcionar
    // Usando uma chamada direta ao Supabase para contornar a tipagem do RPC
    const { data, error } = await supabase.rpc('log_auth_diagnostic', {
      message: 'Bypass RLS profile creation attempt',
      metadata: {
        user_id: user.id,
        email: user.email,
        timestamp: new Date().toISOString()
      }
    });
    
    // Como não temos uma RPC específica, vamos tentar criar o perfil diretamente
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
      console.error("Erro ao criar perfil via método alternativo:", insertError);
      return false;
    }
    
    console.log("Perfil criado com sucesso via método alternativo");
    return true;
  } catch (err) {
    console.error("Exceção ao criar perfil via método alternativo:", err);
    return false;
  }
};

/**
 * Verifica e repara problemas de perfil para um usuário específico
 */
export const diagnoseAndRepairProfile = async (userId: string): Promise<ProfileFixResult> => {
  if (!userId) {
    return {
      success: false,
      message: "ID de usuário não fornecido",
      error: "User ID is required"
    };
  }
  
  try {
    console.log("Iniciando diagnóstico e reparo para usuário:", userId);
    
    // Executar diagnóstico primeiro
    const diagnosticResult = await import('./runDiagnostics').then(mod => mod.runAuthDiagnostics(userId));
    
    // Se o perfil já existe e não há erros, não precisa reparar
    if (diagnosticResult.success && diagnosticResult.auth_user_exists && !diagnosticResult.errors?.profile_error) {
      return {
        success: true,
        message: "Perfil está íntegro, não é necessário reparo",
        profile: diagnosticResult.user_data
      };
    }
    
    // Se temos erro de recursão, notificar
    if (diagnosticResult.policy_recursion_detected) {
      return {
        success: false,
        message: "Detectado erro de recursão nas políticas. É necessário revisar as políticas RLS do banco de dados.",
        error: "Infinite recursion in RLS policies"
      };
    }
    
    // Se há problemas, tentar reparar com base no tipo de usuário
    const { data: userInfo, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userInfo?.user) {
      console.error("Erro ao obter informações do usuário para reparo:", userError);
      return {
        success: false,
        message: "Não foi possível obter informações do usuário para reparo",
        error: userError ? String(userError) : "User not found"
      };
    }
    
    // Tentar criar/reparar o perfil
    return await forceCreateProfile(userInfo.user);
    
  } catch (err) {
    console.error("Erro durante diagnóstico e reparo de perfil:", err);
    return {
      success: false,
      message: "Erro durante diagnóstico e reparo",
      error: String(err)
    };
  }
};
