
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/auth/useAuth';
import { Loader2 } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
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
      toast.success('Login bem-sucedido!');
      navigate('/profile');
    } catch (error: any) {
      let errorMessage = 'Falha ao fazer login';
      
      if (error.message?.includes('user-not-found')) {
        errorMessage = 'Usuário não encontrado';
      } else if (error.message?.includes('wrong-password')) {
        errorMessage = 'Senha incorreta';
      } else if (error.message?.includes('too-many-requests')) {
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
      toast.success('Login bem-sucedido!');
      navigate('/profile');
    } catch (error: any) {
      toast.error('Falha ao fazer login com Google: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-morphism">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">Bem-vindo de Volta</CardTitle>
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
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
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
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                Entrando <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </span>
            ) : 'Entrar'}
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
          disabled={isSubmitting}
          variant="outline" 
          className="w-full mt-4 text-white bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80"
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
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
