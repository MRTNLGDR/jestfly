
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract params from URL
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const code = queryParams.get('code');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !code) {
      toast.error('Link de recuperação de senha inválido');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the resetPassword function with the email from query params
      await resetPassword(email);
      toast.success('Senha redefinida com sucesso!');
      
      // Redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      toast.error(error.message || 'Falha ao redefinir senha');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative overflow-hidden">
      {/* Background elements similar to LoginPage */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black bg-opacity-90"></div>
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: `linear-gradient(#9b59b6 1px, transparent 1px), linear-gradient(90deg, #9b59b6 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>
      
      <div className="absolute top-0 left-0 right-0 bottom-0 -z-5">
        <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1/2 h-1/2 bg-blue-600/20 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-bold text-center text-white mb-6 flex flex-col items-center">
            <span className="text-3xl bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">JESTFLY</span>
            <div className="w-40 h-1 bg-gradient-to-r from-purple-600 to-blue-500 mt-3 rounded-full"></div>
          </h2>
        </div>
        
        <Card className="w-full max-w-md mx-auto bg-black/30 backdrop-blur-md border border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">Redefinir Senha</CardTitle>
            <CardDescription className="text-center text-zinc-400">
              Defina uma nova senha para sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Nova Senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-zinc-900/60 border-zinc-800 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Confirmar Senha</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-zinc-900/60 border-zinc-800 text-white"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              >
                {isSubmitting ? 'Processando...' : 'Redefinir Senha'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-zinc-400">
              Lembrou sua senha?{' '}
              <a href="/login" className="text-primary hover:underline">
                Voltar para o login
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
