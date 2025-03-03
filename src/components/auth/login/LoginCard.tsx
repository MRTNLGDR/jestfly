
import React from 'react';
import { Card } from "../../ui/card";
import { LoginFormData } from './types';

interface LoginCardProps {
  children: React.ReactNode;
  isAdminLogin: boolean;
}

export const LoginCard: React.FC<LoginCardProps> = ({ 
  children, 
  isAdminLogin 
}) => {
  const cardClassName = `w-full max-w-md mx-auto glass-morphism ${
    isAdminLogin ? 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : ''
  }`;
  
  return (
    <Card className={cardClassName}>
      {children}
    </Card>
  );
};
