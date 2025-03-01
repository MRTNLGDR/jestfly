
import React from 'react';
import { Sidebar, SidebarContent, SidebarProvider } from '../components/ui/sidebar';
import AdminSidebar from '../components/admin/AdminSidebar';
import ModelEditor from '../components/admin/ModelEditor';
import LightingEditor from '../components/admin/LightingEditor';
import TextureEditor from '../components/admin/TextureEditor';
import ModelGallery from '../components/admin/ModelGallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';

const AdminPanel = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 to-black">
        <AdminSidebar />
        <main className="flex-1 p-4 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">
              Painel de Administração
            </h1>
            <Separator className="mb-6 bg-white/10" />
            
            <Tabs defaultValue="model-editor" className="w-full">
              <div className="glass-morphism p-3 rounded-lg mb-4">
                <TabsList className="grid grid-cols-4 gap-2 w-full">
                  <TabsTrigger value="model-editor" className="data-[state=active]:bg-purple-600">
                    Editor de Modelo
                  </TabsTrigger>
                  <TabsTrigger value="lighting" className="data-[state=active]:bg-purple-600">
                    Iluminação
                  </TabsTrigger>
                  <TabsTrigger value="textures" className="data-[state=active]:bg-purple-600">
                    Texturas
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="data-[state=active]:bg-purple-600">
                    Galeria
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="model-editor">
                <ModelEditor />
              </TabsContent>
              
              <TabsContent value="lighting">
                <LightingEditor />
              </TabsContent>
              
              <TabsContent value="textures">
                <TextureEditor />
              </TabsContent>
              
              <TabsContent value="gallery">
                <ModelGallery />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
