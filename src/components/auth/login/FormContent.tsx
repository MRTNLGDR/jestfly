
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/auth';
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { toast } from 'sonner';
import { Mail, LockKeyhole, ArrowRight, CheckCircle } from 'lucide-react';
import { FormField } from './FormField';
import { SocialLoginOptions } from './SocialLoginOptions';
import { LoginFormData } from './types';

export const FormContent: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(formData.email, formData.password);
      toast.success('Login bem-sucedido!', {
        duration: 5000,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
      navigate('/profile');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Falha ao fazer login';
      
      if (error.message.includes('user-not-found')) {
        errorMessage = 'Usuário não encontrado';
      } else if (error.message.includes('wrong-password')) {
        errorMessage = 'Senha incorreta';
      } else if (error.message.includes('invalid-email')) {
        errorMessage = 'Email inválido';
      } else if (error.message.includes('too-many-requests')) {
        errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      toast.success('Login bem-sucedido!', {
        duration: 5000,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
      navigate('/profile');
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Falha ao fazer login com Google');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(100,100,255,0.1)]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          JESTFLY
        </CardTitle>
        <CardDescription className="text-center text-zinc-400">
          Entre com suas credenciais para acessar
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
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 group"
          >
            {isSubmitting ? 'Autenticando...' : (
              <span className="flex items-center">
                Entrar 
                <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>
        
        <SocialLoginOptions
          onGoogleLogin={handleGoogleLogin}
          isSubmitting={isSubmitting}
        />
      </CardContent>
      <CardFooter className="flex justify-center border-t border-zinc-800/50 pt-6">
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
