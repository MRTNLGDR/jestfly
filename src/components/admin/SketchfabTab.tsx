
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { FileAxis3d, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our new components
import SearchForm from "./sketchfab/SearchForm";
import SearchResults from "./sketchfab/SearchResults";
import SavedModels from "./sketchfab/SavedModels";

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
  params?: Record<string, any>;
}

const SketchfabTab = ({ 
  changeActiveModel 
}: { 
  changeActiveModel: (modelType: string, modelUrl?: string) => void 
}) => {
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<SketchfabModel[]>([]);
  const [savedModels, setSavedModels] = useState<SavedModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"search" | "saved">("saved");

  // Carregar modelos salvos
  const fetchSavedModels = async () => {
    setLoadingModels(true);
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .eq('model_type', 'sketchfab')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log("Modelos carregados:", data);
      setSavedModels(data as SavedModel[] || []);
    } catch (error) {
      console.error("Erro ao carregar modelos:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar modelos",
        description: "Não foi possível carregar os modelos do Sketchfab."
      });
    } finally {
      setLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchSavedModels();
  }, []);

  // Handler para adicionar um modelo da busca
  const addModelFromSearch = async (model: SketchfabModel) => {
    setIsSaving(model.viewerUrl);
    
    try {
      const thumbnail = model.thumbnails?.images?.[0]?.url || "";
      
      const newModel = {
        name: model.name,
        model_type: 'sketchfab' as const,
        url: model.viewerUrl || model.embedUrl,
        thumbnail_url: thumbnail,
        is_active: false,
        params: {
          originalUrl: model.viewerUrl,
          uid: model.uid
        }
      };
      
      const { data, error } = await supabase
        .from('models')
        .insert({
          name: newModel.name,
          model_type: newModel.model_type,
          url: newModel.url,
          thumbnail_url: newModel.thumbnail_url,
          is_active: newModel.is_active,
          params: newModel.params
        })
        .select();
      
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
        description: "Não foi possível salvar o modelo. Tente novamente."
      });
    } finally {
      setIsSaving(null);
    }
  };

  // Excluir modelo
  const deleteModel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', id);
      
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
        description: "Não foi possível excluir o modelo. Tente novamente."
      });
    }
  };

  // Ativar modelo (definir como modelo ativo)
  const activateModel = async (id: string, url: string) => {
    try {
      // Primeiro, desativar todos os modelos
      await supabase
        .from('models')
        .update({ is_active: false })
        .eq('model_type', 'sketchfab');
      
      // Depois, ativar o modelo selecionado
      const { error } = await supabase
        .from('models')
        .update({ is_active: true })
        .eq('id', id);
      
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
        description: "Não foi possível definir este modelo como ativo. Tente novamente."
      });
    }
  };

  // Handler para resultados de busca
  const handleSearchResults = (results: SketchfabModel[]) => {
    setSearchResults(results);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
          <FileAxis3d className="text-indigo-400" size={24} />
          Modelos do Sketchfab
        </h2>
        
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "search" | "saved")}>
          <TabsList className="neo-blur bg-black/40 border border-white/10">
            <TabsTrigger 
              value="saved" 
              className="data-[state=active]:bg-purple-600/80 data-[state=active]:text-white data-[state=inactive]:text-white/70"
            >
              Meus Modelos
            </TabsTrigger>
            <TabsTrigger 
              value="search" 
              className="data-[state=active]:bg-purple-600/80 data-[state=active]:text-white data-[state=inactive]:text-white/70"
            >
              Buscar Novos
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeView === "search" && (
        <>
          <Card className="neo-blur bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-white/90">Buscar Modelos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SearchForm 
                onSearchResults={handleSearchResults}
                onModelImport={fetchSavedModels}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </CardContent>
          </Card>
          
          <div className="neo-blur bg-black/20 border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4 text-white/90">Resultados da Busca</h3>
            <SearchResults
              isLoading={isLoading}
              searchResults={searchResults}
              savedModels={savedModels}
              onAddModel={addModelFromSearch}
              isSaving={isSaving}
            />
          </div>
        </>
      )}
      
      {activeView === "saved" && (
        <div className="neo-blur bg-black/20 border border-white/10 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white/90">Meus Modelos Sketchfab</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveView("search")}
              className="neo-blur bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              <Plus size={14} className="mr-1" /> Adicionar Novo
            </Button>
          </div>
          <SavedModels
            loadingModels={loadingModels}
            savedModels={savedModels}
            onDeleteModel={deleteModel}
            onActivateModel={activateModel}
            onSwitchToSearch={() => setActiveView("search")}
          />
        </div>
      )}
    </div>
  );
};

export default SketchfabTab;
