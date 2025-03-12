
import React from 'react';
import { Button } from "../../ui/button";
import { CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { ShieldAlert } from 'lucide-react';

interface LoginHeaderProps {
  isAdminLogin: boolean;
  toggleAdminLogin: () => void;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ isAdminLogin, toggleAdminLogin }) => {
  return (
    <CardHeader className="space-y-1">
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold text-white">
          {isAdminLogin ? 'Admin Login' : 'Login'}
        </CardTitle>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleAdminLogin}
          className={`rounded-full p-2 ${isAdminLogin ? 'text-red-400 hover:text-red-300' : 'text-zinc-400 hover:text-zinc-300'}`}
        >
          <ShieldAlert className="h-5 w-5" />
        </Button>
      </div>
      <CardDescription className="text-zinc-400">
        {isAdminLogin ? 'Acesso administrativo restrito' : 'Entre com suas credenciais para acessar'}
      </CardDescription>
    </CardHeader>
  );
};
