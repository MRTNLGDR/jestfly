import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/auth/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors((prev) => ({ ...prev, login: '' }));
    
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      if (error) {
        setErrors((prev) => ({ ...prev, login: error.message }));
      }
    } catch (error) {
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
    
    // Validar dados de registro
    if (registerData.password !== registerData.confirmPassword) {
      setErrors((prev) => ({ 
        ...prev, 
        register: 'As senhas não coincidem' 
      }));
      setLoading(false);
      return;
    }
    
    try {
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
        setErrors((prev) => ({ ...prev, register: error.message }));
      }
    } catch (error) {
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
                    <div className="p-3 bg-red-900/30 border border-red-700 rounded-md text-red-300 text-sm">
                      {errors.login}
                    </div>
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
                    <div className="p-3 bg-red-900/30 border border-red-700 rounded-md text-red-300 text-sm">
                      {errors.register}
                    </div>
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
