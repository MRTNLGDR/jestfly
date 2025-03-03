
import React from 'react';
import { AlertCircle, Calendar, MessageSquare, Users } from 'lucide-react';

interface CategoryIconProps {
  category: string;
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = "h-5 w-5" }) => {
  switch (category) {
    case 'announcement':
      return <AlertCircle className={`${className} text-yellow-500`} />;
    case 'event':
      return <Calendar className={`${className} text-purple-500`} />;
    case 'discussion':
      return <MessageSquare className={`${className} text-blue-500`} />;
    case 'collaboration':
      return <Users className={`${className} text-green-500`} />;
    case 'question':
      return <AlertCircle className={`${className} text-red-500`} />;
    default:
      return <MessageSquare className={className} />;
  }
};

export const formatCategoryName = (category: string): string => {
  switch (category) {
    case 'announcement':
      return 'Anúncio';
    case 'event':
      return 'Evento';
    case 'discussion':
      return 'Discussão';
    case 'collaboration':
      return 'Colaboração';
    case 'question':
      return 'Pergunta';
    default:
      return category;
  }
};

export default CategoryIcon;
