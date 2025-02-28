
import { Loader2, FileAxis3d } from "lucide-react";
import ModelCard from "./ModelCard";

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

interface SearchResultsProps {
  isLoading: boolean;
  searchResults: SketchfabModel[];
  savedModels: SavedModel[];
  onAddModel: (model: SketchfabModel) => void;
  isSaving: string | null;
}

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
        const isAlreadySaved = savedModels.some(saved => 
          saved.params?.uid === model.uid || 
          saved.url === model.viewerUrl || 
          saved.url === model.embedUrl
        );
        
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
