
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError((err as Error).message || 'Ocorreu um erro durante o login');
    }
  };

  const handleDemoFanLogin = async () => {
    try {
      setError('');
      const { error } = await signIn('fan_demo@jestfly.com', 'fan123');
      
      if (error) {
        setError(error.message || 'Erro ao fazer login como fã demo');
      }
    } catch (err) {
      console.error('Erro ao fazer login como fã demo:', err);
      setError((err as Error).message || 'Ocorreu um erro durante o login demo');
    }
  };

  const handleDemoArtistLogin = async () => {
    try {
      setError('');
      const { error } = await signIn('artist_demo@jestfly.com', 'artist123');
      
      if (error) {
        setError(error.message || 'Erro ao fazer login como artista demo');
      }
    } catch (err) {
      console.error('Erro ao fazer login como artista demo:', err);
      setError((err as Error).message || 'Ocorreu um erro durante o login demo');
    }
  };

  return (
    <Card className="w-full bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-xl text-white">Login</CardTitle>
        <CardDescription className="text-white/60">
          Faça login na sua conta JESTFLY
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/30 border-white/20 text-white pl-9"
                placeholder="seu@email.com"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-white">Senha</Label>
              <Link 
                to="/reset-password" 
                className="text-xs text-purple-400 hover:text-purple-300 hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/30 border-white/20 text-white pl-9"
                placeholder="********"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
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
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-black px-2 text-white/60">Ou use as contas de demonstração</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button 
              variant="outline" 
              className="w-full border-purple-500/30 hover:bg-purple-900/30 text-sm"
              onClick={handleDemoFanLogin}
              disabled={loading}
            >
              Demo Fã
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-blue-500/30 hover:bg-blue-900/30 text-sm"
              onClick={handleDemoArtistLogin}
              disabled={loading}
            >
              Demo Artista
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t border-white/10 pt-4">
        <p className="text-white/60 text-sm">
          Não tem uma conta?{' '}
          <Link to="/auth?tab=register" className="text-purple-400 hover:text-purple-300 hover:underline">
            Registre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
