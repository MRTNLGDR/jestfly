
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Switch } from "../../ui/switch";
import { Shield } from 'lucide-react';

interface LoginHeaderProps {
  isAdminLogin: boolean;
  toggleAdminLogin: () => void;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  isAdminLogin,
  toggleAdminLogin
}) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between mb-2">
        <CardTitle className={`text-2xl font-bold ${isAdminLogin ? 'text-red-400' : 'text-white'}`}>
          {isAdminLogin ? 'Admin Login' : 'Bem-vindo de volta'}
        </CardTitle>
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={isAdminLogin}
            onCheckedChange={toggleAdminLogin}
            className={isAdminLogin ? "data-[state=checked]:bg-red-500" : ""}
          />
          <Shield 
            size={16} 
            className={isAdminLogin ? "text-red-400" : "text-zinc-500"} 
          />
        </div>
      </div>
      
      <CardDescription className="text-zinc-400">
        {isAdminLogin 
          ? 'Acesso restrito para administradores' 
          : 'Faça login para acessar sua conta JESTFLY'}
      </CardDescription>
    </CardHeader>
  );
};
