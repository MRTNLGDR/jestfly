
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Combinando o estado de loading local com o do AuthContext
  const loading = isLoading || authLoading;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log(`Tentando login com email: ${email}`);
      const { error, data } = await signIn(email, password);
      
      if (error) {
        setError(error.message || 'Erro ao fazer login');
        toast({
          title: "Falha no login",
          description: error.message || "Credenciais inválidas",
          variant: "destructive",
        });
      } else if (data) {
        // Sucesso no login
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo ao JESTFLY",
          variant: "default",
        });
        
        // Redirecionamento baseado no tipo de perfil
        if (data.profile_type === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError((err as Error).message || 'Ocorreu um erro durante o login');
      toast({
        title: "Erro no sistema",
        description: (err as Error).message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'fan' | 'artist' | 'collaborator' | 'admin') => {
    try {
      setError('');
      setIsLoading(true);
      let demoEmail, demoPassword;
      
      // Usar os emails e senhas dos usuários demo atualizados de acordo com o migration
      switch (type) {
        case 'fan':
          demoEmail = 'fan@jestfly.com';
          demoPassword = 'fanpassword';
          break;
        case 'artist':
          demoEmail = 'artist@jestfly.com';
          demoPassword = 'artistpassword';
          break;
        case 'collaborator':
          demoEmail = 'collaborator@jestfly.com';
          demoPassword = 'collaboratorpassword';
          break;
        case 'admin':
          demoEmail = 'admin@jestfly.com';
          demoPassword = 'adminpassword';
          break;
      }
      
      console.log(`Tentando login como ${type} demo`);
      const { error, data } = await signIn(demoEmail, demoPassword);
      
      if (error) {
        console.error(`Erro no login demo ${type}:`, error);
        toast({
          title: "Erro de autenticação",
          description: `Não foi possível fazer login como ${type} demo. ${error.message}`,
          variant: "destructive",
        });
        setError(error.message || `Erro ao fazer login como ${type} demo`);
      } else if (data) {
        toast({
          title: "Login demo bem-sucedido",
          description: `Você está logado como ${type} demo`,
          variant: "default",
        });
        
        // Redirecionamento baseado no tipo de perfil
        if (type === 'admin') {
          navigate('/admin');
        } else if (type === 'artist') {
          // Artistas podem ser direcionados para uma página específica
          navigate('/');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error(`Erro ao fazer login como ${type} demo:`, err);
      toast({
        title: "Erro de sistema",
        description: (err as Error).message || "Ocorreu um erro no sistema",
        variant: "destructive",
      });
      setError((err as Error).message || 'Ocorreu um erro durante o login demo');
    } finally {
      setIsLoading(false);
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
