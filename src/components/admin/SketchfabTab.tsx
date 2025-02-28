
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download, 
  Trash2, 
  Check, 
  Loader2, 
  Save, 
  FileAxis3d, 
  Plus,
  X,
  Eye
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SketchfabModel {
  uid: string;
  name: string;
  thumbnails: {
    images: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  viewerUrl: string;
  embedUrl: string;
}

interface SavedModel {
  id: string;
  name: string;
  model_type: 'diamond' | 'sphere' | 'torus' | 'crystal' | 'sketchfab';
  url: string;
  thumbnail_url: string;
  is_active: boolean;
  created_at: string;
}

const SketchfabTab = ({ 
  changeActiveModel 
}: { 
  changeActiveModel: (modelType: string, modelUrl?: string) => void 
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [directUrl, setDirectUrl] = useState("");
  const [searchResults, setSearchResults] = useState<SketchfabModel[]>([]);
  const [savedModels, setSavedModels] = useState<SavedModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeView, setActiveView] = useState<"search" | "saved">("saved");

  // Carregar modelos salvos
  const fetchSavedModels = async () => {
    try {
      // Usando any aqui para contornar o problema de tipos com a nova tabela
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .order('created_at', { ascending: false }) as { data: SavedModel[] | null, error: any };
      
      if (error) throw error;
      setSavedModels(data || []);
    } catch (error) {
      console.error("Erro ao carregar modelos:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar modelos",
        description: error.message
      });
    }
  };

  useEffect(() => {
    fetchSavedModels();
  }, []);

  // Buscar modelos do Sketchfab
  const searchSketchfabModels = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await supabase.functions.invoke('sketchfab-fetch', {
        body: { searchTerm }
      });
      
      if (response.error) throw new Error(response.error.message);
      
      setSearchResults(response.data.results || []);
      
      if ((response.data.results || []).length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Tente outros termos de busca."
        });
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      toast({
        variant: "destructive",
        title: "Erro na busca",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar modelo por URL direta
  const fetchModelByUrl = async () => {
    if (!directUrl.trim()) {
      toast({
        variant: "destructive",
        title: "URL necessária",
        description: "Por favor, insira uma URL do Sketchfab"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await supabase.functions.invoke('sketchfab-fetch', {
        body: { modelUrl: directUrl }
      });
      
      if (response.error) throw new Error(response.error.message);
      
      const modelDetails = response.data.model;
      
      if (!modelDetails) throw new Error("Detalhes do modelo não encontrados");
      
      const thumbnail = modelDetails.thumbnails?.images?.[0]?.url || "";
      
      const newModel = {
        id: crypto.randomUUID(),
        name: modelDetails.name || "Modelo Sketchfab",
        model_type: "sketchfab",
        url: modelDetails.viewerUrl || modelDetails.embedUrl || directUrl,
        thumbnail_url: thumbnail,
        is_active: false,
        created_at: new Date().toISOString()
      };
      
      await saveModel(newModel);
      setDirectUrl("");
      
    } catch (error) {
      console.error("Erro ao buscar modelo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar modelo",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar modelo no banco de dados
  const saveModel = async (model: any) => {
    setIsSaving(true);
    
    try {
      // Usando any aqui para contornar o problema de tipos com a nova tabela
      const { error } = await supabase
        .from('models')
        .insert({
          name: model.name,
          model_type: 'sketchfab' as any,
          url: model.url,
          thumbnail_url: model.thumbnail_url || "",
          is_active: false
        } as any);
      
      if (error) throw error;
      
      toast({
        title: "Modelo salvo",
        description: "O modelo foi adicionado à sua biblioteca"
      });
      
      // Atualizar a lista de modelos salvos
      await fetchSavedModels();
      setActiveView("saved");
      
    } catch (error) {
      console.error("Erro ao salvar modelo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar modelo",
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Adicionar modelo da busca
  const addModelFromSearch = async (model: SketchfabModel) => {
    const thumbnail = model.thumbnails?.images?.[0]?.url || "";
    
    const newModel = {
      name: model.name,
      model_type: 'sketchfab',
      url: model.viewerUrl || model.embedUrl,
      thumbnail_url: thumbnail,
      is_active: false
    };
    
    await saveModel(newModel);
  };

  // Excluir modelo
  const deleteModel = async (id: string) => {
    try {
      // Usando any aqui para contornar o problema de tipos com a nova tabela
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', id) as any;
      
      if (error) throw error;
      
      toast({
        title: "Modelo excluído",
        description: "O modelo foi removido da sua biblioteca"
      });
      
      // Atualizar a lista após a exclusão
      setSavedModels(savedModels.filter(model => model.id !== id));
      
    } catch (error) {
      console.error("Erro ao excluir modelo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir modelo",
        description: error.message
      });
    }
  };

  // Ativar modelo (definir como modelo ativo)
  const activateModel = async (id: string, url: string) => {
    try {
      // Primeiro, desativar todos os modelos
      // Usando any aqui para contornar o problema de tipos com a nova tabela
      await supabase
        .from('models')
        .update({ is_active: false } as any)
        .not('id', 'is', null) as any;
      
      // Depois, ativar o modelo selecionado
      const { error } = await supabase
        .from('models')
        .update({ is_active: true } as any)
        .eq('id', id) as any;
      
      if (error) throw error;
      
      // Atualizar a interface
      const updatedModels = savedModels.map(model => ({
        ...model,
        is_active: model.id === id
      }));
      
      setSavedModels(updatedModels);
      
      // Chamar a função para mudar o modelo ativo na página inicial
      changeActiveModel('sketchfab', url);
      
      toast({
        title: "Modelo ativo",
        description: "Este modelo agora é exibido na página inicial"
      });
      
    } catch (error) {
      console.error("Erro ao ativar modelo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao ativar modelo",
        description: error.message
      });
    }
  };

  // Renderizar resultados da busca
  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      );
    }
    
    if (searchResults.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <FileAxis3d className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Busque modelos do Sketchfab para adicionar</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.map((model) => {
          const thumbnail = model.thumbnails?.images?.[0]?.url || "";
          
          return (
            <Card key={model.uid} className="bg-gray-800/40 border-gray-700 overflow-hidden">
              <div className="aspect-video relative bg-gray-800 overflow-hidden">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={model.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <FileAxis3d className="h-12 w-12 text-gray-600" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                  <h3 className="text-sm font-medium text-white truncate">{model.name}</h3>
                </div>
              </div>
              
              <CardContent className="p-3 flex justify-between items-center">
                <a 
                  href={model.viewerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                >
                  <Eye size={14} className="mr-1" />
                  Visualizar
                </a>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => addModelFromSearch(model)}
                  disabled={isSaving}
                  className="h-8"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={14} className="mr-1" />}
                  Adicionar
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Renderizar modelos salvos
  const renderSavedModels = () => {
    if (savedModels.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <FileAxis3d className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Nenhum modelo salvo. Adicione modelos pela busca do Sketchfab.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedModels.map((model) => (
          <Card key={model.id} className={`overflow-hidden border-2 ${model.is_active ? 'border-purple-500' : 'border-gray-700'} bg-gray-800/40`}>
            <div className="aspect-video relative bg-gray-800 overflow-hidden">
              {model.thumbnail_url ? (
                <img
                  src={model.thumbnail_url}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <FileAxis3d className="h-12 w-12 text-gray-600" />
                </div>
              )}
              
              {model.is_active && (
                <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  Ativo
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                <h3 className="text-sm font-medium text-white truncate">{model.name}</h3>
              </div>
            </div>
            
            <CardContent className="p-3 flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteModel(model.id)}
                  className="h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </Button>
                
                <a 
                  href={model.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                >
                  <Eye size={14} className="mr-1" />
                  Ver
                </a>
              </div>
              
              <Button
                size="sm"
                variant={model.is_active ? "default" : "outline"}
                onClick={() => activateModel(model.id, model.url)}
                className={`h-8 ${model.is_active ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                disabled={model.is_active}
              >
                {model.is_active ? (
                  <>
                    <Check size={14} className="mr-1" />
                    Ativo
                  </>
                ) : "Ativar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FileAxis3d className="text-indigo-400" size={24} />
          Modelos do Sketchfab
        </h2>
        
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "search" | "saved")}>
          <TabsList>
            <TabsTrigger value="saved" className="data-[state=active]:bg-purple-600">
              Meus Modelos
            </TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:bg-purple-600">
              Buscar Novos
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeView === "search" && (
        <>
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-medium">Buscar Modelos</h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex gap-2">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar modelos (ex: crystal, diamond, car...)"
                    className="bg-gray-900/60 border-gray-700 flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && searchSketchfabModels()}
                  />
                  <Button 
                    onClick={searchSketchfabModels}
                    disabled={isLoading || !searchTerm.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search size={16} />}
                  </Button>
                </div>
              </div>
              
              <Separator className="bg-gray-700" />
              
              <h3 className="text-lg font-medium">URL Direta</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={directUrl}
                  onChange={(e) => setDirectUrl(e.target.value)}
                  placeholder="Cole a URL do Sketchfab (ex: https://sketchfab.com/models/...)"
                  className="bg-gray-900/60 border-gray-700 flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && fetchModelByUrl()}
                />
                <Button 
                  onClick={fetchModelByUrl}
                  disabled={isLoading || !directUrl.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download size={16} className="mr-2" />}
                  Importar Modelo
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Resultados da Busca</h3>
            {renderSearchResults()}
          </div>
        </>
      )}
      
      {activeView === "saved" && (
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Meus Modelos Sketchfab</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveView("search")}
            >
              <Plus size={14} className="mr-1" /> Adicionar Novo
            </Button>
          </div>
          {renderSavedModels()}
        </div>
      )}
    </div>
  );
};

export default SketchfabTab;
