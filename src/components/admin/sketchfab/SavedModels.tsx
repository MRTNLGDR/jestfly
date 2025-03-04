
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileAxis3d, Search } from 'lucide-react';
import SavedModelCard from './SavedModelCard';
import { Skeleton } from '@/components/ui/skeleton';

interface SavedModel {
  id: string;
  name: string;
  model_type: 'diamond' | 'sphere' | 'torus' | 'crystal' | 'sketchfab';
  url: string | null;
  thumbnail_url: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at?: string;
  params?: any;
}

interface SavedModelsProps {
  loadingModels: boolean;
  savedModels: SavedModel[];
  onDeleteModel: (id: string) => Promise<void>;
  onActivateModel: (id: string, url: string) => Promise<void>;
  onSwitchToSearch: () => void;
}

const SavedModels: React.FC<SavedModelsProps> = ({
  loadingModels,
  savedModels,
  onDeleteModel,
  onActivateModel,
  onSwitchToSearch
}) => {
  if (loadingModels) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  if (savedModels.length === 0) {
    return (
      <div className="text-center py-12">
        <FileAxis3d className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">Nenhum modelo salvo</h3>
        <p className="text-gray-400 mb-6">
          Você ainda não salvou nenhum modelo do Sketchfab.
        </p>
        <Button 
          onClick={onSwitchToSearch}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Search size={16} className="mr-2" />
          Buscar Modelos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedModels.map((model) => (
          <SavedModelCard
            key={model.id}
            model={model}
            onDelete={() => onDeleteModel(model.id)}
            onActivate={() => model.url && onActivateModel(model.id, model.url)}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedModels;
