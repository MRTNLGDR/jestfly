
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { LockKeyhole, Mail, ArrowRight } from 'lucide-react';

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
      toast.success('Login successful!');
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      toast.success('Login successful!');
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-md border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-white">
          Acesso ao Sistema
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
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-900/70 border-zinc-700 text-white pl-3 focus-visible:ring-purple-500/50"
              />
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-500/80 to-blue-500/80 rounded-l-md"></div>
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
                className="bg-zinc-900/70 border-zinc-700 text-white pl-3 focus-visible:ring-purple-500/50"
              />
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-500/80 to-blue-500/80 rounded-l-md"></div>
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 group"
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
            <span className="bg-black/50 px-2 text-zinc-400">Ou continue com</span>
          </div>
        </div>
        
        <Button 
          onClick={handleGoogleLogin} 
          disabled={isSubmitting}
          variant="outline" 
          className="w-full mt-4 text-white bg-zinc-900/80 border-zinc-700 hover:bg-zinc-800/90"
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-zinc-800 pt-6">
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
