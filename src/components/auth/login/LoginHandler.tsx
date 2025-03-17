
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginFormData } from '../../../types/auth';
import { toast } from 'sonner';

interface LoginHandlerProps {
  children: (props: {
    formData: LoginFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    isAdminLogin: boolean;
    toggleAdminLogin: () => void;
  }) => React.ReactNode;
}

export const LoginHandler: React.FC<LoginHandlerProps> = ({ children }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAdminLogin = () => {
    setIsAdminLogin(prev => !prev);
    // Reset form data when toggling between admin and regular login
    setFormData({ email: '', password: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate loading
    setTimeout(() => {
      const destination = isAdminLogin ? '/admin' : '/profile';
      const message = isAdminLogin ? 'Login admin realizado' : 'Login realizado com sucesso!';
      
      toast.success(message);
      navigate(destination);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      {children({
        formData,
        handleChange,
        handleSubmit,
        isSubmitting,
        isAdminLogin,
        toggleAdminLogin
      })}
    </>
  );
};
