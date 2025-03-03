
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AdminLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Email e senha são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      console.error('Erro ao fazer login como admin:', error);
      toast({
        title: "Erro de autenticação",
        description: error.message || "Credenciais inválidas ou sem permissão de administrador",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    
    try {
      console.log('Tentando login como admin demo');
      // Usamos a credencial do admin que criamos via SQL
      const { error } = await signIn('admin_demo@jestfly.com', 'admin123');
      
      if (error) {
        console.error('Erro ao fazer login como admin demo:', error);
        toast({
          title: "Erro no login demo",
          description: error.message || "Não foi possível fazer login com a conta demo",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Exceção ao fazer login como admin demo:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao tentar fazer login com a conta demo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@jestfly.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black"
            autoComplete="email"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black"
            autoComplete="current-password"
          />
        </div>
        
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar como Admin'
          )}
        </Button>
      </form>
      
      <div className="mt-4">
        <Button 
          type="button" 
          onClick={handleDemoLogin} 
          variant="outline" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Usar conta demo'
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminLoginForm;
