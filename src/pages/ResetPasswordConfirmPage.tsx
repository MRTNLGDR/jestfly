
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const ResetPasswordConfirmPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há hash na URL (confirmação de redefinição de senha)
    const handleHashChange = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        // Hash presente, usuário veio do email de recuperação
        console.log('Hash de recuperação detectado');
      }
    };

    handleHashChange();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar senhas
      if (newPassword.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      console.log('Redefinindo senha...');

      // Atualizar a senha
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Erro ao redefinir senha:', error);
        throw new Error(error.message);
      }

      setSuccess(true);
      console.log('Senha redefinida com sucesso');
      
      // Redirecionar para o login após alguns segundos
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (error) {
      console.error('Exceção ao redefinir senha:', error);
      setError((error as Error).message || 'Ocorreu um erro ao redefinir sua senha');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="bg-black/40 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-xl text-white">Redefinir Senha</CardTitle>
            <CardDescription className="text-white/60">
              Crie uma nova senha para sua conta
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
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="bg-black/30 border-white/20 text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-white/70"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Redefinindo...
                    </>
                  ) : (
                    'Redefinir Senha'
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <Alert className="bg-green-900/30 border-green-700 text-green-300">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Senha Redefinida</AlertTitle>
                  <AlertDescription>
                    Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login.
                  </AlertDescription>
                </Alert>
                
                <Button
                  type="button"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => navigate('/auth')}
                >
                  Ir para Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmPage;
