
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, Key, Mail, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AuthFormProps {
  redirectPath?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ redirectPath = '/' }) => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const from = location.state?.from || redirectPath;
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Credenciais inválidas. Verifique seu email e senha.');
        } else {
          setError(error.message);
        }
        return;
      }
      
      toast.success('Login realizado com sucesso!');
      navigate(from);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro durante o login.');
      console.error('Error during sign in:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (!displayName.trim() || !username.trim()) {
      setError('Nome e nome de usuário são obrigatórios.');
      setIsLoading(false);
      return;
    }
    
    try {
      const { error } = await signUp(email, password, {
        display_name: displayName,
        username: username,
        profile_type: 'fan' // Default to fan profile
      });
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setError('Este email já está registrado. Tente fazer login.');
        } else {
          setError(error.message);
        }
        return;
      }
      
      toast.success('Registro realizado com sucesso! Verifique seu email.');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro durante o registro.');
      console.error('Error during sign up:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickLogin = (demoType: 'admin' | 'artist' | 'collaborator' | 'fan') => {
    setIsLoading(true);
    setError(null);
    
    const demoAccounts = {
      admin: { email: 'admin@jestfly.com', password: 'admin123' },
      artist: { email: 'artist@jestfly.com', password: 'artist123' },
      collaborator: { email: 'collaborator@jestfly.com', password: 'collab123' },
      fan: { email: 'fan@jestfly.com', password: 'fan123' }
    };
    
    const { email, password } = demoAccounts[demoType];
    setEmail(email);
    setPassword(password);
    
    setTimeout(() => {
      signIn(email, password)
        .then(({ error }) => {
          if (error) {
            setError(error.message);
            return;
          }
          
          toast.success(`Login como ${demoType} realizado com sucesso!`);
          navigate(from);
        })
        .catch(err => {
          setError(err.message || 'Ocorreu um erro durante o login.');
          console.error('Quick login error:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 500);
  };
  
  return (
    <Card className="max-w-md w-full mx-auto bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-center text-white">JESTFLY</CardTitle>
        <CardDescription className="text-center text-white/60">Faça login ou crie uma conta para acessar o JESTFLY</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="login" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full bg-black/30">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>
          
          {error && (
            <div className="bg-red-900/20 border border-red-900/30 text-red-200 p-3 rounded-md flex items-start space-x-2 text-sm mt-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-black/30 border-white/10 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Senha</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-black/30 border-white/10 text-white"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
            
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-black/40 text-white/60">Ou acesso rápido</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickLogin('admin')}
                disabled={isLoading}
                className="bg-black/30 border-white/10 text-white hover:bg-white/10"
              >
                Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickLogin('artist')}
                disabled={isLoading}
                className="bg-black/30 border-white/10 text-white hover:bg-white/10"
              >
                Artista
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickLogin('collaborator')}
                disabled={isLoading}
                className="bg-black/30 border-white/10 text-white hover:bg-white/10"
              >
                Colaborador
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickLogin('fan')}
                disabled={isLoading}
                className="bg-black/30 border-white/10 text-white hover:bg-white/10"
              >
                Fã
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-white">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Seu Nome Completo"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="pl-10 bg-black/30 border-white/10 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Nome de usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="seu_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    required
                    className="pl-10 bg-black/30 border-white/10 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registerEmail" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input
                    id="registerEmail"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-black/30 border-white/10 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registerPassword" className="text-white">Senha</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                  <Input
                    id="registerPassword"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-black/30 border-white/10 text-white"
                    minLength={6}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  'Registrar'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex-col space-y-3">
        <p className="text-center text-xs text-white/60">
          Ao continuar, você concorda com os Termos de Serviço e Política de Privacidade do JESTFLY.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
