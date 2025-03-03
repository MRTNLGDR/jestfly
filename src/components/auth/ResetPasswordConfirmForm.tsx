
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, InfoIcon, Loader2, LockIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const ResetPasswordConfirmForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Verificar senhas
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }
      
      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }
      
      console.log('Atualizando senha do usuário');
      
      // Atualizar senha do usuário
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        console.error('Erro ao atualizar senha:', error);
        throw new Error(error.message);
      }
      
      setSuccess(true);
      console.log('Senha atualizada com sucesso');
    } catch (error) {
      console.error('Exceção ao atualizar senha:', error);
      setError((error as Error).message || 'Ocorreu um erro ao atualizar sua senha');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackToLogin = () => {
    navigate('/auth');
  };

  useEffect(() => {
    // Verificar se o usuário chegou a esta página através de um link de recuperação
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.error('Usuário não autenticado ou sessão inválida');
        setError('Link de recuperação inválido ou expirado. Por favor, solicite um novo link.');
      }
    };
    
    checkSession();
  }, []);

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-xl text-white">Criar Nova Senha</CardTitle>
        <CardDescription className="text-white/60">
          Digite e confirme sua nova senha
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-white">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/30 border-white/20 text-white pl-9"
                  placeholder="Digite sua nova senha"
                />
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-white">Confirmar Senha</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-black/30 border-white/20 text-white pl-9"
                  placeholder="Confirme sua nova senha"
                />
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              </div>
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
                  Atualizando...
                </>
              ) : (
                'Atualizar Senha'
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
              <AlertTitle>Senha Atualizada</AlertTitle>
              <AlertDescription>
                Sua senha foi atualizada com sucesso. Agora você pode fazer login com sua nova senha.
              </AlertDescription>
            </Alert>
            
            <Button
              type="button"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={handleBackToLogin}
            >
              Ir para o Login
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResetPasswordConfirmForm;
