
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import Footer from '../components/Footer';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    username: '',
  });
  
  const [loading, setLoading] = useState(false);

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    if (user) {
      // Redirecionar para a página destino, ou para home se não houver destino
      const destination = location.state?.from || '/';
      navigate(destination, { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        toast.error('Login falhou: ' + error.message);
      }
    } catch (error) {
      toast.error('Ocorreu um erro durante o login');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.email || !signupData.password || !signupData.confirmPassword || !signupData.displayName) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (signupData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      setLoading(true);
      
      const username = signupData.username || signupData.email.split('@')[0];
      
      const { error } = await signUp(
        signupData.email, 
        signupData.password, 
        {
          display_name: signupData.displayName,
          username: username,
          profile_type: 'fan',
        }
      );
      
      if (error) {
        toast.error('Registro falhou: ' + error.message);
      } else {
        toast.success('Conta criada com sucesso! Verifique seu email para confirmar.');
        setActiveTab('login');
      }
    } catch (error) {
      toast.error('Ocorreu um erro durante o registro');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 flex flex-col">
      <div className="container px-4 mx-auto flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Bem-vindo ao JESTFLY
            </h1>
            <p className="text-white/60 mt-2">
              Entre na sua conta ou crie uma nova para explorar
            </p>
          </div>

          <Card className="bg-black/30 backdrop-blur-sm border-purple-700/30">
            <CardHeader className="pb-3">
              <Tabs 
                value={activeTab} 
                onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full bg-black/20">
                  <TabsTrigger value="login" className="data-[state=active]:bg-purple-800/30">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-purple-800/30">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Cadastre-se
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className="bg-black/20 border-purple-900/50 focus-visible:ring-purple-500 pl-10"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">Senha</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="bg-black/20 border-purple-900/50 focus-visible:ring-purple-500 pl-10"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Entrar
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        className="bg-black/20 border-purple-900/50 focus-visible:ring-purple-500 pl-10"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-displayName" className="text-white">Nome de exibição</Label>
                    <Input
                      id="signup-displayName"
                      name="displayName"
                      placeholder="Como deseja ser chamado"
                      value={signupData.displayName}
                      onChange={handleSignupChange}
                      className="bg-black/20 border-purple-900/50 focus-visible:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-username" className="text-white">
                      Nome de usuário <span className="text-white/60">(opcional)</span>
                    </Label>
                    <Input
                      id="signup-username"
                      name="username"
                      placeholder="seu_username"
                      value={signupData.username}
                      onChange={handleSignupChange}
                      className="bg-black/20 border-purple-900/50 focus-visible:ring-purple-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Senha</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        className="bg-black/20 border-purple-900/50 focus-visible:ring-purple-500 pl-10"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirmPassword" className="text-white">Confirmar senha</Label>
                    <div className="relative">
                      <Input
                        id="signup-confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        className="bg-black/20 border-purple-900/50 focus-visible:ring-purple-500 pl-10"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Cadastrando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Criar conta
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            
            <CardFooter>
              <p className="text-sm text-white/60 text-center w-full">
                {activeTab === 'login' ? (
                  <>
                    Não tem uma conta?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      className="text-purple-400 hover:text-purple-300 hover:underline"
                    >
                      Cadastre-se
                    </button>
                  </>
                ) : (
                  <>
                    Já tem uma conta?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-purple-400 hover:text-purple-300 hover:underline"
                    >
                      Faça login
                    </button>
                  </>
                )}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AuthPage;
