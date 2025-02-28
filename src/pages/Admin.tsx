
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { HexColorPicker } from "react-colorful";
import { useToast } from "@/components/ui/use-toast";
import {
  Upload,
  Settings,
  FileAxis3d,
  Palette,
  LayoutTemplate,
  Check,
  X,
  Plus,
  Folder,
  ArrowLeft,
  Diamond,
  Circle,
  CircleDot,
  Lightbulb,
  Droplet,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

// Interface para os parâmetros do modelo 3D
interface ModelParameters {
  color: string;
  metalness: number;
  roughness: number;
  transmission: number;
  thickness: number;
  envMapIntensity: number;
  clearcoat: number;
  clearcoatRoughness: number;
  ior: number;
  reflectivity: number;
  iridescence: number;
  iridescenceIOR: number;
  lightIntensity: number;
}

// Valores padrão para os parâmetros
const defaultModelParams: ModelParameters = {
  color: "#ffffff",
  metalness: 0.2,
  roughness: 0.01,
  transmission: 0.98,
  thickness: 1.0,
  envMapIntensity: 2.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.01,
  ior: 2.75,
  reflectivity: 1.0,
  iridescence: 0.3,
  iridescenceIOR: 1.3,
  lightIntensity: 1.5
};

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

  // Função para adicionar um novo modelo
  const handleModelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Verificar se o arquivo é um GLTF ou GLB
      if (file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {
        const newModel = {
          name: newModelName || file.name,
          file: file,
          preview: "/lovable-uploads/69507f0d-bbb9-4e5d-b648-984848675b22.png" // Usando a imagem de exemplo como preview
        };
        
        setUploadedModels([...uploadedModels, newModel]);
        setNewModelName("");
        
        toast({
          title: "Modelo adicionado com sucesso",
          description: `${file.name} foi adicionado à biblioteca de modelos.`
        });
      } else {
        toast({
          title: "Formato não suportado",
          description: "Por favor, selecione um arquivo GLTF ou GLB válido.",
          variant: "destructive"
        });
      }
    }
  };

  // Função para salvar as configurações de cores
  const saveColorSettings = () => {
    // Aqui você poderia salvar em um banco de dados ou localStorage
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
    
    // Aplicar cores diretamente ao CSS (exemplo)
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

  // Função para remover um modelo
  const removeModel = (index: number) => {
    const newModels = [...uploadedModels];
    newModels.splice(index, 1);
    setUploadedModels(newModels);
    
    toast({
      title: "Modelo removido",
      description: "O modelo foi removido da biblioteca."
    });
  };

  // Função para alternar o color picker
  const toggleColorPicker = (colorName: string) => {
    if (isColorPickerOpen === colorName) {
      setIsColorPickerOpen(null);
    } else {
      setIsColorPickerOpen(colorName);
    }
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
          <TabsContent value="models" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Biblioteca de Modelos 3D</h2>
              <label htmlFor="model-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
                  <Upload size={16} /> Adicionar Modelo
                </div>
                <input
                  id="model-upload"
                  type="file"
                  accept=".gltf,.glb"
                  className="hidden"
                  onChange={handleModelUpload}
                />
              </label>
            </div>

            {/* Seleção de modelo para a página inicial */}
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Modelo da Página Inicial</h3>
              <p className="text-gray-400 mb-4">Selecione o modelo que será exibido na página inicial:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div 
                  className={`p-4 rounded-lg cursor-pointer flex flex-col items-center gap-3 transition-colors ${activeModel === 'diamond' ? 'bg-purple-600' : 'bg-gray-700/50 hover:bg-gray-700'}`}
                  onClick={() => changeActiveModel('diamond')}
                >
                  <Diamond size={48} />
                  <span>Diamante</span>
                  {activeModel === 'diamond' && <Check size={16} className="mt-1" />}
                </div>
                
                <div 
                  className={`p-4 rounded-lg cursor-pointer flex flex-col items-center gap-3 transition-colors ${activeModel === 'sphere' ? 'bg-purple-600' : 'bg-gray-700/50 hover:bg-gray-700'}`}
                  onClick={() => changeActiveModel('sphere')}
                >
                  <Circle size={48} />
                  <span>Esfera</span>
                  {activeModel === 'sphere' && <Check size={16} className="mt-1" />}
                </div>
                
                <div 
                  className={`p-4 rounded-lg cursor-pointer flex flex-col items-center gap-3 transition-colors ${activeModel === 'torus' ? 'bg-purple-600' : 'bg-gray-700/50 hover:bg-gray-700'}`}
                  onClick={() => changeActiveModel('torus')}
                >
                  <CircleDot size={48} />
                  <span>Anel</span>
                  {activeModel === 'torus' && <Check size={16} className="mt-1" />}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex gap-3 items-center mb-4">
                <Input
                  placeholder="Nome para o próximo modelo..."
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  className="bg-gray-700/50 border-gray-600"
                />
                <label htmlFor="quick-model-upload" className="cursor-pointer">
                  <div className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
                    <Plus size={20} />
                  </div>
                  <input
                    id="quick-model-upload"
                    type="file"
                    accept=".gltf,.glb"
                    className="hidden"
                    onChange={handleModelUpload}
                  />
                </label>
              </div>
              
              <Separator className="my-4 bg-gray-700" />
              
              {uploadedModels.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                  <Folder className="mb-3 h-12 w-12 opacity-50" />
                  <p className="text-lg">Nenhum modelo 3D adicionado</p>
                  <p className="text-sm mt-2 max-w-md">
                    Upload modelos GLTF ou GLB para exibir na visualização 3D da página inicial.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedModels.map((model, index) => (
                    <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="h-40 flex items-center justify-center bg-gray-800 rounded mb-3">
                        {model.preview ? (
                          <img 
                            src={model.preview} 
                            alt={model.name} 
                            className="h-full object-contain" 
                          />
                        ) : (
                          <FileAxis3d size={48} className="text-gray-500" />
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-white">{model.name}</h3>
                          <p className="text-xs text-gray-400">{Math.round(model.file.size / 1024)} KB</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => changeActiveModel('gltf')}
                            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-full transition-colors"
                            title="Usar na página inicial"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => removeModel(index)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Tab de Material e Efeitos */}
          <TabsContent value="material" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Material e Efeitos Visuais</h2>
              <div className="flex gap-2">
                <Button onClick={resetModelParams} variant="outline">
                  Resetar
                </Button>
                <Button onClick={saveModelSettings} className="bg-purple-600 hover:bg-purple-700">
                  Salvar Configurações
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 p-6 bg-gray-800/50 rounded-lg">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: modelParams.color }}></div>
                      Cor do Modelo
                    </Label>
                    <div 
                      className="w-8 h-8 rounded cursor-pointer border border-white/20"
                      style={{ backgroundColor: modelParams.color }}
                      onClick={() => toggleColorPicker('modelColor')}
                    />
                  </div>
                  {isColorPickerOpen === 'modelColor' && (
                    <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                      <HexColorPicker 
                        color={modelParams.color} 
                        onChange={(color) => updateModelParam('color', color)} 
                      />
                      <div className="mt-2 flex gap-2">
                        <Input 
                          value={modelParams.color} 
                          onChange={(e) => updateModelParam('color', e.target.value)}
                          className="bg-gray-800 border-gray-600"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => setIsColorPickerOpen(null)}
                          className="bg-gray-600 hover:bg-gray-500"
                        >
                          <Check size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="flex items-center gap-2">
                      <Lightbulb size={16} className="text-yellow-400" />
                      Intensidade da Luz
                    </Label>
                    <span className="text-sm text-gray-400">{modelParams.lightIntensity.toFixed(2)}</span>
                  </div>
                  <Slider 
                    min={0.1} 
                    max={5} 
                    step={0.1} 
                    value={[modelParams.lightIntensity]} 
                    onValueChange={(values) => updateModelParam('lightIntensity', values[0])}
                    className="my-4"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Metalicidade</Label>
                    <span className="text-sm text-gray-400">{modelParams.metalness.toFixed(2)}</span>
                  </div>
                  <Slider 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    value={[modelParams.metalness]} 
                    onValueChange={(values) => updateModelParam('metalness', values[0])}
                    className="my-4"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Rugosidade</Label>
                    <span className="text-sm text-gray-400">{modelParams.roughness.toFixed(2)}</span>
                  </div>
                  <Slider 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    value={[modelParams.roughness]} 
                    onValueChange={(values) => updateModelParam('roughness', values[0])}
                    className="my-4"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Transmissão</Label>
                    <span className="text-sm text-gray-400">{modelParams.transmission.toFixed(2)}</span>
                  </div>
                  <Slider 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    value={[modelParams.transmission]} 
                    onValueChange={(values) => updateModelParam('transmission', values[0])}
                    className="my-4"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Espessura</Label>
                    <span className="text-sm text-gray-400">{modelParams.thickness.toFixed(2)}</span>
                  </div>
                  <Slider 
                    min={0} 
                    max={5} 
                    step={0.1} 
                    value={[modelParams.thickness]} 
                    onValueChange={(values) => updateModelParam('thickness', values[0])}
                    className="my-4"
                  />
                </div>
              </div>
              
              <div className="space-y-6 p-6 bg-gray-800/50 rounded-lg">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-400" />
                      Intensidade do Mapa Env
                    </Label>
                    <span className="text-sm text-gray-400">{modelParams.envMapIntensity.toFixed(2)}</span>
                  </div>
                  <Slider 
                    min={0} 
                    max={5} 
                    step={0.1} 
                    value={[modelParams.envMapIntensity]} 
                    onValueChange={(values) => updateModelParam('envMapIntensity', values[0])}
                    className="my-4"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Camada Clara</Label>
                    <span className="text-sm text-gray-400">{modelParams.clearcoat.toFixed(2)}</span>
                  </div>
                  <Slider 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    value={[modelParams.clearcoat]} 
                    onValueChange={(values) => updateModelParam('clearcoat', values[0])}
                    className="my-4"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Rugosidade da Camada Clara</Label>
                    <span className="text-sm text-gray-400">{modelParams.clearcoatRoughness.toFixed(2)}</span>
                  </div>
                  <Slider 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    value={[modelParams.clearcoatRoughness]} 
                    onValueChange={(values) => updateModelParam('clearcoatRoughness', values[0])}
                    className="my-4"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Índice de Refração (IOR)</Label>
                    <span className="text-sm text-gray-400">{modelParams.ior.toFixed(2)}</span>
                  </div>
                  <Slider 
                    min={1} 
                    max={3.5} 
                    step={0.01} 
                    value={[modelParams.ior]} 
                    onValueChange={(values) => updateModelParam('ior', values[0])}
                    className="my-4"
                  />
                  <p className="text-xs text-gray-400">
                    Referência: Vidro (1.5), Diamante (2.4), Água (1.3)
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Refletividade</Label>
                    <span className="text-sm text-gray-400">{modelParams.reflectivity.toFixed(2)}</span>
                  </div>
                  <Slider 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    value={[modelParams.reflectivity]} 
                    onValueChange={(values) => updateModelParam('reflectivity', values[0])}
                    className="my-4"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Efeito Iridescente</Label>
                    <span className="text-sm text-gray-400">{modelParams.iridescence.toFixed(2)}</span>
                  </div>
                  <Slider 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    value={[modelParams.iridescence]} 
                    onValueChange={(values) => updateModelParam('iridescence', values[0])}
                    className="my-4"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>IOR Iridescente</Label>
                    <span className="text-sm text-gray-400">{modelParams.iridescenceIOR.toFixed(2)}</span>
                  </div>
                  <Slider 
                    min={1} 
                    max={2.5} 
                    step={0.01} 
                    value={[modelParams.iridescenceIOR]} 
                    onValueChange={(values) => updateModelParam('iridescenceIOR', values[0])}
                    className="my-4"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Tab de Cores e Temas */}
          <TabsContent value="colors" className="space-y-6">
            <h2 className="text-2xl font-semibold">Cores e Temas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="text-xl font-medium">Cores do Site</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="primaryColor">Cor Primária</Label>
                      <div 
                        className="w-8 h-8 rounded cursor-pointer border border-white/20"
                        style={{ backgroundColor: primaryColor }}
                        onClick={() => toggleColorPicker('primary')}
                      />
                    </div>
                    {isColorPickerOpen === 'primary' && (
                      <div className="mt-2 p-2 bg-gray-700 rounded-lg">
                        <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
                        <div className="mt-2 flex gap-2">
                          <Input 
                            value={primaryColor} 
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="bg-gray-800 border-gray-600"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => setIsColorPickerOpen(null)}
                            className="bg-gray-600 hover:bg-gray-500"
                          >
                            <Check size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="secondaryColor">Cor Secundária</Label>
                      <div 
                        className="w-8 h-8 rounded cursor-pointer border border-white/20"
                        style={{ backgroundColor: secondaryColor }}
                        onClick={() => toggleColorPicker('secondary')}
                      />
                    </div>
                    {isColorPickerOpen === 'secondary' && (
                      <div className="mt-2 p-2 bg-gray-700 rounded-lg">
                        <HexColorPicker color={secondaryColor} onChange={setSecondaryColor} />
                        <div className="mt-2 flex gap-2">
                          <Input 
                            value={secondaryColor} 
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="bg-gray-800 border-gray-600"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => setIsColorPickerOpen(null)}
                            className="bg-gray-600 hover:bg-gray-500"
                          >
                            <Check size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                      <div 
                        className="w-8 h-8 rounded cursor-pointer border border-white/20"
                        style={{ backgroundColor: backgroundColor }}
                        onClick={() => toggleColorPicker('background')}
                      />
                    </div>
                    {isColorPickerOpen === 'background' && (
                      <div className="mt-2 p-2 bg-gray-700 rounded-lg">
                        <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                        <div className="mt-2 flex gap-2">
                          <Input 
                            value={backgroundColor} 
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="bg-gray-800 border-gray-600"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => setIsColorPickerOpen(null)}
                            className="bg-gray-600 hover:bg-gray-500"
                          >
                            <Check size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="accentColor">Cor de Destaque</Label>
                      <div 
                        className="w-8 h-8 rounded cursor-pointer border border-white/20"
                        style={{ backgroundColor: accentColor }}
                        onClick={() => toggleColorPicker('accent')}
                      />
                    </div>
                    {isColorPickerOpen === 'accent' && (
                      <div className="mt-2 p-2 bg-gray-700 rounded-lg">
                        <HexColorPicker color={accentColor} onChange={setAccentColor} />
                        <div className="mt-2 flex gap-2">
                          <Input 
                            value={accentColor} 
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="bg-gray-800 border-gray-600"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => setIsColorPickerOpen(null)}
                            className="bg-gray-600 hover:bg-gray-500"
                          >
                            <Check size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={saveColorSettings}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                >
                  Salvar Configurações de Cores
                </Button>
              </div>
              
              <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="text-xl font-medium">Visualização</h3>
                <div className="rounded-lg overflow-hidden" style={{ background: `linear-gradient(to right bottom, ${backgroundColor}, #000)` }}>
                  <div className="p-6 min-h-[300px] flex flex-col items-center justify-center">
                    <div className="w-16 h-16 mb-4 rounded-full" style={{ background: primaryColor }}></div>
                    <div className="h-6 w-32 mb-2 rounded" style={{ background: secondaryColor }}></div>
                    <div className="h-4 w-48 rounded" style={{ background: accentColor }}></div>
                    
                    <div className="mt-8 flex gap-2">
                      <button className="px-4 py-2 rounded" style={{ background: primaryColor, color: 'white' }}>
                        Botão
                      </button>
                      <button className="px-4 py-2 rounded" style={{ background: 'transparent', border: `1px solid ${secondaryColor}`, color: 'white' }}>
                        Secundário
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Tab de Configurações */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold">Configurações Gerais</h2>
            <p className="text-gray-400">Gerencie as configurações gerais do site.</p>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input 
                    id="siteName"
                    defaultValue="JESTFLY"
                    className="mt-1 bg-gray-700/50 border-gray-600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="siteDescription">Descrição do Site</Label>
                  <Input 
                    id="siteDescription"
                    defaultValue="Um site de visualização 3D com modelos interativos cristalinos"
                    className="mt-1 bg-gray-700/50 border-gray-600"
                  />
                </div>
                
                <Separator className="my-4 bg-gray-700" />
                
                <div>
                  <Label htmlFor="metaTitle">Título da Meta Tag</Label>
                  <Input 
                    id="metaTitle"
                    defaultValue="JESTFLY - Visualizações 3D Cristalinas"
                    className="mt-1 bg-gray-700/50 border-gray-600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="metaDescription">Descrição da Meta Tag</Label>
                  <Input 
                    id="metaDescription"
                    defaultValue="Explore visualizações 3D cristalinas com efeitos de refração e reflexão perfeitos"
                    className="mt-1 bg-gray-700/50 border-gray-600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="googleAnalytics">ID do Google Analytics</Label>
                  <Input 
                    id="googleAnalytics"
                    placeholder="UA-XXXXXXXXX-X"
                    className="mt-1 bg-gray-700/50 border-gray-600"
                  />
                </div>
              </div>
              
              <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                Salvar Configurações Gerais
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
