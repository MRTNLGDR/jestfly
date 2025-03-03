
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/auth/useAuth';
import { Loader2 } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    username: '',
    profileType: 'fan' as 'fan' | 'artist' | 'collaborator' | 'admin',
    adminCode: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminField, setShowAdminField] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileTypeChange = (value: 'fan' | 'artist' | 'collaborator' | 'admin') => {
    setFormData(prev => ({ ...prev, profileType: value }));
    setShowAdminField(value === 'admin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (formData.profileType === 'admin' && !formData.adminCode) {
      toast.error('Código de administrador é obrigatório para contas do tipo Admin');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const loadingToast = toast.loading('Criando conta...');
      
      await register(formData.email, formData.password, {
        displayName: formData.displayName,
        username: formData.username,
        profileType: formData.profileType,
        adminCode: formData.adminCode
      });
      
      toast.dismiss(loadingToast);
      toast.success('Conta criada! Verifique seu email para confirmar o cadastro.');
      
      // Redirecionar para a página de login após o registro bem-sucedido
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    try {
      const loadingToast = toast.loading('Conectando com Google...');
      await loginWithGoogle();
      toast.dismiss(loadingToast);
      toast.success('Login com Google iniciado!');
      // O usuário será redirecionado automaticamente pelo fluxo OAuth do Supabase
    } catch (error: any) {
      console.error('Google register error:', error);
      let errorMessage = 'Falha ao registrar com Google';
      
      if (error.message.includes('provider is not enabled')) {
        errorMessage = 'Login com Google não está habilitado. Entre em contato com o administrador.';
      } 
      
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-morphism">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">Criar Conta</CardTitle>
        <CardDescription className="text-center text-zinc-400">
          Junte-se à comunidade JESTFLY hoje
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Nome de Exibição</label>
            <Input
              type="text"
              name="displayName"
              placeholder="Seu Nome"
              value={formData.displayName}
              onChange={handleChange}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Nome de Usuário</label>
            <Input
              type="text"
              name="username"
              placeholder="usuario"
              value={formData.username}
              onChange={handleChange}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Senha</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Confirmar Senha</label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="bg-zinc-900/60 border-zinc-800 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Tipo de Conta</label>
            <RadioGroup 
              value={formData.profileType} 
              onValueChange={(value: any) => handleProfileTypeChange(value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fan" id="fan" className="border-zinc-600" />
                <Label htmlFor="fan" className="text-zinc-300">Fã</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="artist" id="artist" className="border-zinc-600" />
                <Label htmlFor="artist" className="text-zinc-300">Artista</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="collaborator" id="collaborator" className="border-zinc-600" />
                <Label htmlFor="collaborator" className="text-zinc-300">Profissional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" className="border-zinc-600" />
                <Label htmlFor="admin" className="text-zinc-300">Admin</Label>
              </div>
            </RadioGroup>
          </div>
          
          {showAdminField && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Código de Admin</label>
              <Input
                type="text"
                name="adminCode"
                placeholder="Código de administrador"
                value={formData.adminCode}
                onChange={handleChange}
                required
                className="bg-zinc-900/60 border-zinc-800 text-white"
              />
              <p className="text-xs text-zinc-500 italic">
                Para contas de administrador, é necessário um código de autorização.
              </p>
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                Criando Conta <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </span>
            ) : 'Cadastrar'}
          </Button>
        </form>
        
        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black/30 px-2 text-zinc-400">Ou continue com</span>
          </div>
        </div>
        
        <Button 
          onClick={handleGoogleRegister} 
          disabled={isSubmitting}
          variant="outline" 
          className="w-full mt-4 text-white bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80"
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-zinc-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
