
import { supabase } from '../../../integrations/supabase/client';
import { User as AppUser } from '../../../models/User';
import { toast } from 'sonner';

/**
 * Registrar um novo usuário
 */
export const register = async (email: string, password: string, userData: Partial<AppUser>): Promise<void> => {
  try {
    console.log('Iniciando registro para:', email, 'Tipo de perfil:', userData.profileType);
    
    // Preparar dados do perfil para registro
    const userMetadata = {
      full_name: userData.displayName,
      username: userData.username,
      profile_type: userData.profileType
    };
    
    // Verificar se é cadastro de admin e validar código
    if (userData.profileType === 'admin' && userData.adminCode) {
      console.log('Validando código de administrador');
      
      // Verificar o código admin antes do registro
      const { data: codeValid, error } = await supabase.rpc(
        'has_role', 
        { user_id: 'system', required_role: 'admin' }
      );
      
      if (error || !codeValid) {
        console.error('Código de administrador inválido:', error);
        throw new Error('Código de administrador inválido ou já utilizado');
      }
    }
    
    console.log('Enviando solicitação de registro para Supabase');
    
    // Registrar usuário no Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata,
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    
    if (error) {
      console.error('Erro no registro:', error.message);
      throw error;
    }
    
    console.log('Registro bem-sucedido:', data.user?.id);
    
    // Se é admin, processar o código admin
    if (data?.user && userData.profileType === 'admin' && userData.adminCode) {
      try {
        console.log('Processando código de administrador para o usuário:', data.user.id);
        
        // Buscar token para autorização
        const { data: authData } = await supabase.auth.getSession();
        const token = authData.session?.access_token;
        
        if (!token) {
          console.error('Token não disponível para verificação de código admin');
          return;
        }
        
        // Chamar a edge function para verificar e processar o código admin
        const response = await fetch(`${window.location.origin}/functions/v1/verify-admin-code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: data.user.id,
            adminCode: userData.adminCode
          })
        });
        
        const result = await response.json();
        
        if (!result.success) {
          console.error('Falha ao processar código admin:', result.error);
        }
      } catch (adminErr) {
        console.error('Erro ao processar código admin:', adminErr);
      }
    }
    
    toast.success('Conta criada! Verifique seu email para confirmar o cadastro.');
    
  } catch (err: any) {
    console.error("Erro no registro:", err);
    
    let errorMessage = 'Falha ao criar conta';
    
    if (err.message.includes('User already registered')) {
      errorMessage = 'Este email já está em uso';
    } else if (err.message.includes('invalid email')) {
      errorMessage = 'Email inválido';
    } else if (err.message.includes('Password should be')) {
      errorMessage = 'A senha deve ter pelo menos 6 caracteres';
    } else if (err.message.includes('Código de administrador inválido')) {
      errorMessage = 'Código de administrador inválido ou já utilizado';
    }
    
    toast.error(errorMessage);
    throw err;
  }
};
