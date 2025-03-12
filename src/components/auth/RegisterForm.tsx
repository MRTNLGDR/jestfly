
import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { toast } from 'sonner';
import { RegisterFormData, ProfileType } from './register/types';
import { RegisterFormContent } from './register/RegisterFormContent';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    username: '',
    profileType: 'fan'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileTypeChange = (value: ProfileType) => {
    setFormData(prev => ({ ...prev, profileType: value }));
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
    
    setIsSubmitting(true);
    
    try {
      await register(formData.email, formData.password, {
        displayName: formData.displayName,
        username: formData.username,
        profileType: formData.profileType,
      });
      
      navigate('/profile');
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      
      // Exibir mensagens de erro específicas
      if (error.message.includes('already registered')) {
        toast.error('Este email já está sendo usado por outra conta');
      } else if (error.message.includes('invalid email')) {
        toast.error('Formato de email inválido');
      } else if (error.message.includes('weak password')) {
        toast.error('Senha muito fraca. Use uma senha mais forte');
      } else if (error.message.includes('network error')) {
        toast.error('Erro de conexão. Verifique sua internet e tente novamente');
      } else {
        toast.error(error.message || 'Falha ao criar conta');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/30 backdrop-blur-md border border-zinc-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">Create Account</CardTitle>
        <CardDescription className="text-center text-zinc-400">
          Join the JESTFLY community today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <RegisterFormContent
            formData={formData}
            handleChange={handleChange}
            handleProfileTypeChange={handleProfileTypeChange}
            isSubmitting={isSubmitting}
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
