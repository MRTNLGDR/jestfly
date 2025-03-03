
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, InfoIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    display_name: '',
    username: '',
    profile_type: 'fan' as 'fan' | 'artist' | 'collaborator' | 'admin'
  });
  
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
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }
    
    if (registerData.profile_type === 'admin') {
      setError('Não é permitido criar contas de administrador');
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
        
        setRegisterData({
          email: '',
          password: '',
          confirmPassword: '',
          display_name: '',
          username: '',
          profile_type: 'fan'
        });
        
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Exceção no registro:', error);
      setError((error as Error).message || 'Ocorreu um erro durante o registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-xl text-white">Cadastro</CardTitle>
        <CardDescription className="text-white/60">
          Crie sua conta para fazer parte da comunidade JESTFLY
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-email" className="text-white">Email</Label>
            <Input
              id="register-email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={registerData.email}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              className="bg-black/30 border-white/20 text-white"
            />
          </div>
          
          {error && (
            <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-900/30 border-green-700 text-green-300">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Sucesso</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
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
  );
};

export default RegisterForm;
