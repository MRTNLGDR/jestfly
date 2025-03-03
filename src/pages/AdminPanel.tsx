
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
import { ModelParameters } from '@/types/model';

const AdminPanel: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('model');
  
  // Estados para diferentes tabs
  const [primaryColor, setPrimaryColor] = useState('#5D3FD3');
  const [secondaryColor, setSecondaryColor] = useState('#4ade80');
  const [accentColor, setAccentColor] = useState('#9b87f5');
  const [backgroundColorStart, setBackgroundColorStart] = useState('#0d0d15');
  const [backgroundColorEnd, setBackgroundColorEnd] = useState('#1A1F2C');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [mutedTextColor, setMutedTextColor] = useState('#AAAAAA');
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [titleText, setTitleText] = useState('JESTFLY');
  const [subtitleText, setSubtitleText] = useState('Descubra efeitos de vidro hiper-realista');
  
  // Estado para modelo 3D
  const [uploadedModels, setUploadedModels] = useState([]);
  const [newModelName, setNewModelName] = useState('');
  const [activeModel, setActiveModel] = useState(null);
  
  // Estado para parâmetros do modelo
  const [modelParams, setModelParams] = useState<ModelParameters>({
    color: '#5D3FD3',
    roughness: 0.2,
    metalness: 0.8,
    envMapIntensity: 1.0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    transmission: 0.6,
    ior: 1.5,
    thickness: 0.5,
    reflectivity: 0.5,
    iridescence: 0.3,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 400],
    sheen: 0.0,
    sheenRoughness: 0.0,
    sheenColor: '#ffffff',
    specularIntensity: 1.0,
    specularColor: '#ffffff',
    rotation: [0, 0, 0],
    position: [0, 0, 0],
    scale: [1, 1, 1],
    segments: 32,
    lightIntensity: 1.0,
    opacity: 1.0,
    transparent: true,
    textureMap: null,
    normalMap: null,
    roughnessMap: null,
    metalnessMap: null,
    emissiveMap: null,
    emissiveColor: '#000000',
    emissiveIntensity: 0,
    envMap: null,
    wireframe: false
  });
  
  // Funções auxiliares
  const updateModelParam = (param: keyof ModelParameters, value: any) => {
    setModelParams(prev => ({ ...prev, [param]: value }));
  };
  
  const resetModelParams = () => {
    setModelParams({
      color: '#5D3FD3',
      roughness: 0.2,
      metalness: 0.8,
      envMapIntensity: 1.0,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      transmission: 0.6,
      ior: 1.5,
      thickness: 0.5,
      reflectivity: 0.5,
      iridescence: 0.3,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 400],
      sheen: 0.0,
      sheenRoughness: 0.0,
      sheenColor: '#ffffff',
      specularIntensity: 1.0,
      specularColor: '#ffffff',
      rotation: [0, 0, 0],
      position: [0, 0, 0],
      scale: [1, 1, 1],
      segments: 32,
      lightIntensity: 1.0,
      opacity: 1.0,
      transparent: true,
      textureMap: null,
      normalMap: null,
      roughnessMap: null,
      metalnessMap: null,
      emissiveMap: null,
      emissiveColor: '#000000',
      emissiveIntensity: 0,
      envMap: null,
      wireframe: false
    });
  };
  
  const saveModelSettings = () => {
    console.log('Configurações do modelo salvas:', modelParams);
    // Adicionar lógica para salvar no banco de dados
  };
  
  const saveColorScheme = () => {
    console.log('Esquema de cores salvo');
    // Adicionar lógica para salvar no banco de dados
  };
  
  const saveFontSettings = () => {
    console.log('Configurações de fonte salvas');
    // Adicionar lógica para salvar no banco de dados
  };
  
  const changeActiveModel = (model: any) => {
    setActiveModel(model);
  };

  // Redirecionar se o usuário não for administrador
  if (!user || !profile || profile.profile_type !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
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
            <ModelTab 
              uploadedModels={uploadedModels}
              setUploadedModels={setUploadedModels}
              newModelName={newModelName}
              setNewModelName={setNewModelName}
              activeModel={activeModel}
              setActiveModel={setActiveModel}
            />
          </TabsContent>
          
          <TabsContent value="material" className="mt-4">
            <MaterialTab 
              modelParams={modelParams}
              updateModelParam={updateModelParam}
              resetModelParams={resetModelParams}
              saveModelSettings={saveModelSettings}
              activeModel={activeModel}
              setActiveModel={setActiveModel}
            />
          </TabsContent>
          
          <TabsContent value="colors" className="mt-4">
            <ColorsTab 
              primaryColor={primaryColor}
              setPrimaryColor={setPrimaryColor}
              secondaryColor={secondaryColor}
              setSecondaryColor={setSecondaryColor}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
              backgroundColorStart={backgroundColorStart}
              setBackgroundColorStart={setBackgroundColorStart}
              backgroundColorEnd={backgroundColorEnd}
              setBackgroundColorEnd={setBackgroundColorEnd}
              textColor={textColor}
              setTextColor={setTextColor}
              mutedTextColor={mutedTextColor}
              setMutedTextColor={setMutedTextColor}
              saveColorScheme={saveColorScheme}
            />
          </TabsContent>
          
          <TabsContent value="fonts" className="mt-4">
            <FontsTab 
              selectedFont={selectedFont}
              setSelectedFont={setSelectedFont}
              saveFontSettings={saveFontSettings}
            />
          </TabsContent>
          
          <TabsContent value="elements" className="mt-4">
            <ElementsTab 
              titleText={titleText}
              setTitleText={setTitleText}
              subtitleText={subtitleText}
              setSubtitleText={setSubtitleText}
            />
          </TabsContent>
          
          <TabsContent value="layout" className="mt-4">
            <LayoutTab 
              titleText={titleText}
              subtitleText={subtitleText}
              modelParams={modelParams}
            />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4">
            <SettingsTab />
          </TabsContent>
          
          <TabsContent value="sketchfab" className="mt-4">
            <SketchfabTab 
              changeActiveModel={changeActiveModel}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
