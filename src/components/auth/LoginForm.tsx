
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLoginForm } from '@/hooks/auth/useLoginForm';
import FormField from '@/components/auth/FormField';
import AlertMessage from '@/components/auth/AlertMessage';
import DemoLoginButtons from '@/components/auth/DemoLoginButtons';

const LoginForm: React.FC = () => {
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    error, 
    loading, 
    handleLogin, 
    handleDemoLogin 
  } = useLoginForm();

  return (
    <Card className="w-full bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-xl text-white">Login</CardTitle>
        <CardDescription className="text-white/60">
          Faça login na sua conta JESTFLY
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <FormField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
            className="pl-9"
          />
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <FormField
                id="password"
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="pl-9"
              />
              <Link 
                to="/reset-password" 
                className="text-xs text-purple-400 hover:text-purple-300 hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </div>
          
          {error && (
            <AlertMessage 
              type="error" 
              title="Erro" 
              message={error} 
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
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        <DemoLoginButtons 
          onFanLogin={() => handleDemoLogin('fan')}
          onArtistLogin={() => handleDemoLogin('artist')}
          onCollaboratorLogin={() => handleDemoLogin('collaborator')}
          onAdminLogin={() => handleDemoLogin('admin')}
          disabled={loading}
        />
      </CardContent>
      
      <CardFooter className="flex justify-center border-t border-white/10 pt-4">
        <p className="text-white/60 text-sm">
          Não tem uma conta?{' '}
          <Link to="/auth?tab=register" className="text-purple-400 hover:text-purple-300 hover:underline">
            Registre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
