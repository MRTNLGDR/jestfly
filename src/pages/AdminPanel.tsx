
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ColorsTab from '@/components/admin/ColorsTab';
import FontsTab from '@/components/admin/FontsTab';
import ElementsTab from '@/components/admin/ElementsTab';
import ModelTab from '@/components/admin/ModelTab';
import LayoutTab from '@/components/admin/LayoutTab';
import SettingsTab from '@/components/admin/SettingsTab';
import SketchfabTab from '@/components/admin/SketchfabTab';
import MaterialTab from '@/components/admin/MaterialTab';

// Corrigido para não passar menuItems como prop
const AdminPanel: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('model');

  // Redirecionar se o usuário não for administrador
  if (!user || !profile || profile.profile_type !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Passando AdminSidebar sem props inválidas */}
      <AdminSidebar />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Painel de Administração</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 md:grid-cols-8 bg-black border border-white/10 rounded-lg">
            <TabsTrigger value="model">Modelo</TabsTrigger>
            <TabsTrigger value="material">Material</TabsTrigger>
            <TabsTrigger value="colors">Cores</TabsTrigger>
            <TabsTrigger value="fonts">Fontes</TabsTrigger>
            <TabsTrigger value="elements">Elementos</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="sketchfab">Sketchfab</TabsTrigger>
          </TabsList>
          
          <TabsContent value="model" className="mt-4">
            <ModelTab />
          </TabsContent>
          
          <TabsContent value="material" className="mt-4">
            <MaterialTab />
          </TabsContent>
          
          <TabsContent value="colors" className="mt-4">
            <ColorsTab />
          </TabsContent>
          
          <TabsContent value="fonts" className="mt-4">
            <FontsTab />
          </TabsContent>
          
          <TabsContent value="elements" className="mt-4">
            <ElementsTab />
          </TabsContent>
          
          <TabsContent value="layout" className="mt-4">
            <LayoutTab />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4">
            <SettingsTab />
          </TabsContent>
          
          <TabsContent value="sketchfab" className="mt-4">
            <SketchfabTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
