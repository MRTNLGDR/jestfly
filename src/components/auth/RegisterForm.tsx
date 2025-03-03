
import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { toast } from 'sonner';
import { RegisterFormData, ProfileType } from './register/types';
import { RegisterFormContent } from './register/RegisterFormContent';
import { SocialLoginOptions } from './register/SocialLoginOptions';

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
  const { register, loginWithGoogle } = useAuth();
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
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
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
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.message || 'Failed to register with Google');
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
        
        <SocialLoginOptions 
          onGoogleLogin={handleGoogleRegister}
          isSubmitting={isSubmitting}
        />
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
