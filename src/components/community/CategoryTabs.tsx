
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <Tabs 
      defaultValue="all" 
      value={activeCategory} 
      onValueChange={onCategoryChange} 
      className="mb-8"
    >
      <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-black/40 backdrop-blur-md">
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="announcement">Anúncios</TabsTrigger>
        <TabsTrigger value="event">Eventos</TabsTrigger>
        <TabsTrigger value="discussion">Discussões</TabsTrigger>
        <TabsTrigger value="collaboration">Colaborações</TabsTrigger>
        <TabsTrigger value="question">Perguntas</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;
