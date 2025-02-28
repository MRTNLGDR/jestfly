
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Settings,
  FileAxis3d,
  Palette,
  Droplet,
  ArrowLeft,
  LayoutDashboard,
  Box,
  Type,
  Image,
  Layers,
  Monitor,
  Eye,
  CubeIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { ModelParameters, defaultModelParams } from "@/types/model";
import ModelTab from "@/components/admin/ModelTab";
import MaterialTab from "@/components/admin/MaterialTab";
import ColorsTab from "@/components/admin/ColorsTab";
import SettingsTab from "@/components/admin/SettingsTab";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import ElementsTab from "@/components/admin/ElementsTab";
import LayoutTab from "@/components/admin/LayoutTab";
import SketchfabTab from "@/components/admin/SketchfabTab";

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [primaryColor, setPrimaryColor] = useState(() => {
    const savedColors = localStorage.getItem("siteColors");
    return savedColors ? JSON.parse(savedColors).primaryColor : "#9b87f5";
  });
  const [secondaryColor, setSecondaryColor] = useState(() => {
    const savedColors = localStorage.getItem("siteColors");
    return savedColors ? JSON.parse(savedColors).secondaryColor : "#6E59A5";
  });
  const [backgroundColor, setBackgroundColor] = useState(() => {
    const savedColors = localStorage.getItem("siteColors");
    return savedColors ? JSON.parse(savedColors).backgroundColor : "#1A1F2C";
  });
  const [accentColor, setAccentColor] = useState(() => {
    const savedColors = localStorage.getItem("siteColors");
    return savedColors ? JSON.parse(savedColors).accentColor : "#D6BCFA";
  });
  const [uploadedModels, setUploadedModels] = useState<{ name: string; file: File; preview?: string }[]>([]);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<string | null>(null);
  const [newModelName, setNewModelName] = useState("");
  const [activeModel, setActiveModel] = useState(() => {
    return localStorage.getItem("preferredModel") || "diamond";
  });
  const [sketchfabUrl, setSketchfabUrl] = useState(() => {
    return localStorage.getItem("sketchfabUrl") || "";
  });
  
  // Estados para os parâmetros do modelo
  const [modelParams, setModelParams] = useState<ModelParameters>(() => {
    const savedParams = localStorage.getItem("modelParameters");
    return savedParams ? JSON.parse(savedParams) : defaultModelParams;
  });

  // Estados para elementos da UI
  const [titleText, setTitleText] = useState(() => {
    return localStorage.getItem("siteTitle") || "MKSHA";
  });
  
  const [subtitleText, setSubtitleText] = useState(() => {
    return localStorage.getItem("siteSubtitle") || "It was the year 2076. The substance had arrived.";
  });

  // Salvar a preferência de modelo no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("preferredModel", activeModel);
  }, [activeModel]);
  
  // Salvar a URL do Sketchfab quando mudar
  useEffect(() => {
    if (sketchfabUrl) {
      localStorage.setItem("sketchfabUrl", sketchfabUrl);
    }
  }, [sketchfabUrl]);
  
  // Salvar parâmetros do modelo no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem("modelParameters", JSON.stringify(modelParams));
  }, [modelParams]);

  // Salvar textos
  useEffect(() => {
    localStorage.setItem("siteTitle", titleText);
    localStorage.setItem("siteSubtitle", subtitleText);
  }, [titleText, subtitleText]);

  // Função para salvar as configurações de cores
  const saveColorSettings = () => {
    localStorage.setItem("siteColors", JSON.stringify({
      primaryColor,
      secondaryColor,
      backgroundColor,
      accentColor
    }));
    
    toast({
      title: "Configurações salvas",
      description: "As cores do site foram atualizadas com sucesso."
    });
    
    // Aplicar cores diretamente ao CSS
    document.documentElement.style.setProperty('--background', backgroundColor);
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--secondary', secondaryColor);
    document.documentElement.style.setProperty('--accent', accentColor);
  };

  // Função para salvar as configurações do modelo - agora salva automaticamente
  const saveModelSettings = () => {
    localStorage.setItem("modelParameters", JSON.stringify(modelParams));
    
    toast({
      title: "Configurações do modelo salvas",
      description: "Os parâmetros do modelo 3D foram atualizados com sucesso."
    });
  };

  // Função para alterar o modelo ativo
  const changeActiveModel = (modelType: string, modelUrl?: string) => {
    setActiveModel(modelType);
    localStorage.setItem("preferredModel", modelType);
    
    // Se for um modelo do Sketchfab, salvar a URL
    if (modelType === 'sketchfab' && modelUrl) {
      setSketchfabUrl(modelUrl);
      localStorage.setItem("sketchfabUrl", modelUrl);
    }
    
    toast({
      title: "Modelo alterado",
      description: `O modelo da página inicial foi alterado para ${modelType}.`
    });
  };
  
  // Função para atualizar um parâmetro do modelo
  const updateModelParam = (param: keyof ModelParameters, value: number | string) => {
    const updatedParams = {
      ...modelParams,
      [param]: value
    };
    
    setModelParams(updatedParams);
    
    // Salvar automaticamente ao alterar qualquer parâmetro
    localStorage.setItem("modelParameters", JSON.stringify(updatedParams));
  };
  
  // Função para restaurar os valores padrão
  const resetModelParams = () => {
    setModelParams(defaultModelParams);
    localStorage.setItem("modelParameters", JSON.stringify(defaultModelParams));
    
    toast({
      title: "Parâmetros resetados",
      description: "Os parâmetros do modelo foram restaurados para os valores padrão."
    });
  };

  // Carregar cores iniciais do localStorage
  useEffect(() => {
    const savedColors = localStorage.getItem("siteColors");
    if (savedColors) {
      const colors = JSON.parse(savedColors);
      setPrimaryColor(colors.primaryColor);
      setSecondaryColor(colors.secondaryColor);
      setBackgroundColor(colors.backgroundColor);
      setAccentColor(colors.accentColor);
      
      // Aplicar cores ao CSS
      document.documentElement.style.setProperty('--background', colors.backgroundColor);
      document.documentElement.style.setProperty('--primary', colors.primaryColor);
      document.documentElement.style.setProperty('--secondary', colors.secondaryColor);
      document.documentElement.style.setProperty('--accent', colors.accentColor);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center sticky top-0 z-50 bg-black/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Link to="/" className="mr-2 md:mr-4">
            <ArrowLeft size={18} className="text-gray-400 hover:text-white transition-colors" />
          </Link>
          <h1 className="text-lg md:text-2xl font-semibold flex items-center gap-2">
            <Settings className="hidden md:inline mr-2" size={20} /> 
            Painel de Administração
          </h1>
        </div>
        
        <div className="flex gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm text-white transition-colors"
          >
            <Eye size={14} />
            <span className="hidden md:inline">Visualizar Site</span>
          </Link>
        </div>
      </header>
      
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-56 lg:w-64 mb-6 md:mb-0">
            <Tabs 
              orientation="vertical" 
              defaultValue={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <Card className="bg-black/30">
                <CardContent className="p-3">
                  <TabsList className="flex flex-row md:flex-col h-auto gap-1 bg-transparent justify-start">
                    <TabsTrigger value="dashboard" className="w-full justify-start gap-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                      <LayoutDashboard size={16} /> 
                      <span className="hidden md:inline">Dashboard</span>
                    </TabsTrigger>
                    <TabsTrigger value="models" className="w-full justify-start gap-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                      <FileAxis3d size={16} /> 
                      <span className="hidden md:inline">Modelos 3D</span>
                    </TabsTrigger>
                    <TabsTrigger value="sketchfab" className="w-full justify-start gap-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                      <CubeIcon size={16} /> 
                      <span className="hidden md:inline">Sketchfab</span>
                    </TabsTrigger>
                    <TabsTrigger value="material" className="w-full justify-start gap-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Droplet size={16} /> 
                      <span className="hidden md:inline">Material</span>
                    </TabsTrigger>
                    <TabsTrigger value="elements" className="w-full justify-start gap-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Layers size={16} /> 
                      <span className="hidden md:inline">Elementos</span>
                    </TabsTrigger>
                    <TabsTrigger value="layout" className="w-full justify-start gap-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Monitor size={16} /> 
                      <span className="hidden md:inline">Layout</span>
                    </TabsTrigger>
                    <TabsTrigger value="colors" className="w-full justify-start gap-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Palette size={16} /> 
                      <span className="hidden md:inline">Cores</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="w-full justify-start gap-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Settings size={16} /> 
                      <span className="hidden md:inline">Configurações</span>
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>
            </Tabs>
          </aside>
          
          <main className="flex-1">
            <Card className="bg-black/30 border-gray-800">
              <CardContent className="p-4 md:p-6">
                {/* Conteúdo do Dashboard */}
                <TabsContent value="dashboard" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl md:text-2xl font-semibold">Dashboard</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/30">
                        <CardContent className="p-6 flex flex-col">
                          <Box className="mb-4 text-purple-400" size={24} />
                          <h3 className="text-lg font-medium mb-1">Modelos 3D</h3>
                          <p className="text-sm text-gray-400 mb-4">Gerencie os modelos 3D da página inicial</p>
                          <button 
                            onClick={() => setActiveTab("models")}
                            className="mt-auto text-sm px-3 py-1.5 bg-purple-700/50 hover:bg-purple-700 rounded-md transition-colors"
                          >
                            Configurar
                          </button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 border-indigo-700/30">
                        <CardContent className="p-6 flex flex-col">
                          <CubeIcon className="mb-4 text-indigo-400" size={24} />
                          <h3 className="text-lg font-medium mb-1">Sketchfab</h3>
                          <p className="text-sm text-gray-400 mb-4">Adicione modelos direto do Sketchfab</p>
                          <button 
                            onClick={() => setActiveTab("sketchfab")}
                            className="mt-auto text-sm px-3 py-1.5 bg-indigo-700/50 hover:bg-indigo-700 rounded-md transition-colors"
                          >
                            Explorar
                          </button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/30">
                        <CardContent className="p-6 flex flex-col">
                          <Type className="mb-4 text-blue-400" size={24} />
                          <h3 className="text-lg font-medium mb-1">Textos</h3>
                          <p className="text-sm text-gray-400 mb-4">Edite os títulos e textos do site</p>
                          <button 
                            onClick={() => setActiveTab("elements")}
                            className="mt-auto text-sm px-3 py-1.5 bg-blue-700/50 hover:bg-blue-700 rounded-md transition-colors"
                          >
                            Editar
                          </button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-700/30">
                        <CardContent className="p-6 flex flex-col">
                          <Image className="mb-4 text-red-400" size={24} />
                          <h3 className="text-lg font-medium mb-1">Aparência</h3>
                          <p className="text-sm text-gray-400 mb-4">Personalize cores e tema do site</p>
                          <button 
                            onClick={() => setActiveTab("colors")}
                            className="mt-auto text-sm px-3 py-1.5 bg-red-700/50 hover:bg-red-700 rounded-md transition-colors"
                          >
                            Personalizar
                          </button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="bg-gray-800/30 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">Visualização Rápida</h3>
                      <div className="aspect-video relative bg-black rounded-lg overflow-hidden border border-gray-800">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-red-600 leading-none opacity-90">
                            {titleText}
                          </h1>
                        </div>
                        <div className="absolute bottom-8 left-8 max-w-xs">
                          <p className="text-sm uppercase tracking-widest text-white/80">
                            {subtitleText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab de Modelos 3D */}
                <TabsContent value="models" className="mt-0">
                  <ModelTab 
                    uploadedModels={uploadedModels}
                    setUploadedModels={setUploadedModels}
                    newModelName={newModelName}
                    setNewModelName={setNewModelName}
                    activeModel={activeModel}
                    changeActiveModel={changeActiveModel}
                  />
                </TabsContent>
                
                {/* Tab do Sketchfab */}
                <TabsContent value="sketchfab" className="mt-0">
                  <SketchfabTab 
                    changeActiveModel={changeActiveModel}
                  />
                </TabsContent>
                
                {/* Tab de Material e Efeitos */}
                <TabsContent value="material" className="mt-0">
                  <MaterialTab 
                    modelParams={modelParams}
                    updateModelParam={updateModelParam}
                    resetModelParams={resetModelParams}
                    saveModelSettings={saveModelSettings}
                    isColorPickerOpen={isColorPickerOpen}
                    setIsColorPickerOpen={setIsColorPickerOpen}
                  />
                </TabsContent>
                
                {/* Tab de Elementos */}
                <TabsContent value="elements" className="mt-0">
                  <ElementsTab
                    titleText={titleText}
                    setTitleText={setTitleText}
                    subtitleText={subtitleText}
                    setSubtitleText={setSubtitleText}
                  />
                </TabsContent>
                
                {/* Tab de Layout */}
                <TabsContent value="layout" className="mt-0">
                  <LayoutTab
                    titleText={titleText}
                    subtitleText={subtitleText}
                    modelParams={modelParams}
                  />
                </TabsContent>
                
                {/* Tab de Cores e Temas */}
                <TabsContent value="colors" className="mt-0">
                  <ColorsTab 
                    primaryColor={primaryColor}
                    setPrimaryColor={setPrimaryColor}
                    secondaryColor={secondaryColor}
                    setSecondaryColor={setSecondaryColor}
                    backgroundColor={backgroundColor}
                    setBackgroundColor={setBackgroundColor}
                    accentColor={accentColor}
                    setAccentColor={setAccentColor}
                    isColorPickerOpen={isColorPickerOpen}
                    setIsColorPickerOpen={setIsColorPickerOpen}
                    saveColorSettings={saveColorSettings}
                  />
                </TabsContent>
                
                {/* Tab de Configurações */}
                <TabsContent value="settings" className="mt-0">
                  <SettingsTab />
                </TabsContent>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Admin;
