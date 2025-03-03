
import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { FcGoogle } from 'react-icons/fc';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/profile');
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Email ou senha inválidos. Tente novamente.');
      } else if (error.message.includes('Invalid email')) {
        toast.error('Formato de email inválido. Verifique o e-mail e tente novamente.');
      } else if (error.message.includes('too many requests')) {
        toast.error('Muitas tentativas de login. Tente novamente mais tarde ou recupere sua senha.');
      } else {
        toast.error(error.message || 'Falha ao realizar login');
      }
      console.error('Erro de login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      // Redirect happens automatically via auth state change
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      toast.error(error.message || 'Falha ao realizar login com Google');
      setGoogleSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/30 backdrop-blur-md border border-zinc-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">Bem-vindo de volta</CardTitle>
        <CardDescription className="text-center text-zinc-400">
          Faça login para acessar sua conta JESTFLY
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
              disabled={isSubmitting || googleSubmitting}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Senha</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
              disabled={isSubmitting || googleSubmitting}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting || googleSubmitting} 
            className="w-full group bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Autenticando...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Entrar
                <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>
        
        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black/30 px-2 text-zinc-400">Ou continue com</span>
          </div>
        </div>
        
        <Button 
          onClick={handleGoogleLogin} 
          disabled={isSubmitting || googleSubmitting}
          variant="outline" 
          className="w-full mt-4 text-white bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80"
        >
          {googleSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Conectando...
            </span>
          ) : (
            <>
              <FcGoogle className="mr-2 h-5 w-5" />
              Google
            </>
          )}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-zinc-400">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
