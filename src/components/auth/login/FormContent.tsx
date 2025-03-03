
import React from 'react';
import { Card, CardContent } from "../../ui/card";
import { LoginHandler } from './LoginHandler';
import { useGoogleAuth } from './GoogleLoginHandler';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import { LoginFooter } from './LoginFooter';
import { SocialLoginOptions } from './SocialLoginOptions';

export const FormContent: React.FC = () => {
  const { isGoogleEnabled, isSubmitting: isGoogleSubmitting, handleGoogleLogin } = useGoogleAuth();

  return (
    <LoginHandler>
      {({ formData, handleChange, handleSubmit, isSubmitting, isAdminLogin, toggleAdminLogin }) => {
        const cardClassName = `w-full max-w-md mx-auto glass-morphism ${isAdminLogin ? 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : ''}`;
        
        return (
          <Card className={cardClassName}>
            <LoginHeader isAdminLogin={isAdminLogin} toggleAdminLogin={toggleAdminLogin} />
            
            <CardContent>
              <LoginForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isAdminLogin={isAdminLogin}
              />
              
              {!isAdminLogin && (
                <SocialLoginOptions
                  onGoogleLogin={handleGoogleLogin}
                  isSubmitting={isSubmitting || isGoogleSubmitting}
                  isGoogleEnabled={isGoogleEnabled}
                />
              )}
            </CardContent>
            
            <LoginFooter />
          </Card>
        );
      }}
    </LoginHandler>
  );
};
