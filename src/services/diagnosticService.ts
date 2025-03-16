
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

export const runAuthDiagnostics = async (userId?: string) => {
  if (!userId) {
    return {
      success: false,
      error: "ID de usuário não fornecido",
      timestamp: new Date().toISOString()
    };
  }

  try {
    // Teste de conectividade
    const connectivityStart = Date.now();
    const { data: connectivityTest, error: connectivityError } = await supabase
      .from('diagnostic_logs')
      .select('id')
      .limit(1);
    
    const connectivityTime = Date.now() - connectivityStart;
    
    // Verificar existência do usuário na autenticação
    let authUser = null;
    let authError = null;
    
    try {
      const { data, error } = await supabase.auth.getUser();
      authUser = data?.user || null;
      authError = error;
    } catch (err: any) {
      authError = { message: err.message };
    }
    
    // Verificar existência do perfil
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    // Registrar o diagnóstico
    try {
      await supabase.from('diagnostic_logs').insert({
        message: 'Auth diagnostics run',
        metadata: {
          user_id: userId,
          auth_found: !!authUser,
          profile_found: !!userProfile,
          connectivity_time_ms: connectivityTime,
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError: any) {
      console.error("Error logging diagnostic:", logError);
    }
    
    return {
      success: true,
      timestamp: new Date().toISOString(),
      connectivity: {
        success: !connectivityError,
        time_ms: connectivityTime,
        error: connectivityError ? connectivityError.message : null
      },
      auth_user: authUser ? {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at
      } : null,
      user_data: userProfile,
      errors: {
        connectivity: connectivityError ? connectivityError.message : null,
        auth: authError ? authError.message : null,
        profile: profileError ? profileError.message : null
      }
    };
  } catch (error: any) {
    console.error("Erro ao executar diagnóstico:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

export const attemptProfileFix = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error("Error getting session for fix:", sessionError);
      toast.error("Erro ao obter sessão. Faça login novamente.");
      return false;
    }
    
    const user = session.user;
    
    // Verificar se o perfil existe
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking profile for fix:", checkError);
      return false;
    }
    
    // Se o perfil não existir, crie-o
    if (!existingProfile) {
      const userMetadata = user.user_metadata || {};
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          display_name: userMetadata.display_name || userMetadata.name || user.email?.split('@')[0] || 'User',
          username: userMetadata.username || user.email?.split('@')[0] || `user_${Date.now()}`,
          profile_type: userMetadata.profile_type || 'fan',
          avatar: userMetadata.avatar_url || null,
          is_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        });
      
      if (insertError) {
        console.error("Error creating profile during fix:", insertError);
        toast.error("Erro ao criar perfil. Tente novamente mais tarde.");
        return false;
      }
      
      console.log("Successfully created missing profile during fix");
      toast.success("Perfil criado com sucesso!");
      return true;
    }
    
    // Se o perfil existe, atualize-o com os metadados mais recentes
    const userMetadata = user.user_metadata || {};
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        email: user.email,
        display_name: userMetadata.display_name || userMetadata.name || undefined,
        username: userMetadata.username || undefined,
        avatar: userMetadata.avatar_url || undefined,
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (updateError) {
      console.error("Error updating profile during fix:", updateError);
      toast.error("Erro ao atualizar perfil. Tente novamente mais tarde.");
      return false;
    }
    
    console.log("Successfully updated profile during fix");
    toast.success("Perfil atualizado com sucesso!");
    return true;
  } catch (error: any) {
    console.error("Exception during profile fix:", error);
    toast.error("Erro ao corrigir perfil: " + error.message);
    return false;
  }
};

export const forceCreateProfile = async (user: User) => {
  try {
    const userMetadata = user.user_metadata || {};
    
    // Usar upsert para garantir que não haverá conflito
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        display_name: userMetadata.display_name || userMetadata.name || user.email?.split('@')[0] || 'User',
        username: userMetadata.username || user.email?.split('@')[0] || `user_${Date.now()}`,
        profile_type: userMetadata.profile_type || 'fan',
        avatar: userMetadata.avatar_url || null,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      }, { onConflict: 'id' });
    
    if (upsertError) {
      console.error("Error force creating profile:", upsertError);
      return false;
    }
    
    console.log("Successfully force created profile");
    return true;
  } catch (error: any) {
    console.error("Exception during force profile creation:", error);
    return false;
  }
};
