
import { supabase } from '../../../integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Login com email e senha
 */
export const login = async (email: string, password: string): Promise<void> => {
  try {
    console.log('Tentando login com email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Erro durante login:', error.message);
      throw error;
    }
    
    if (data.user) {
      console.log('Login bem-sucedido para:', data.user.email);
      toast.success('Login realizado com sucesso!');
    }
  } catch (err: any) {
    console.error("Erro de login:", err);
    
    let errorMessage = 'Falha ao fazer login';
    if (err.message && err.message.includes('Invalid login credentials')) {
      errorMessage = 'Credenciais inválidas';
    } else if (err.message && err.message.includes('Email not confirmed')) {
      errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
    }
    
    toast.error(errorMessage);
    throw err;
  }
};

/**
 * Login com Google
 */
export const loginWithGoogle = async (): Promise<void> => {
  try {
    console.log('Iniciando login com Google');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/profile`
      }
    });
    
    if (error) {
      console.error('Erro no login com Google:', error.message);
      throw error;
    }
    
    console.log("Login com Google iniciado:", data);
  } catch (err: any) {
    console.error("Erro no login com Google:", err);
    throw err;
  }
};
