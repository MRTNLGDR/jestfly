
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Upload,
  FileAxis3d,
  Check,
  X,
  Plus,
  Folder,
  Diamond,
  Circle,
  CircleDot
} from "lucide-react";

interface ModelTabProps {
  uploadedModels: Array<{ name: string; file: File; preview?: string }>;
  setUploadedModels: React.Dispatch<React.SetStateAction<Array<{ name: string; file: File; preview?: string }>>>;
  newModelName: string;
  setNewModelName: React.Dispatch<React.SetStateAction<string>>;
  activeModel: string;
  changeActiveModel: (modelType: string) => void;
}

const ModelTab = ({
  uploadedModels,
  setUploadedModels,
  newModelName,
  setNewModelName,
  activeModel,
  changeActiveModel
}: ModelTabProps) => {
  const { toast } = useToast();

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

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default ModelTab;
