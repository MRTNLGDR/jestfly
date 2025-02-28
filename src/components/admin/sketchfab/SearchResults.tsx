
import { Loader2, FileAxis3d } from "lucide-react";
import ModelCard from "./ModelCard";
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
  params?: Json | null;
}

interface SearchResultsProps {
  isLoading: boolean;
  searchResults: SketchfabModel[];
  savedModels: SavedModel[];
  onAddModel: (model: SketchfabModel) => void;
  isSaving: string | null;
}

// Função auxiliar para verificar se o Json params tem a propriedade uid
const hasUid = (params: Json | null | undefined): boolean => {
  if (!params) return false;
  if (typeof params === 'object' && params !== null) {
    return 'uid' in params;
  }
  return false;
};

const SearchResults = ({ 
  isLoading, 
  searchResults, 
  savedModels, 
  onAddModel, 
  isSaving 
}: SearchResultsProps) => {
  
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
        const isAlreadySaved = savedModels.some(saved => {
          // Verificar se params é um objeto e se tem a propriedade uid
          const paramsHasUid = hasUid(saved.params);
          const uidMatches = paramsHasUid && typeof saved.params === 'object' && saved.params.uid === model.uid;
          
          // Verificar se a URL corresponde
          const urlMatches = saved.url === model.viewerUrl || saved.url === model.embedUrl;
          
          return uidMatches || urlMatches;
        });
        
        return (
          <ModelCard
            key={model.uid}
            model={model}
            isAlreadySaved={isAlreadySaved}
            onAddModel={onAddModel}
            isSaving={isSaving === model.viewerUrl}
          />
        );
      })}
    </div>
  );
};

export default SearchResults;
