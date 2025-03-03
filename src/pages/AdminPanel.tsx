
import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarProvider } from '../components/ui/sidebar';
import AdminSidebar from '../components/admin/AdminSidebar';
import ModelEditor from '../components/admin/ModelEditor';
import LightingEditor from '../components/admin/LightingEditor';
import TextureEditor from '../components/admin/TextureEditor';
import ModelGallery from '../components/admin/ModelGallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import GlassHeader from '../components/GlassHeader';
import ModelTab from '../components/admin/ModelTab';
import MaterialTab from '../components/admin/MaterialTab';
import ColorsTab from '../components/admin/ColorsTab';
import FontsTab from '../components/admin/FontsTab';
import { ModelParameters, defaultModelParams } from '../types/model';
import { useToast } from '@/components/ui/use-toast';

const AdminPanel = () => {
  const { toast } = useToast();
  const menuItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Models", href: "/admin/models" },
    { label: "Assets", href: "/admin/assets" },
    { label: "Settings", href: "/admin/settings" }
  ];

  // Model management states
  const [uploadedModels, setUploadedModels] = useState<any[]>([]);
  const [newModelName, setNewModelName] = useState('');
  const [activeModel, setActiveModel] = useState('crystal');

  // Model parameter states
  const [modelParams, setModelParams] = useState<ModelParameters>(() => {
    // Try to get saved parameters from localStorage
    const savedParams = localStorage.getItem("modelParameters");
    return savedParams ? JSON.parse(savedParams) : {
      ...defaultModelParams,
      color: "#ffffff",
      metalness: 0.2,
      roughness: 0.01,
      transmission: 0.98,
      thickness: 0.8,
      envMapIntensity: 5.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      ior: 2.5,
      iridescence: 1.0,
      iridescenceIOR: 2.0,
      transparent: true,
      opacity: 0.8,
      reflectivity: 1.0,
      emissiveIntensity: 0.08,
      emissiveColor: "#8B5CF6",
      lightIntensity: 5.0
    };
  });

  // Color settings
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6');
  const [secondaryColor, setSecondaryColor] = useState('#EC4899');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [accentColor, setAccentColor] = useState('#06B6D4');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<string | null>(null);

  // Font settings
  const [selectedFont, setSelectedFont] = useState('Roboto');

  // Update model parameter
  const updateModelParam = (param: keyof ModelParameters, value: any) => {
    setModelParams(prevParams => {
      const updatedParams = {
        ...prevParams,
        [param]: value
      };
      
      // Save to localStorage
      localStorage.setItem("modelParameters", JSON.stringify(updatedParams));
      
      return updatedParams;
    });
  };

  // Reset model parameters to defaults
  const resetModelParams = () => {
    setModelParams(defaultModelParams);
    localStorage.setItem("modelParameters", JSON.stringify(defaultModelParams));
    
    toast({
      title: "Parâmetros resetados",
      description: "Todos os parâmetros foram restaurados para os valores padrão."
    });
  };

  // Save model settings
  const saveModelSettings = () => {
    localStorage.setItem("modelParameters", JSON.stringify(modelParams));
    
    toast({
      title: "Configurações salvas",
      description: "As configurações do modelo 3D foram salvas com sucesso."
    });
  };

  // Save color settings
  const saveColorSettings = () => {
    const colorScheme = {
      primaryColor,
      secondaryColor,
      backgroundColor,
      accentColor
    };
    
    localStorage.setItem("colorScheme", JSON.stringify(colorScheme));
    
    // Apply colors to CSS variables
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    document.documentElement.style.setProperty('--color-secondary', secondaryColor);
    document.documentElement.style.setProperty('--color-background', backgroundColor);
    document.documentElement.style.setProperty('--color-accent', accentColor);
    
    toast({
      title: "Cores salvas",
      description: "O esquema de cores foi salvo e aplicado ao site."
    });
  };

  // Save font settings
  const saveFontSettings = () => {
    localStorage.setItem("siteFont", selectedFont);
    
    toast({
      title: "Fonte salva",
      description: `A fonte ${selectedFont} foi definida como padrão para o site.`
    });
  };

  // Change active model
  const changeActiveModel = (modelType: string) => {
    setActiveModel(modelType);
    
    localStorage.setItem("activeModel", modelType);
    
    toast({
      title: "Modelo atualizado",
      description: `O modelo ${modelType} foi definido como padrão.`
    });
  };

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
                  <ModelTab 
                    uploadedModels={uploadedModels}
                    setUploadedModels={setUploadedModels}
                    newModelName={newModelName}
                    setNewModelName={setNewModelName}
                    activeModel={activeModel}
                    changeActiveModel={changeActiveModel}
                  />
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
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
