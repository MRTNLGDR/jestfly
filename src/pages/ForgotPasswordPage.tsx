
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '../contexts/auth';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, informe seu e-mail', {
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Mostrar feedback visual de carregamento
    const loadingToast = toast.loading('Enviando e-mail de recuperação...', {
      icon: <Loader2 className="h-5 w-5 animate-spin" />
    });
    
    try {
      await resetPassword(email);
      
      // Fechar o toast de carregamento
      toast.dismiss(loadingToast);
      
      // Mostrar feedback visual de sucesso
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.', {
        duration: 5000,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
      
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Erro ao enviar e-mail de recuperação:', error);
      
      // Fechar o toast de carregamento
      toast.dismiss(loadingToast);
      
      // Mostrar feedback visual de erro
      toast.error(error.message || 'Falha ao enviar e-mail de recuperação', {
        duration: 5000,
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
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
            <CardTitle className="text-2xl font-bold text-center text-white">Recuperar Senha</CardTitle>
            <CardDescription className="text-center text-zinc-400">
              {isSuccess ? 
                'Verifique seu e-mail para redefinir sua senha' : 
                'Enviaremos um e-mail com instruções para redefinir sua senha'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="flex flex-col items-center space-y-4 p-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-zinc-300 text-center">
                  Enviamos um e-mail para <span className="font-medium">{email}</span> com instruções para redefinir sua senha.
                </p>
                <p className="text-zinc-400 text-sm text-center">
                  Se não encontrar o e-mail, verifique sua pasta de spam ou lixo eletrônico.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">E-mail</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
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
                  ) : (
                    'Enviar E-mail de Recuperação'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-zinc-400">
              Lembrou sua senha?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Voltar para o login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
