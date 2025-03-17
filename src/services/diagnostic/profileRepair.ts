
import { User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
import { logDiagnosticInfo } from './connectivityUtils';
import { ProfileFixResult } from './types';

/**
 * Tenta corrigir problemas de perfil detectados
 */
export const attemptProfileFix = async (): Promise<boolean> => {
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
export const forceCreateProfile = async (user: User): Promise<boolean> => {
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
      await logDiagnosticInfo('Falha na criação forçada de perfil', {
        user_id: user.id,
        error: String(insertError),
        timestamp: new Date().toISOString()
      });
      
      return false;
    }
    
    console.log("Perfil forçado criado com sucesso");
    
    // Registrar diagnóstico
    await logDiagnosticInfo('Perfil forçado criado com sucesso', {
      user_id: user.id,
      timestamp: new Date().toISOString()
    });
    
    toast.success("Perfil criado com sucesso!");
    return true;
  } catch (err) {
    console.error("Exceção durante criação forçada de perfil:", err);
    toast.error("Erro ao criar perfil: " + String(err));
    return false;
  }
};
