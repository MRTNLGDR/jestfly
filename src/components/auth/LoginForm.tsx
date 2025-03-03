import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, InfoIcon, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDemoLogin = async (type: 'artist' | 'fan' | 'collaborator') => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    let email, password;
    
    switch(type) {
      case 'artist':
        email = 'artist@jestfly.com';
        password = 'artistpassword';
        break;
      case 'collaborator':
        email = 'collaborator@jestfly.com';
        password = 'collaboratorpassword';
        break;
      case 'fan':
        email = 'fan@jestfly.com';
        password = 'fanpassword';
        break;
    }
    
    try {
      console.log(`Tentando login de demonstração como ${type}`, { email });
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error(`Erro no login demo ${type}:`, error);
        setError(`Erro no login de demonstração (${type}): ${error.message}`);
      } else {
        setSuccess(`Login de demonstração como ${type} bem-sucedido!`);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error(`Exceção no login demo ${type}:`, err);
      setError(`Erro inesperado no login de demonstração: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Tentando login normal com:', loginData.email);
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        console.error('Erro no login normal:', error);
        setError(error.message);
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Exceção no login normal:', error);
      setError((error as Error).message || 'Ocorreu um erro durante o login');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-xl text-white">Login</CardTitle>
        <CardDescription className="text-white/60">
          Entre com sua conta para acessar todos os recursos
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-white">Email</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={loginData.email}
              onChange={handleChange}
              className="bg-black/30 border-white/20 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-white">Senha</Label>
              <Button 
                type="button" 
                variant="link" 
                className="text-purple-400 hover:text-purple-300 p-0 h-auto"
                onClick={handleResetPassword}
              >
                Esqueceu a senha?
              </Button>
            </div>
            <Input
              id="login-password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={loginData.password}
              onChange={handleChange}
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
          
          {success && (
            <Alert className="bg-green-900/30 border-green-700 text-green-300">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Sucesso</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
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
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
        
        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-black px-2 text-white/60">Ou entre com uma conta de demonstração</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button 
              type="button" 
              variant="outline"
              className="bg-black/50 text-white border-blue-500/50 hover:bg-blue-900/30"
              onClick={() => handleDemoLogin('artist')}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Artista'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              className="bg-black/50 text-white border-green-500/50 hover:bg-green-900/30"
              onClick={() => handleDemoLogin('collaborator')}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Colaborador'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              className="bg-black/50 text-white border-indigo-500/50 hover:bg-indigo-900/30"
              onClick={() => handleDemoLogin('fan')}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fã'}
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              className="text-white/60 hover:text-white flex items-center justify-center gap-1.5"
              onClick={() => navigate('/admin/login')}
            >
              <Lock className="h-3.5 w-3.5" />
              Área de Administração
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
