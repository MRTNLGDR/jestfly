
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { FileAxis3d, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SavedModels from "@/components/admin/sketchfab/SavedModels";
import SearchForm from "@/components/admin/sketchfab/SearchForm";
import SearchResults from "@/components/admin/sketchfab/SearchResults";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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
  url: string | null;
  thumbnail_url: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at?: string;
  params?: Json | null;
}

interface SketchfabTabProps {
  changeActiveModel: (modelType: string, modelUrl?: string) => void;
}

const SketchfabTab = ({ changeActiveModel }: SketchfabTabProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"search" | "saved">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SketchfabModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [savedModels, setSavedModels] = useState<SavedModel[]>([]);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  
  // Carregar modelos salvos do banco de dados quando o componente montar
  useEffect(() => {
    const fetchSavedModels = async () => {
      try {
        setLoadingModels(true);
        const { data, error } = await supabase
          .from('models')
          .select('*')
          .eq('model_type', 'sketchfab')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setSavedModels(data || []);
      } catch (error) {
        console.error("Erro ao carregar modelos do Sketchfab:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar modelos",
          description: "Não foi possível carregar os modelos salvos do Sketchfab."
        });
      } finally {
        setLoadingModels(false);
      }
    };
    
    fetchSavedModels();
  }, [toast]);

  // Função para buscar modelos do Sketchfab
  const searchSketchfabModels = async (query: string) => {
    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Busca inválida",
        description: "Por favor, digite um termo de busca."
      });
      return;
    }
    
    setIsLoading(true);
    setSearchResults([]);
    
    try {
      // Usar function edge no supabase para fazer a busca (evitar CORS)
      const { data, error } = await supabase.functions.invoke("sketchfab-fetch", {
        body: { query },
      });
      
      if (error) throw error;
      
      if (data && Array.isArray(data.results)) {
        setSearchResults(data.results);
      } else {
        console.error("Formato de resposta inesperado:", data);
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      toast({
        variant: "destructive",
        title: "Erro na busca",
        description: "Não foi possível buscar modelos do Sketchfab. Tente novamente mais tarde."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para adicionar um modelo do Sketchfab ao banco de dados
  const addSketchfabModel = async (model: SketchfabModel) => {
    try {
      setIsSaving(model.viewerUrl);
      
      // Criar um novo registro no banco de dados
      const { data, error } = await supabase
        .from('models')
        .insert([
          {
            name: model.name,
            model_type: 'sketchfab',
            url: model.viewerUrl,
            thumbnail_url: model.thumbnails?.images?.[0]?.url || null,
            is_active: false,
            params: {
              uid: model.uid,
              embedUrl: model.embedUrl
            }
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Adicionar o novo modelo à lista local
      if (data && data.length > 0) {
        setSavedModels([...data, ...savedModels]);
        
        toast({
          title: "Modelo salvo",
          description: `O modelo ${model.name} foi adicionado com sucesso.`
        });
      }
    } catch (error) {
      console.error("Erro ao salvar modelo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar modelo",
        description: "Não foi possível salvar o modelo do Sketchfab."
      });
    } finally {
      setIsSaving(null);
    }
  };

  // Função para excluir um modelo do banco de dados
  const deleteSketchfabModel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Atualizar a lista local
      setSavedModels(savedModels.filter(model => model.id !== id));
      
      toast({
        title: "Modelo excluído",
        description: "O modelo foi removido com sucesso."
      });
    } catch (error) {
      console.error("Erro ao excluir modelo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir modelo",
        description: "Não foi possível excluir o modelo do banco de dados."
      });
    }
  };

  // Função para ativar um modelo do Sketchfab
  const activateSketchfabModel = async (id: string, url: string) => {
    try {
      // Primeiro, desativar todos os modelos
      await supabase
        .from('models')
        .update({ is_active: false })
        .not('id', 'is', null);
      
      // Depois, ativar o modelo selecionado
      const { error } = await supabase
        .from('models')
        .update({ is_active: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Atualizar a lista local
      const updatedModels = savedModels.map(model => ({
        ...model,
        is_active: model.id === id
      }));
      
      setSavedModels(updatedModels);
      
      // Chamar a função para mudar o modelo ativo na página inicial
      changeActiveModel('sketchfab', url);
      
      toast({
        title: "Modelo ativo",
        description: "O modelo do Sketchfab agora é exibido na página inicial."
      });
    } catch (error) {
      console.error("Erro ao ativar modelo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao ativar modelo",
        description: "Não foi possível definir este modelo como ativo."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FileAxis3d className="text-indigo-400" size={24} />
          Modelos do Sketchfab
        </h2>
        
        <div className="flex gap-2">
          <Button
            variant={activeTab === "search" ? "default" : "outline"}
            onClick={() => setActiveTab("search")}
            className={activeTab === "search" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-800/30 border-gray-600"}
          >
            <Search size={16} className="mr-2" />
            Buscar Modelos
          </Button>
          <Button
            variant={activeTab === "saved" ? "default" : "outline"}
            onClick={() => setActiveTab("saved")}
            className={activeTab === "saved" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-800/30 border-gray-600"}
          >
            <FileAxis3d size={16} className="mr-2" />
            Modelos Salvos
          </Button>
        </div>
      </div>
      
      <Card className="border-gray-700 bg-black/20">
        <CardContent className="p-5">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "search" | "saved")}>
            <TabsContent value="search" className="m-0 pt-4">
              <SearchForm 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={searchSketchfabModels}
                isLoading={isLoading}
              />
              
              <div className="mt-6">
                <SearchResults 
                  isLoading={isLoading}
                  searchResults={searchResults}
                  savedModels={savedModels}
                  onAddModel={addSketchfabModel}
                  isSaving={isSaving}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="m-0 pt-4">
              <SavedModels 
                loadingModels={loadingModels}
                savedModels={savedModels}
                onDeleteModel={deleteSketchfabModel}
                onActivateModel={activateSketchfabModel}
                onSwitchToSearch={() => setActiveTab("search")}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="bg-indigo-900/20 border-indigo-800/30">
        <CardContent className="p-5">
          <div className="text-sm text-indigo-200">
            <h3 className="font-medium mb-2">Sobre o Sketchfab</h3>
            <p className="mb-4">O Sketchfab é uma plataforma que permite visualizar, compartilhar e baixar modelos 3D. Alguns modelos podem ter restrições de uso ou licença.</p>
            <p>Você pode importar qualquer modelo do Sketchfab e usá-lo na sua página inicial, mas certifique-se de ter permissão para usar o modelo conforme a licença definida pelo autor.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SketchfabTab;
