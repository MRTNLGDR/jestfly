
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract hash parameters which contain the access token
  useEffect(() => {
    // The URL structure from Supabase password reset emails is like:
    // https://yoursite.com/reset-password#access_token=...&type=recovery
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
      // Store the access token in sessionStorage for the actual reset
      sessionStorage.setItem('passwordResetToken', accessToken);
    }
  }, []);
  
  const calculatePasswordStrength = (pwd: string): 'weak' | 'medium' | 'strong' | '' => {
    if (!pwd) return '';
    
    let score = 0;
    
    // Length check
    if (pwd.length > 8) score += 1;
    if (pwd.length > 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    if (score < 3) return 'weak';
    if (score < 5) return 'medium';
    return 'strong';
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };
  
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem', {
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
      return;
    }
    
    if (password.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres', {
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
      return;
    }
    
    if (passwordStrength === 'weak') {
      toast.error('Por favor, escolha uma senha mais forte', {
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Mostrar feedback visual de carregamento
    const loadingToast = toast.loading('Redefinindo senha...', {
      icon: <Loader2 className="h-5 w-5 animate-spin" />
    });
    
    try {
      const accessToken = sessionStorage.getItem('passwordResetToken');
      
      if (!accessToken) {
        throw new Error('Token de recuperação inválido ou expirado');
      }
      
      // Use the access token to update the password
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      // Limpar o token após uso
      sessionStorage.removeItem('passwordResetToken');
      
      // Fechar o toast de carregamento
      toast.dismiss(loadingToast);
      
      // Mostrar feedback visual de sucesso
      toast.success('Senha redefinida com sucesso!', {
        duration: 5000,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
      
      // Redirect to login page after short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      
      // Fechar o toast de carregamento
      toast.dismiss(loadingToast);
      
      // Mostrar feedback visual de erro
      toast.error(error.message || 'Falha ao redefinir senha', {
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
                  onChange={handlePasswordChange}
                  required
                  className="bg-zinc-900/60 border-zinc-800 text-white"
                />
                {passwordStrength && (
                  <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getPasswordStrengthColor()}`} 
                      style={{ 
                        width: passwordStrength === 'weak' ? '33%' : 
                               passwordStrength === 'medium' ? '66%' : '100%' 
                      }}
                    ></div>
                  </div>
                )}
                {passwordStrength && (
                  <p className={`text-xs ${
                    passwordStrength === 'weak' ? 'text-red-400' : 
                    passwordStrength === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {passwordStrength === 'weak' ? 'Senha fraca' : 
                     passwordStrength === 'medium' ? 'Senha média' : 'Senha forte'}
                  </p>
                )}
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
                {isSubmitting ? (
                  <span className="flex items-center">
                    Processando <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </span>
                ) : (
                  'Redefinir Senha'
                )}
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
