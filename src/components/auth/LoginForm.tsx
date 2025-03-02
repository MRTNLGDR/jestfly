
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { LockKeyhole, Mail, ArrowRight, CheckCircle } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
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
          <div className="space-y-2">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-purple-500" />
              <label className="text-sm font-medium text-zinc-300">Email</label>
            </div>
            <div className="relative">
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-900/40 border-zinc-700/50 text-white pl-3 focus-visible:ring-purple-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LockKeyhole className="w-4 h-4 mr-2 text-purple-500" />
                <label className="text-sm font-medium text-zinc-300">Senha</label>
              </div>
              <Link to="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-900/40 border-zinc-700/50 text-white pl-3 focus-visible:ring-purple-500/50"
              />
            </div>
          </div>
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
        
        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black/40 px-2 text-zinc-400">Ou continue com</span>
          </div>
        </div>
        
        <Button 
          onClick={handleGoogleLogin} 
          disabled={isSubmitting}
          variant="outline" 
          className="w-full mt-4 text-white bg-zinc-900/50 border-zinc-700/50 hover:bg-zinc-800/60"
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
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
