
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, InfoIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const ResetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Verificar se o email está preenchido
      if (!email.trim()) {
        throw new Error('Por favor, informe seu email');
      }
      
      console.log('Enviando email de recuperação para:', email);
      
      // Enviar email de recuperação de senha
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password-confirm`,
      });
      
      if (error) {
        console.error('Erro ao enviar email de recuperação:', error);
        throw new Error(error.message);
      }
      
      setSuccess(true);
      console.log('Email de recuperação enviado com sucesso');
    } catch (error) {
      console.error('Exceção ao solicitar recuperação de senha:', error);
      setError((error as Error).message || 'Ocorreu um erro ao enviar o email de recuperação');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackToLogin = () => {
    navigate('/auth');
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-xl text-white">Recuperar Senha</CardTitle>
        <CardDescription className="text-white/60">
          Enviaremos um link para redefinir sua senha
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-white">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/30 border-white/20 text-white"
              />
            </div>
            
            {error && (
              <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Link de Recuperação'
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full text-white/70 hover:text-white hover:bg-white/10"
              onClick={handleBackToLogin}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Login
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-green-900/30 border-green-700 text-green-300">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Email Enviado</AlertTitle>
              <AlertDescription>
                Um link para redefinir sua senha foi enviado para {email}.
                Verifique sua caixa de entrada e siga as instruções.
              </AlertDescription>
            </Alert>
            
            <Button
              type="button"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={handleBackToLogin}
            >
              Voltar para o Login
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
