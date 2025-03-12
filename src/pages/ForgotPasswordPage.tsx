
import React, { useState } from 'react';
import { useAuth } from '../contexts/auth';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Por favor, informe seu e-mail');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(email);
      setIsSuccess(true);
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao enviar o e-mail de recuperação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-20">
      <Card className="w-full max-w-md mx-auto bg-black/30 backdrop-blur-md border border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">
            {isSuccess ? 'E-mail Enviado' : 'Recuperar Senha'}
          </CardTitle>
          <CardDescription className="text-center text-zinc-400">
            {isSuccess 
              ? 'Verifique seu e-mail para instruções de recuperação de senha'
              : 'Informe seu e-mail para receber instruções de recuperação'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center space-y-4">
              <p className="text-zinc-300">
                Enviamos um e-mail com instruções para recuperar sua senha. 
                Se não encontrá-lo na caixa de entrada, verifique também a pasta de spam.
              </p>
              <Button 
                onClick={() => setIsSuccess(false)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                Tentar novamente
              </Button>
            </div>
          ) : (
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
                {isSubmitting ? 'Enviando...' : 'Enviar instruções'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className="flex items-center text-sm text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
