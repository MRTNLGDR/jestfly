
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/auth';
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { toast } from 'sonner';
import { Mail, LockKeyhole, ArrowRight, CheckCircle, XCircle, Loader2, ShieldAlert } from 'lucide-react';
import { FormField } from './FormField';
import { SocialLoginOptions } from './SocialLoginOptions';
import { LoginFormData } from './types';
import { supabaseAuthService } from '../../../contexts/auth/supabaseAuthService';

export const FormContent: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isGoogleEnabled, setIsGoogleEnabled] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Verificar se o Google Auth está habilitado
  useEffect(() => {
    const checkGoogleAuth = async () => {
      try {
        const enabled = await supabaseAuthService.isGoogleAuthEnabled();
        setIsGoogleEnabled(enabled);
      } catch (error) {
        console.error("Erro ao verificar status do Google Auth:", error);
        setIsGoogleEnabled(false);
      }
    };
    
    checkGoogleAuth();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAdminLogin = () => {
    setIsAdminLogin(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mostrar feedback visual de carregamento
    const loadingToast = toast.loading('Autenticando...', {
      icon: <Loader2 className="h-5 w-5 animate-spin" />
    });
    
    try {
      console.log('Attempting login with:', formData.email);
      await login(formData.email, formData.password);
      
      // Fechar o toast de carregamento
      toast.dismiss(loadingToast);
      
      // Mostrar feedback visual de sucesso
      toast.success('Login bem-sucedido!', {
        duration: 5000,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
      
      // Verificar se é um e-mail de admin para redirecionar ao painel de admin
      if (isAdminLogin || formData.email.includes('admin') || formData.email === 'lucas@martynlegrand.com') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Fechar o toast de carregamento
      toast.dismiss(loadingToast);
      
      let errorMessage = 'Falha ao fazer login';
      
      if (error.message?.includes('user-not-found') || error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Usuário não encontrado ou senha incorreta';
      } else if (error.message?.includes('wrong-password') || error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Senha incorreta';
      } else if (error.message?.includes('invalid-email')) {
        errorMessage = 'Email inválido';
      } else if (error.message?.includes('too-many-requests')) {
        errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde';
      } else if (error.message?.includes('api-key-not-valid')) {
        errorMessage = 'Erro de configuração do Firebase. Entre em contato com o suporte.';
      }
      
      // Mostrar feedback visual de erro
      toast.error(errorMessage, {
        duration: 5000,
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isGoogleEnabled) {
      toast.error('Login com Google não está configurado. Entre em contato com o administrador.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Mostrar feedback visual de carregamento
    const loadingToast = toast.loading('Conectando com Google...', {
      icon: <Loader2 className="h-5 w-5 animate-spin" />
    });
    
    try {
      await loginWithGoogle();
      
      // Fechar o toast de carregamento
      toast.dismiss(loadingToast);
      
      // Mostrar feedback visual de sucesso
      toast.success('Login bem-sucedido!', {
        duration: 5000,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
      
      navigate('/profile');
    } catch (error: any) {
      console.error('Google login error:', error);
      
      // Fechar o toast de carregamento
      toast.dismiss(loadingToast);
      
      let errorMessage = 'Falha ao fazer login com Google';
      
      if (error.message?.includes('provider is not enabled')) {
        errorMessage = 'Login com Google não está habilitado. Entre em contato com o administrador.';
      } else if (error.message?.includes('api-key-not-valid')) {
        errorMessage = 'Erro de configuração. Entre em contato com o suporte.';
      }
      
      // Mostrar feedback visual de erro
      toast.error(errorMessage, {
        duration: 5000,
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardClassName = `w-full max-w-md mx-auto glass-morphism ${isAdminLogin ? 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : ''}`;

  return (
    <Card className={cardClassName}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-white">
            {isAdminLogin ? 'Admin Login' : 'Login'}
          </CardTitle>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleAdminLogin}
            className={`rounded-full p-2 ${isAdminLogin ? 'text-red-400 hover:text-red-300' : 'text-zinc-400 hover:text-zinc-300'}`}
          >
            <ShieldAlert className="h-5 w-5" />
          </Button>
        </div>
        <CardDescription className="text-zinc-400">
          {isAdminLogin ? 'Acesso administrativo restrito' : 'Entre com suas credenciais para acessar'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            icon={Mail}
          />
          
          <FormField
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            label="Senha"
            icon={LockKeyhole}
            rightElement={
              <Link to="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 hover:underline">
                Esqueceu a senha?
              </Link>
            }
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className={`w-full group ${isAdminLogin 
              ? 'bg-gradient-to-r from-red-600/90 to-purple-600/90 hover:from-red-700 hover:to-purple-700' 
              : 'bg-gradient-to-r from-purple-600/90 to-blue-600/90 hover:from-purple-700 hover:to-blue-700'}`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                Autenticando <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </span>
            ) : (
              <span className="flex items-center">
                {isAdminLogin ? 'Admin Login' : 'Entrar'} 
                <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>
        
        {!isAdminLogin && (
          <SocialLoginOptions
            onGoogleLogin={handleGoogleLogin}
            isSubmitting={isSubmitting}
            isGoogleEnabled={isGoogleEnabled}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t border-zinc-800/30 pt-6">
        <p className="text-sm text-zinc-400">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
