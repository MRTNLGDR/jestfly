
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, InfoIcon, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AdminLoginFormProps {
  onSuccess?: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSuccess }) => {
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

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Tentando login como admin demo');
      // Usamos a credencial do admin que criamos via SQL
      const { error } = await signIn('admin_demo@jestfly.com', 'admin123');
      
      if (error) {
        console.error('Erro no login demo admin:', error);
        setError(`Erro no login de demonstração: ${error.message}`);
      } else {
        setSuccess('Login de demonstração como admin bem-sucedido!');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Exceção no login demo admin:', err);
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
      console.log('Tentando login admin com:', loginData.email);
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        console.error('Erro no login admin:', error);
        setError(error.message);
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Exceção no login admin:', error);
      setError((error as Error).message || 'Ocorreu um erro durante o login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader className="border-b border-white/10 pb-6">
        <div className="flex items-center justify-center mb-4">
          <ShieldAlert className="h-10 w-10 text-purple-500 mr-2" />
          <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
        </div>
        <CardDescription className="text-white/60 text-center">
          Acesso restrito para administradores do sistema
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-white">Email</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              placeholder="admin@jestfly.com"
              required
              value={loginData.email}
              onChange={handleChange}
              className="bg-black/30 border-white/20 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="login-password" className="text-white">Senha</Label>
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
              'Entrar como Admin'
            )}
          </Button>
        </form>
        
        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-black px-2 text-white/60">Ou use a conta de demonstração</span>
            </div>
          </div>
          
          <Button 
            type="button" 
            variant="outline"
            className="w-full bg-black/50 text-white border-purple-500/50 hover:bg-purple-900/30"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Demo Admin
          </Button>
          
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              className="text-white/60 hover:text-white"
              onClick={() => navigate('/auth')}
            >
              Login de Usuário Regular
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLoginForm;
