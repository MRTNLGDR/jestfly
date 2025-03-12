import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema de validação para o formulário
const loginSchema = z.object({
  email: z.string().email('Por favor, insira um email válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (name: keyof LoginFormData, value: string) => {
    try {
      const result = loginSchema.shape[name].parse(value);
      setErrors(prev => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || `${name} inválido`;
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
        return false;
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name as keyof LoginFormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação completa do formulário
    let isValid = true;
    Object.entries(formData).forEach(([key, value]) => {
      const fieldValid = validateField(key as keyof LoginFormData, value);
      if (!fieldValid) isValid = false;
    });
    
    if (!isValid) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(formData.email, formData.password);
      toast.success('Login realizado com sucesso!');
      navigate('/profile');
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Email ou senha inválidos. Tente novamente.');
      } else if (error.message.includes('Invalid email')) {
        toast.error('Formato de email inválido. Verifique o e-mail e tente novamente.');
      } else if (error.message.includes('Too many requests')) {
        toast.error('Muitas tentativas de login. Tente novamente mais tarde ou recupere sua senha.');
      } else {
        toast.error(error.message || 'Falha ao realizar login');
      }
      console.error('Erro de login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/30 backdrop-blur-md border border-zinc-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">Bem-vindo de volta</CardTitle>
        <CardDescription className="text-center text-zinc-400">
          Faça login para acessar sua conta JESTFLY
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={(e) => validateField('email', e.target.value)}
              required
              className={`bg-zinc-900/60 border-zinc-800 text-white ${errors.email ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <div className="text-red-500 text-xs flex items-center mt-1">
                <AlertCircle size={12} className="mr-1" /> 
                {errors.email}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Senha</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={(e) => validateField('password', e.target.value)}
                required
                className={`bg-zinc-900/60 border-zinc-800 text-white ${errors.password ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300 text-xs"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {errors.password && (
              <div className="text-red-500 text-xs flex items-center mt-1">
                <AlertCircle size={12} className="mr-1" /> 
                {errors.password}
              </div>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full group bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                Autenticando...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Entrar
                <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-zinc-400">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
