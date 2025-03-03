
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const RegisterForm: React.FC = () => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profileType, setProfileType] = useState<'fan' | 'artist' | 'collaborator' | 'admin'>('fan');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !confirmPassword || !username || !displayName) {
      toast.error('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (username.includes(' ')) {
      toast.error('O nome de usuário não pode conter espaços');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, username, displayName, profileType);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Erro no registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Registre-se</CardTitle>
        <CardDescription className="text-white/70">
          Crie sua conta para fazer parte da comunidade JESTFLY
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="seuusuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Nome de exibição</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Seu Nome"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profileType">Tipo de perfil</Label>
            <Select 
              value={profileType} 
              onValueChange={(value) => setProfileType(value as 'fan' | 'artist' | 'collaborator' | 'admin')}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Selecione o tipo de perfil" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/10 text-white">
                <SelectItem value="fan">Fã</SelectItem>
                <SelectItem value="artist">Artista</SelectItem>
                <SelectItem value="collaborator">Colaborador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirme a senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-white/10 pt-4">
        <p className="text-white/70 text-sm">
          Já tem uma conta?{' '}
          <Link to="/auth/login" className="text-purple-400 hover:text-purple-300 transition-colors">
            Faça login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
