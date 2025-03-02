
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import { RegisterFormContent } from './RegisterFormContent';
import { RegisterFormData } from './types';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    username: '',
    profileType: 'fan',
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
    <Card className="w-full max-w-md mx-auto bg-black/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(100,100,255,0.05)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">Criar Conta</CardTitle>
        <CardDescription className="text-center text-zinc-400">
          Junte-se à nossa comunidade hoje
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterFormContent
          formData={formData}
          handleChange={handleChange}
          handleProfileTypeChange={handleProfileTypeChange}
          handleSubmit={handleSubmit}
          handleGoogleRegister={handleGoogleRegister}
          isSubmitting={isSubmitting}
          showAdminField={showAdminField}
        />
      </CardContent>
      <CardFooter className="flex justify-center border-t border-zinc-800/30 pt-6">
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
