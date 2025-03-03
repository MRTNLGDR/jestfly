
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import FormField from './FormField';
import AlertMessage from './AlertMessage';
import { useRegisterForm } from '@/hooks/auth/useRegisterForm';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const {
    registerData,
    loading,
    error,
    success,
    handleChange,
    handleSelectChange,
    handleSubmit
  } = useRegisterForm(onSuccess);

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
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            required
            value={registerData.email}
            onChange={handleChange}
            disabled={loading}
          />
          
          <FormField
            id="display_name"
            label="Nome de Exibição"
            placeholder="Seu Nome"
            required
            value={registerData.display_name}
            onChange={handleChange}
            disabled={loading}
          />
          
          <FormField
            id="username"
            label="Nome de Usuário"
            placeholder="seu_username"
            required
            value={registerData.username}
            onChange={handleChange}
            disabled={loading}
          />
          
          <div className="space-y-2">
            <Label htmlFor="profile_type" className="text-white">Tipo de Perfil</Label>
            <Select
              value={registerData.profile_type}
              onValueChange={handleSelectChange}
              disabled={loading}
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
          
          <FormField
            id="password"
            label="Senha"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
            value={registerData.password}
            onChange={handleChange}
            disabled={loading}
          />
          
          <FormField
            id="confirmPassword"
            label="Confirmar Senha"
            type="password"
            placeholder="••••••••"
            required
            value={registerData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
          
          {error && (
            <AlertMessage 
              type="error"
              title="Erro"
              message={error}
            />
          )}
          
          {success && (
            <AlertMessage 
              type="success"
              title="Sucesso"
              message={success}
            />
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
