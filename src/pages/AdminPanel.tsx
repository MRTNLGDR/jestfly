
import React from 'react';
import { Sidebar, SidebarContent, SidebarProvider } from '../components/ui/sidebar';
import AdminSidebar from '../components/admin/AdminSidebar';
import ModelEditor from '../components/admin/ModelEditor';
import LightingEditor from '../components/admin/LightingEditor';
import TextureEditor from '../components/admin/TextureEditor';
import ModelGallery from '../components/admin/ModelGallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import GlassHeader from '../components/GlassHeader';
import JestCoinManager from '../components/admin/JestCoinManager';
import RaffleManager from '../components/admin/RaffleManager';

const AdminPanel = () => {
  const menuItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Models", href: "/admin/models" },
    { label: "Assets", href: "/admin/assets" },
    { label: "JestCoins", href: "/admin/jestcoins" },
    { label: "Raffles", href: "/admin/raffles" },
    { label: "Settings", href: "/admin/settings" }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-gray-900 to-black">
        <GlassHeader menuItems={menuItems} />
        <div className="flex flex-1 pt-16">
          <AdminSidebar />
          <main className="flex-1 p-4 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-white mt-6 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Painel de Administração
              </h1>
              <Separator className="mb-6 bg-white/10" />
              
              <Tabs defaultValue="model-editor" className="w-full">
                <div className="neo-blur p-3 rounded-lg mb-4">
                  <TabsList className="grid grid-cols-6 gap-2 w-full">
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
                    <TabsTrigger value="jestcoins" className="data-[state=active]:bg-purple-600">
                      JestCoins
                    </TabsTrigger>
                    <TabsTrigger value="raffles" className="data-[state=active]:bg-purple-600">
                      Sorteios
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

                <TabsContent value="jestcoins">
                  <JestCoinManager />
                </TabsContent>
                
                <TabsContent value="raffles">
                  <RaffleManager />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
