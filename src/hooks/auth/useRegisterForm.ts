
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validateRegistrationForm } from '@/utils/validation';

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  display_name: string;
  username: string;
  profile_type: 'fan' | 'artist' | 'collaborator' | 'admin';
}

export const initialRegisterData: RegisterFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  display_name: '',
  username: '',
  profile_type: 'fan',
};

export const useRegisterForm = (onSuccess?: () => void) => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [registerData, setRegisterData] = useState<RegisterFormData>(initialRegisterData);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setRegisterData((prev) => ({ 
      ...prev, 
      profile_type: value as 'fan' | 'artist' | 'collaborator' | 'admin' 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    const validationError = validateRegistrationForm(registerData);
    if (validationError) {
      setError(validationError);
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
        setError(error.message);
      } else {
        setSuccess('Conta criada com sucesso! Verifique seu email para confirmar o cadastro.');
        
        setRegisterData(initialRegisterData);
        
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Exceção no registro:', error);
      setError((error as Error).message || 'Ocorreu um erro durante o registro');
    } finally {
      setLoading(false);
    }
  };

  return {
    registerData,
    loading,
    error,
    success,
    handleChange,
    handleSelectChange,
    handleSubmit,
    setError,
    setSuccess
  };
};
