
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const { error, data } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        toast({
          title: "Erro de autenticação",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        // Verificar se o usuário é realmente um admin
        if (data.profile_type === 'admin') {
          toast({
            title: "Login de administrador bem-sucedido",
            description: `Bem-vindo, ${data.display_name}!`,
            variant: "default",
          });
          navigate('/admin');
        } else {
          toast({
            title: "Acesso negado",
            description: "Esta conta não tem permissões de administrador",
            variant: "destructive",
          });
          // Fazer logout se não for admin
          await signOut();
        }
      }
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Erro no sistema",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDemoAdminLogin = async () => {
    try {
      setError('');
      const demoEmail = 'admin_demo@jestfly.com';
      const demoPassword = 'admin123';
      
      console.log('Tentando login como admin demo');
      const { error, data } = await signIn(demoEmail, demoPassword);
      
      if (error) {
        console.error('Erro no login admin demo:', error);
        setError(error.message || 'Erro ao fazer login como admin demo');
        toast({
          title: "Erro de autenticação",
          description: "Não foi possível fazer login como admin demo",
          variant: "destructive",
        });
      } else if (data) {
        toast({
          title: "Login admin bem-sucedido",
          description: "Você está logado como admin demo",
          variant: "default",
        });
        navigate('/admin');
      }
    } catch (err) {
      console.error('Erro ao fazer login como admin demo:', err);
      setError((err as Error).message || 'Ocorreu um erro durante o login demo');
      toast({
        title: "Erro no sistema",
        description: (err as Error).message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <ShieldIcon className="w-12 h-12 mx-auto mb-2 text-blue-400" />
        <p className="text-white/60 text-sm">Acesso restrito a administradores</p>
      </div>

      <form onSubmit={handleAdminLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email de administrador</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@jestfly.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-black/30 border-white/10 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-black/30 border-white/10 text-white"
          />
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            'Entrar como Admin'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10"></span>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-black px-2 text-white/60">Ou</span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full border-blue-500/30 hover:bg-blue-900/30 text-sm"
        onClick={handleDemoAdminLogin}
        disabled={loading}
      >
        <ShieldIcon className="mr-2 h-4 w-4" />
        Acessar como Admin Demo
      </Button>
    </div>
  );
};

export default AdminLoginForm;
