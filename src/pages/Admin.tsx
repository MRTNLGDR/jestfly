
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Settings,
  FileAxis3d,
  Palette,
  Droplet,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ModelParameters, defaultModelParams } from "@/types/model";
import ModelTab from "@/components/admin/ModelTab";
import MaterialTab from "@/components/admin/MaterialTab";
import ColorsTab from "@/components/admin/ColorsTab";
import SettingsTab from "@/components/admin/SettingsTab";

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("models");
  const [primaryColor, setPrimaryColor] = useState("#9b87f5");
  const [secondaryColor, setSecondaryColor] = useState("#6E59A5");
  const [backgroundColor, setBackgroundColor] = useState("#1A1F2C");
  const [accentColor, setAccentColor] = useState("#D6BCFA");
  const [uploadedModels, setUploadedModels] = useState<{ name: string; file: File; preview?: string }[]>([]);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<string | null>(null);
  const [newModelName, setNewModelName] = useState("");
  const [activeModel, setActiveModel] = useState(() => {
    return localStorage.getItem("preferredModel") || "diamond";
  });
  
  // Estados para os parâmetros do modelo
  const [modelParams, setModelParams] = useState<ModelParameters>(() => {
    const savedParams = localStorage.getItem("modelParameters");
    return savedParams ? JSON.parse(savedParams) : defaultModelParams;
  });

  // Salvar a preferência de modelo no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("preferredModel", activeModel);
  }, [activeModel]);
  
  // Salvar parâmetros do modelo no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem("modelParameters", JSON.stringify(modelParams));
  }, [modelParams]);

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

  // Função para salvar as configurações do modelo
  const saveModelSettings = () => {
    localStorage.setItem("modelParameters", JSON.stringify(modelParams));
    
    toast({
      title: "Configurações do modelo salvas",
      description: "Os parâmetros do modelo 3D foram atualizados com sucesso."
    });
  };

  // Função para alterar o modelo ativo
  const changeActiveModel = (modelType: string) => {
    setActiveModel(modelType);
    toast({
      title: "Modelo alterado",
      description: `O modelo da página inicial foi alterado para ${modelType}.`
    });
  };
  
  // Função para atualizar um parâmetro do modelo
  const updateModelParam = (param: keyof ModelParameters, value: number | string) => {
    setModelParams(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  // Função para restaurar os valores padrão
  const resetModelParams = () => {
    setModelParams(defaultModelParams);
    toast({
      title: "Parâmetros resetados",
      description: "Os parâmetros do modelo foram restaurados para os valores padrão."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="p-6 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="mr-4">
            <ArrowLeft size={20} className="text-gray-400 hover:text-white transition-colors" />
          </Link>
          <h1 className="text-2xl font-semibold flex items-center">
            <Settings className="mr-2" /> Painel de Administração
          </h1>
        </div>
      </header>
      
      <div className="container mx-auto p-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="models" className="flex items-center gap-2">
              <FileAxis3d size={18} /> Modelos 3D
            </TabsTrigger>
            <TabsTrigger value="material" className="flex items-center gap-2">
              <Droplet size={18} /> Material e Efeitos
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette size={18} /> Cores e Temas
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={18} /> Configurações
            </TabsTrigger>
          </TabsList>
          
          {/* Tab de Modelos 3D */}
          <TabsContent value="models">
            <ModelTab 
              uploadedModels={uploadedModels}
              setUploadedModels={setUploadedModels}
              newModelName={newModelName}
              setNewModelName={setNewModelName}
              activeModel={activeModel}
              changeActiveModel={changeActiveModel}
            />
          </TabsContent>
          
          {/* Tab de Material e Efeitos */}
          <TabsContent value="material">
            <MaterialTab 
              modelParams={modelParams}
              updateModelParam={updateModelParam}
              resetModelParams={resetModelParams}
              saveModelSettings={saveModelSettings}
              isColorPickerOpen={isColorPickerOpen}
              setIsColorPickerOpen={setIsColorPickerOpen}
            />
          </TabsContent>
          
          {/* Tab de Cores e Temas */}
          <TabsContent value="colors">
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
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
