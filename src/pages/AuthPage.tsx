
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, InfoIcon } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const { user, profile, signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Estado para o formulário de login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Estado para o formulário de registro
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    display_name: '',
    username: '',
    profile_type: 'fan' as 'fan' | 'artist' | 'collaborator' | 'admin'
  });
  
  // Estado para erros
  const [errors, setErrors] = useState({
    login: '',
    register: ''
  });
  
  // Estado para mensagens de sucesso
  const [success, setSuccess] = useState({
    login: '',
    register: ''
  });

  // Se o usuário já estiver autenticado e for admin, redirecionar para o painel admin
  if (user && profile && profile.profile_type === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Se o usuário já estiver autenticado e não for admin, redirecionar para a página inicial
  if (user && profile && profile.profile_type !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setRegisterData((prev) => ({ 
      ...prev, 
      profile_type: value as 'fan' | 'artist' | 'collaborator' | 'admin' 
    }));
  };

  const handleDemoLogin = async (type: 'artist' | 'fan' | 'collaborator') => {
    setLoading(true);
    setErrors((prev) => ({ ...prev, login: '' }));
    setSuccess((prev) => ({ ...prev, login: '' }));
    
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
        setErrors((prev) => ({ 
          ...prev, 
          login: `Erro no login de demonstração (${type}): ${error.message}` 
        }));
      } else {
        setSuccess((prev) => ({ 
          ...prev, 
          login: `Login de demonstração como ${type} bem-sucedido!` 
        }));
      }
    } catch (err) {
      console.error(`Exceção no login demo ${type}:`, err);
      setErrors((prev) => ({ 
        ...prev, 
        login: `Erro inesperado no login de demonstração: ${(err as Error).message}` 
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors((prev) => ({ ...prev, login: '' }));
    setSuccess((prev) => ({ ...prev, login: '' }));
    
    try {
      console.log('Tentando login normal com:', loginData.email);
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        console.error('Erro no login normal:', error);
        setErrors((prev) => ({ ...prev, login: error.message }));
      }
    } catch (error) {
      console.error('Exceção no login normal:', error);
      setErrors((prev) => ({ 
        ...prev, 
        login: (error as Error).message || 'Ocorreu um erro durante o login' 
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors((prev) => ({ ...prev, register: '' }));
    setSuccess((prev) => ({ ...prev, register: '' }));
    
    // Validar dados de registro
    if (registerData.password !== registerData.confirmPassword) {
      setErrors((prev) => ({ 
        ...prev, 
        register: 'As senhas não coincidem' 
      }));
      setLoading(false);
      return;
    }
    
    // Não permitir criar usuários admin pelo formulário de registro público
    if (registerData.profile_type === 'admin') {
      setErrors((prev) => ({ 
        ...prev, 
        register: 'Não é permitido criar contas de administrador' 
      }));
      setLoading(false);
      return;
    }
    
    try {
      console.log('Tentando registro com:', registerData.email);
      const { error } = await signUp(
        registerData.email, 
        registerData.password,
        {
          display_name: registerData.display_name,
          username: registerData.username,
          profile_type: registerData.profile_type
        }
      );
      
      if (error) {
        console.error('Erro no registro:', error);
        setErrors((prev) => ({ ...prev, register: error.message }));
      } else {
        setSuccess((prev) => ({ 
          ...prev, 
          register: 'Conta criada com sucesso! Verifique seu email para confirmar o cadastro.' 
        }));
        
        // Limpar formulário após sucesso
        setRegisterData({
          email: '',
          password: '',
          confirmPassword: '',
          display_name: '',
          username: '',
          profile_type: 'fan'
        });
      }
    } catch (error) {
      console.error('Exceção no registro:', error);
      setErrors((prev) => ({ 
        ...prev, 
        register: (error as Error).message || 'Ocorreu um erro durante o registro' 
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/30 text-white">
            <TabsTrigger value="login" className="data-[state=active]:bg-purple-700">Login</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-purple-700">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="bg-black/40 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white">Login</CardTitle>
                <CardDescription className="text-white/60">
                  Entre com sua conta para acessar todos os recursos
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={loginData.email}
                      onChange={handleLoginChange}
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
                      onChange={handleLoginChange}
                      className="bg-black/30 border-white/20 text-white"
                    />
                  </div>
                  
                  {errors.login && (
                    <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{errors.login}</AlertDescription>
                    </Alert>
                  )}
                  
                  {success.login && (
                    <Alert className="bg-green-900/30 border-green-700 text-green-300">
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Sucesso</AlertTitle>
                      <AlertDescription>{success.login}</AlertDescription>
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
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="bg-black/40 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white">Cadastro</CardTitle>
                <CardDescription className="text-white/60">
                  Crie sua conta para fazer parte da comunidade JESTFLY
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-white">Email</Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="bg-black/30 border-white/20 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="display_name" className="text-white">Nome de Exibição</Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      type="text"
                      placeholder="Seu Nome"
                      required
                      value={registerData.display_name}
                      onChange={handleRegisterChange}
                      className="bg-black/30 border-white/20 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Nome de Usuário</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="seu_username"
                      required
                      value={registerData.username}
                      onChange={handleRegisterChange}
                      className="bg-black/30 border-white/20 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="profile_type" className="text-white">Tipo de Perfil</Label>
                    <Select
                      value={registerData.profile_type}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="bg-black/30 border-white/20 text-white">
                        <SelectValue placeholder="Selecione seu tipo de perfil" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 border-white/20 text-white">
                        <SelectItem value="fan">Fã</SelectItem>
                        <SelectItem value="artist">Artista</SelectItem>
                        <SelectItem value="collaborator">Colaborador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white">Senha</Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength={6}
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="bg-black/30 border-white/20 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      className="bg-black/30 border-white/20 text-white"
                    />
                  </div>
                  
                  {errors.register && (
                    <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{errors.register}</AlertDescription>
                    </Alert>
                  )}
                  
                  {success.register && (
                    <Alert className="bg-green-900/30 border-green-700 text-green-300">
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Sucesso</AlertTitle>
                      <AlertDescription>{success.register}</AlertDescription>
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
                        Criando conta...
                      </>
                    ) : (
                      'Criar Conta'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
