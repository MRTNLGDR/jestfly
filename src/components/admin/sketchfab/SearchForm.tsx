
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Loader2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

interface SearchFormProps {
  onSearchResults: (results: any[]) => void;
  onModelImport: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SearchForm = ({ onSearchResults, onModelImport, isLoading, setIsLoading }: SearchFormProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [directUrl, setDirectUrl] = useState("");

  // Buscar modelos do Sketchfab
  const searchSketchfabModels = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await supabase.functions.invoke('sketchfab-fetch', {
        body: { searchTerm }
      });
      
      console.log("Resposta da função Edge:", response);
      
      if (response.error) throw new Error(response.error.message);
      
      onSearchResults(response.data.results || []);
      
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
        description: "Não foi possível buscar modelos do Sketchfab. Tente novamente mais tarde."
      });
      onSearchResults([]);
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
      // Validar formato da URL
      if (!directUrl.includes('sketchfab.com')) {
        throw new Error("URL inválida. Por favor, utilize uma URL do Sketchfab.");
      }
      
      const response = await supabase.functions.invoke('sketchfab-fetch', {
        body: { modelUrl: directUrl }
      });
      
      console.log("Resposta da função Edge (URL direta):", response);
      
      if (response.error) throw new Error(response.error.message);
      
      const modelDetails = response.data.model;
      
      if (!modelDetails) throw new Error("Detalhes do modelo não encontrados");
      
      const thumbnail = modelDetails.thumbnails?.images?.[0]?.url || "";
      
      const newModel = {
        name: modelDetails.name || "Modelo Sketchfab",
        model_type: "sketchfab" as const,
        url: modelDetails.viewerUrl || modelDetails.embedUrl || directUrl,
        thumbnail_url: thumbnail,
        is_active: false,
        params: {
          originalUrl: directUrl
        }
      };
      
      await saveModel(newModel);
      setDirectUrl("");
      
    } catch (error: any) {
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
    try {
      const { data, error } = await supabase
        .from('models')
        .insert({
          name: model.name,
          model_type: 'sketchfab',
          url: model.url,
          thumbnail_url: model.thumbnail_url || "",
          is_active: false,
          params: model.params || {}
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Modelo salvo",
        description: "O modelo foi adicionado à sua biblioteca"
      });
      
      // Notificar o componente pai para atualizar
      onModelImport();
      
    } catch (error) {
      console.error("Erro ao salvar modelo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar modelo",
        description: "Não foi possível salvar o modelo. Tente novamente."
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex gap-2">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar modelos (ex: crystal, diamond, car...)"
            className="bg-black/40 backdrop-blur-md border-white/10 text-white flex-1"
            onKeyDown={(e) => e.key === 'Enter' && searchSketchfabModels()}
          />
          <Button 
            onClick={searchSketchfabModels}
            disabled={isLoading || !searchTerm.trim()}
            className="bg-indigo-600/90 hover:bg-indigo-700 backdrop-blur-md"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search size={16} />}
          </Button>
        </div>
      </div>
      
      <Separator className="bg-white/10" />
      
      <h3 className="text-lg font-medium text-white/90">URL Direta</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={directUrl}
          onChange={(e) => setDirectUrl(e.target.value)}
          placeholder="Cole a URL do Sketchfab (ex: https://sketchfab.com/models/...)"
          className="bg-black/40 backdrop-blur-md border-white/10 text-white flex-1"
          onKeyDown={(e) => e.key === 'Enter' && fetchModelByUrl()}
        />
        <Button 
          onClick={fetchModelByUrl}
          disabled={isLoading || !directUrl.trim()}
          className="bg-indigo-600/90 hover:bg-indigo-700 backdrop-blur-md whitespace-nowrap"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download size={16} className="mr-2" />}
          Importar Modelo
        </Button>
      </div>
      
      <Alert className="neo-blur bg-blue-900/20 border-blue-500/30">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertTitle>Dica de uso</AlertTitle>
        <AlertDescription className="text-sm text-gray-300">
          Você pode adicionar qualquer modelo do Sketchfab colando a URL da página do modelo ou fazendo uma busca por palavras-chave.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SearchForm;
