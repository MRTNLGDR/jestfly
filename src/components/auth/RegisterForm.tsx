
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { CheckCircle, Mail, User, Lock, AtSign, Shield } from 'lucide-react';

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

    if (formData.profileType === 'admin' && formData.adminCode !== 'JESTFLY2024') {
      toast.error('Código de administrador inválido');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(formData.email, formData.password, {
        displayName: formData.displayName,
        username: formData.username,
        profileType: formData.profileType,
      });
      
      toast.success('Conta criada com sucesso!', {
        duration: 5000,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
      navigate('/profile');
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Falha ao criar conta';
      
      if (error.message.includes('email-already-in-use')) {
        errorMessage = 'Este email já está em uso';
      } else if (error.message.includes('invalid-email')) {
        errorMessage = 'Email inválido';
      } else if (error.message.includes('weak-password')) {
        errorMessage = 'Senha muito fraca';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      toast.success('Conta criada com sucesso!', {
        duration: 5000,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
      navigate('/profile');
    } catch (error: any) {
      console.error('Google registration error:', error);
      toast.error(error.message || 'Falha ao registrar com Google');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-md border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">Criar Conta</CardTitle>
        <CardDescription className="text-center text-zinc-400">
          Junte-se à comunidade JESTFLY hoje
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-purple-500" />
              <label className="text-sm font-medium text-zinc-300">Email</label>
            </div>
            <div className="relative">
              <Input
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-zinc-900/60 border-zinc-800 text-white pl-3 focus-visible:ring-purple-500/50"
              />
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-500/80 to-blue-500/80 rounded-l-md"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-purple-500" />
              <label className="text-sm font-medium text-zinc-300">Nome de Exibição</label>
            </div>
            <div className="relative">
              <Input
                type="text"
                name="displayName"
                placeholder="Seu Nome"
                value={formData.displayName}
                onChange={handleChange}
                required
                className="bg-zinc-900/60 border-zinc-800 text-white pl-3 focus-visible:ring-purple-500/50"
              />
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-500/80 to-blue-500/80 rounded-l-md"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <AtSign className="w-4 h-4 mr-2 text-purple-500" />
              <label className="text-sm font-medium text-zinc-300">Nome de Usuário</label>
            </div>
            <div className="relative">
              <Input
                type="text"
                name="username"
                placeholder="usuario"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-zinc-900/60 border-zinc-800 text-white pl-3 focus-visible:ring-purple-500/50"
              />
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-500/80 to-blue-500/80 rounded-l-md"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2 text-purple-500" />
              <label className="text-sm font-medium text-zinc-300">Senha</label>
            </div>
            <div className="relative">
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-zinc-900/60 border-zinc-800 text-white pl-3 focus-visible:ring-purple-500/50"
              />
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-500/80 to-blue-500/80 rounded-l-md"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2 text-purple-500" />
              <label className="text-sm font-medium text-zinc-300">Confirmar Senha</label>
            </div>
            <div className="relative">
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-zinc-900/60 border-zinc-800 text-white pl-3 focus-visible:ring-purple-500/50"
              />
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-500/80 to-blue-500/80 rounded-l-md"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center mb-2">
              <Shield className="w-4 h-4 mr-2 text-purple-500" />
              <label className="text-sm font-medium text-zinc-300">Tipo de Conta</label>
            </div>
            <RadioGroup 
              value={formData.profileType} 
              onValueChange={(value: any) => handleProfileTypeChange(value)}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2 bg-zinc-900/40 border border-zinc-800 p-2 rounded-md">
                <RadioGroupItem value="fan" id="fan" className="border-zinc-600" />
                <Label htmlFor="fan" className="text-zinc-300">Fã</Label>
              </div>
              <div className="flex items-center space-x-2 bg-zinc-900/40 border border-zinc-800 p-2 rounded-md">
                <RadioGroupItem value="artist" id="artist" className="border-zinc-600" />
                <Label htmlFor="artist" className="text-zinc-300">Artista</Label>
              </div>
              <div className="flex items-center space-x-2 bg-zinc-900/40 border border-zinc-800 p-2 rounded-md">
                <RadioGroupItem value="collaborator" id="collaborator" className="border-zinc-600" />
                <Label htmlFor="collaborator" className="text-zinc-300">Profissional</Label>
              </div>
              <div className="flex items-center space-x-2 bg-zinc-900/40 border border-zinc-800 p-2 rounded-md">
                <RadioGroupItem value="admin" id="admin" className="border-zinc-600" />
                <Label htmlFor="admin" className="text-zinc-300">Admin</Label>
              </div>
            </RadioGroup>
          </div>
          
          {showAdminField && (
            <div className="space-y-2">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-purple-500" />
                <label className="text-sm font-medium text-zinc-300">Código de Administrador</label>
              </div>
              <div className="relative">
                <Input
                  type="password"
                  name="adminCode"
                  placeholder="Insira o código de administrador"
                  value={formData.adminCode}
                  onChange={handleChange}
                  required
                  className="bg-zinc-900/60 border-zinc-800 text-white pl-3 focus-visible:ring-purple-500/50"
                />
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-500/80 to-blue-500/80 rounded-l-md"></div>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 group"
          >
            {isSubmitting ? 'Criando Conta...' : 'Cadastrar'}
          </Button>
        </form>
        
        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black/50 px-2 text-zinc-400">Ou continue com</span>
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
      <CardFooter className="flex justify-center border-t border-zinc-800 pt-6">
        <p className="text-sm text-zinc-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 hover:underline">
            Entrar
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
