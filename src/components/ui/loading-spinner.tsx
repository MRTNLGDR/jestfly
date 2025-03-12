
import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  className = "" 
}) => {  
  return (
    <div 
      className={`${className} text-center`}
      aria-label="Carregando"
    >
      Carregando...
    </div>
  );
};
