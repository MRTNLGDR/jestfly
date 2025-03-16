
import { Button } from "@/components/ui/button";
import { FileAxis3d, Loader2, Plus } from "lucide-react";
import SavedModelCard from "./SavedModelCard";
import { Json } from "@/integrations/supabase/types";
import { ModelType } from "@/types/model";

interface SavedModel {
  id: string;
  name: string;
  model_type: ModelType;
  url: string | null;
  thumbnail_url: string | null;
  is_active: boolean | null;
  created_at: string;
  params?: Json | null;
}

interface SavedModelsProps {
  loadingModels: boolean;
  savedModels: SavedModel[];
  onDeleteModel: (id: string) => void;
  onActivateModel: (id: string, url: string) => void;
  onSwitchToSearch: () => void;
}

const SavedModels = ({ 
  loadingModels, 
  savedModels, 
  onDeleteModel, 
  onActivateModel, 
  onSwitchToSearch 
}: SavedModelsProps) => {
  
  if (loadingModels) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }
  
  if (savedModels.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <FileAxis3d className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Nenhum modelo salvo. Adicione modelos pela busca do Sketchfab.</p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onSwitchToSearch}
          className="mt-4 backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
        >
          <Plus size={14} className="mr-1" /> Buscar Modelos
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {savedModels.map((model) => (
        <SavedModelCard
          key={model.id}
          model={model}
          onDelete={onDeleteModel}
          onActivate={onActivateModel}
        />
      ))}
    </div>
  );
};

export default SavedModels;
