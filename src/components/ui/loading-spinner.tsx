
import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  };
  
  return (
    <div 
      className={`animate-spin rounded-full border-t-transparent border-purple-500 border-r-transparent border-b-blue-500 border-l-transparent ${sizeClasses[size]} ${className}`}
      aria-label="Carregando"
    />
  );
};
