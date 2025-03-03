
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, loading } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log(`Tentando login com email: ${email}`);
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError((err as Error).message || 'Ocorreu um erro durante o login');
    }
  };

  const handleDemoLogin = async (type: 'fan' | 'artist' | 'admin') => {
    try {
      setError('');
      let demoEmail, demoPassword;
      
      // Usar os IDs atualizados para os usuários demo
      switch (type) {
        case 'fan':
          demoEmail = 'fan_demo@jestfly.com';
          demoPassword = 'fan123';
          break;
        case 'artist':
          demoEmail = 'artist_demo@jestfly.com';
          demoPassword = 'artist123';
          break;
        case 'admin':
          demoEmail = 'admin_demo@jestfly.com';
          demoPassword = 'admin123';
          break;
      }
      
      console.log(`Tentando login como ${type} demo`);
      const { error } = await signIn(demoEmail, demoPassword);
      
      if (error) {
        console.error(`Erro no login demo ${type}:`, error);
        toast({
          title: "Erro de autenticação",
          description: `Não foi possível fazer login como ${type} demo. ${error.message}`,
          variant: "destructive",
        });
        setError(error.message || `Erro ao fazer login como ${type} demo`);
      } else {
        toast({
          title: "Login demo bem-sucedido",
          description: `Você está logado como ${type} demo`,
          variant: "default",
        });
      }
    } catch (err) {
      console.error(`Erro ao fazer login como ${type} demo:`, err);
      toast({
        title: "Erro de sistema",
        description: (err as Error).message || "Ocorreu um erro no sistema",
        variant: "destructive",
      });
      setError((err as Error).message || 'Ocorreu um erro durante o login demo');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
    handleDemoLogin
  };
};
