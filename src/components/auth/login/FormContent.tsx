
import React from 'react';
import { CardContent } from "../../ui/card";
import { LoginHandler } from './LoginHandler';
import { useGoogleAuth } from './GoogleLoginHandler';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import { LoginFooter } from './LoginFooter';
import { SocialLoginOptions } from './SocialLoginOptions';
import { LoginCard } from './LoginCard';

export const FormContent: React.FC = () => {
  const { isGoogleEnabled, isSubmitting: isGoogleSubmitting, handleGoogleLogin } = useGoogleAuth();

  return (
    <LoginHandler>
      {({ formData, handleChange, handleSubmit, isSubmitting, isAdminLogin, toggleAdminLogin }) => (
        <LoginCard isAdminLogin={isAdminLogin}>
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
        </LoginCard>
      )}
    </LoginHandler>
  );
};
