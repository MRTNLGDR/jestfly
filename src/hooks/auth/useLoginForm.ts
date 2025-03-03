
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, loading } = useAuth();

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

  const handleDemoLogin = async (type: 'fan' | 'artist') => {
    try {
      setError('');
      const demoEmail = type === 'fan' ? 'fan_demo@jestfly.com' : 'artist_demo@jestfly.com';
      const demoPassword = type === 'fan' ? 'fan123' : 'artist123';
      
      console.log(`Tentando login como ${type} demo`);
      const { error } = await signIn(demoEmail, demoPassword);
      
      if (error) {
        console.error(`Erro no login demo ${type}:`, error);
        setError(error.message || `Erro ao fazer login como ${type} demo`);
      }
    } catch (err) {
      console.error(`Erro ao fazer login como ${type} demo:`, err);
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
