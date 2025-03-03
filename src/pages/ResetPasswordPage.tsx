
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2 } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Por favor, insira seu email');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(email);
      toast.success('Instruções de redefinição de senha enviadas para seu email');
      
      // Redirecionar para a página de login após um delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Erro na redefinição de senha:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black bg-opacity-90"></div>
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: `linear-gradient(#9b59b6 1px, transparent 1px), linear-gradient(90deg, #9b59b6 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>
      
      {/* Gradient light effects */}
      <div className="absolute top-0 left-0 right-0 bottom-0 -z-5">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple-600/10 rounded-full blur-[120px] transform -translate-x-1/4"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-600/10 rounded-full blur-[120px] transform translate-x-1/4"></div>
      </div>
      
      <div className="relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-bold text-center text-white mb-6 flex flex-col items-center">
            <span className="text-3xl bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">JESTFLY</span>
            <div className="w-40 h-1 bg-gradient-to-r from-purple-600 to-blue-500 mt-3 rounded-full"></div>
          </h2>
        </div>
        
        <Card className="w-full max-w-md mx-auto glass-morphism">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">Redefinir Senha</CardTitle>
            <CardDescription className="text-center text-zinc-400">
              Insira seu email para receber instruções de redefinição de senha
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
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    Enviando <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </span>
                ) : 'Enviar Instruções'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="link" 
              className="text-purple-400 hover:text-purple-300"
              onClick={() => navigate('/login')}
            >
              Voltar para Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
