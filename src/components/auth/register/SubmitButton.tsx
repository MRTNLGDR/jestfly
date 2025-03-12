
import React from 'react';
import { Button } from "../../ui/button";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <Button 
      type="submit" 
      disabled={isSubmitting} 
      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
    >
      {isSubmitting ? 'Creating Account...' : 'Sign Up'}
    </Button>
  );
};
