
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, InfoIcon } from 'lucide-react';

interface AlertMessageProps {
  type: 'error' | 'success';
  title: string;
  message: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, title, message }) => {
  if (!message) return null;
  
  if (type === 'error') {
    return (
      <Alert variant="destructive" className="bg-red-900/30 border-red-700 text-red-300">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="bg-green-900/30 border-green-700 text-green-300">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default AlertMessage;
