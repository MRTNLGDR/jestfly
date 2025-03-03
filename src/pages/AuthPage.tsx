
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Mail, Key, User, UserPlus, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '../components/ui/separator';
import Footer from '../components/Footer';

const AuthPage: React.FC = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Register Form State
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerDisplayName, setRegisterDisplayName] = useState('');
  const [registerProfileType, setRegisterProfileType] = useState<'fan' | 'artist'>('fan');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);
  
  // Handle Login Form Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      const { error } = await signIn(loginEmail, loginPassword);
      if (!error) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // Handle Register Form Submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerEmail || !registerPassword || !registerUsername || !registerDisplayName) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    setIsRegistering(true);
    
    try {
      const { error } = await signUp(
        registerEmail,
        registerPassword,
        {
          username: registerUsername,
          display_name: registerDisplayName,
          profile_type: registerProfileType
        }
      );
      
      if (!error) {
        toast.success('Cadastro realizado! Verifique seu email para confirmar sua conta.');
        setActiveTab('login');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsRegistering(false);
    }
  };
  
  // If still loading, show loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-purple-400 animate-pulse text-xl">Carregando...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              {activeTab === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
            </h1>
            <p className="mt-2 text-white/70">
              {activeTab === 'login'
                ? 'Faça login para acessar o mundo JESTFLY'
                : 'Junte-se à comunidade JESTFLY e acesse conteúdo exclusivo'}
            </p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-purple-600">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-purple-600">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Cadastro
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10 bg-white/5 border-white/10"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="login-password">Senha</Label>
                      <a href="#" className="text-xs text-purple-400 hover:text-purple-300">
                        Esqueceu a senha?
                      </a>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-white/5 border-white/10"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10 bg-white/5 border-white/10"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Nome de usuário</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input
                          id="register-username"
                          type="text"
                          placeholder="seu_username"
                          className="pl-10 bg-white/5 border-white/10"
                          value={registerUsername}
                          onChange={(e) => setRegisterUsername(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-display-name">Nome de exibição</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input
                          id="register-display-name"
                          type="text"
                          placeholder="Seu Nome"
                          className="pl-10 bg-white/5 border-white/10"
                          value={registerDisplayName}
                          onChange={(e) => setRegisterDisplayName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-white/5 border-white/10"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirme a senha</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        id="register-confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 bg-white/5 border-white/10"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tipo de perfil</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        className={`p-3 rounded-lg border ${
                          registerProfileType === 'fan'
                            ? 'bg-purple-900/30 border-purple-500'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        } transition-colors`}
                        onClick={() => setRegisterProfileType('fan')}
                      >
                        <div className="font-medium">Fã</div>
                        <div className="text-xs text-white/70">Acesso a conteúdo exclusivo</div>
                      </button>
                      
                      <button
                        type="button"
                        className={`p-3 rounded-lg border ${
                          registerProfileType === 'artist'
                            ? 'bg-blue-900/30 border-blue-500'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        } transition-colors`}
                        onClick={() => setRegisterProfileType('artist')}
                      >
                        <div className="font-medium">Artista</div>
                        <div className="text-xs text-white/70">Publique e venda seu trabalho</div>
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={isRegistering}
                  >
                    {isRegistering ? "Cadastrando..." : "Criar conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <Separator className="my-6 bg-white/10" />
            
            <div className="text-center text-sm text-white/70">
              <p>
                {activeTab === 'login'
                  ? 'Não tem uma conta? '
                  : 'Já tem uma conta? '
                }
                <button
                  type="button"
                  className="text-purple-400 hover:text-purple-300"
                  onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                >
                  {activeTab === 'login' ? 'Cadastre-se' : 'Faça login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AuthPage;
