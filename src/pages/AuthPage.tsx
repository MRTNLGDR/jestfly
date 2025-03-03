
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import GlassHeader from '@/components/GlassHeader';
import Footer from '@/components/Footer';
import { Eye, EyeOff, LogIn, UserPlus, Mail, Key } from 'lucide-react';

// Esquema de validação do formulário de login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

// Esquema de validação do formulário de registro
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  displayName: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  username: z.string().min(3, 'O nome de usuário deve ter pelo menos 3 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Apenas letras, números e underscores são permitidos'),
  profileType: z.enum(['fan', 'artist', 'collaborator']),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage: React.FC = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from || '/';
  
  // Formulário de login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Formulário de registro
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
      username: '',
      profileType: 'fan',
    },
  });
  
  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);
  
  // Manipulador de envio do formulário de login
  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        console.error('Erro de login:', error);
        toast({
          title: 'Erro ao fazer login',
          description: error.message || 'Verifique suas credenciais e tente novamente.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Login bem-sucedido',
          description: 'Bem-vindo de volta à JESTFLY!',
        });
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Erro de login:', error);
      toast({
        title: 'Erro ao fazer login',
        description: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manipulador de envio do formulário de registro
  const handleRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(data.email, data.password, {
        data: {
          displayName: data.displayName,
          username: data.username,
          profileType: data.profileType,
        },
      });
      
      if (error) {
        console.error('Erro de registro:', error);
        
        // Mensagens de erro específicas
        if (error.message.includes('already registered')) {
          toast({
            title: 'Email já registrado',
            description: 'Este email já está em uso. Tente fazer login ou use outro email.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Erro ao criar conta',
            description: error.message || 'Não foi possível criar sua conta. Tente novamente.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Registro bem-sucedido',
          description: 'Sua conta foi criada com sucesso! Verifique seu email para confirmar o registro.',
        });
        
        // Redirecionar para a página de login após o registro bem-sucedido
        loginForm.setValue('email', data.email);
      }
    } catch (error) {
      console.error('Erro de registro:', error);
      toast({
        title: 'Erro ao criar conta',
        description: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Alternar visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const menuItems = [
    { label: 'Início', href: '/' },
    { label: 'Store', href: '/store' },
    { label: 'Community', href: '/community' },
    { label: 'Bookings', href: '/bookings' },
  ];
  
  return (
    <div className="min-h-screen bg-black text-white">
      <GlassHeader menuItems={menuItems} />
      
      <div className="container mx-auto px-4 py-32 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              JESTFLY
            </h1>
            <p className="text-white/70 mt-2">Entre para a comunidade musical do futuro</p>
          </div>
          
          <Card className="border-white/10 bg-black/40 backdrop-blur-md text-white">
            <Tabs defaultValue="login" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-2 bg-black/20">
                  <TabsTrigger value="login" className="data-[state=active]:bg-purple-600/30">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-blue-600/30">
                    Registrar
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              
              <CardContent>
                <TabsContent value="login">
                  <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-white/50">
                            <Mail size={16} />
                          </div>
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-white/30"
                            {...loginForm.register('email')}
                          />
                        </div>
                        {loginForm.formState.errors.email && (
                          <p className="text-red-400 text-sm">{loginForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Senha</Label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-white/50">
                            <Key size={16} />
                          </div>
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 bg-black/30 border-white/10 text-white placeholder:text-white/30"
                            {...loginForm.register('password')}
                          />
                          <div
                            className="absolute right-3 top-3 text-white/50 cursor-pointer"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </div>
                        </div>
                        {loginForm.formState.errors.password && (
                          <p className="text-red-400 text-sm">{loginForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                            <span>Processando...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <LogIn size={16} />
                            <span>Entrar</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={registerForm.handleSubmit(handleRegister)}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName" className="text-white">Nome Completo</Label>
                        <Input
                          id="displayName"
                          placeholder="Seu nome completo"
                          className="bg-black/30 border-white/10 text-white placeholder:text-white/30"
                          {...registerForm.register('displayName')}
                        />
                        {registerForm.formState.errors.displayName && (
                          <p className="text-red-400 text-sm">{registerForm.formState.errors.displayName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-white">Nome de Usuário</Label>
                        <Input
                          id="username"
                          placeholder="seu_username"
                          className="bg-black/30 border-white/10 text-white placeholder:text-white/30"
                          {...registerForm.register('username')}
                        />
                        {registerForm.formState.errors.username && (
                          <p className="text-red-400 text-sm">{registerForm.formState.errors.username.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          className="bg-black/30 border-white/10 text-white placeholder:text-white/30"
                          {...registerForm.register('email')}
                        />
                        {registerForm.formState.errors.email && (
                          <p className="text-red-400 text-sm">{registerForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Senha</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pr-10 bg-black/30 border-white/10 text-white placeholder:text-white/30"
                            {...registerForm.register('password')}
                          />
                          <div
                            className="absolute right-3 top-3 text-white/50 cursor-pointer"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </div>
                        </div>
                        {registerForm.formState.errors.password && (
                          <p className="text-red-400 text-sm">{registerForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="profileType" className="text-white">Tipo de Perfil</Label>
                        <select
                          id="profileType"
                          className="w-full h-10 px-3 py-2 rounded-md bg-black/30 border border-white/10 text-white"
                          {...registerForm.register('profileType')}
                        >
                          <option value="fan">Fã</option>
                          <option value="artist">Artista</option>
                          <option value="collaborator">Colaborador</option>
                        </select>
                        {registerForm.formState.errors.profileType && (
                          <p className="text-red-400 text-sm">{registerForm.formState.errors.profileType.message}</p>
                        )}
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                            <span>Processando...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <UserPlus size={16} />
                            <span>Criar Conta</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pb-6">
                <div className="text-center w-full">
                  <p className="text-white/50 text-sm">
                    Ao se registrar, você concorda com os nossos <a href="#" className="text-purple-400 hover:underline">Termos de Serviço</a> e <a href="#" className="text-purple-400 hover:underline">Política de Privacidade</a>.
                  </p>
                </div>
              </CardFooter>
            </Tabs>
          </Card>
          
          <div className="mt-8 text-center">
            <p className="text-white/50 text-sm">
              JESTFLY © {new Date().getFullYear()} - A Plataforma Musical do Futuro
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AuthPage;
