
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, ExternalLink, FileAxis3d, Trash2 } from "lucide-react";
import { Json } from "@/integrations/supabase/types";
import { ModelType } from "@/integrations/supabase/schema";

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

interface SavedModelCardProps {
  model: SavedModel;
  onDelete: (id: string) => void;
  onActivate: (id: string, url: string) => void;
}

const SavedModelCard = ({ model, onDelete, onActivate }: SavedModelCardProps) => {
  return (
    <Card className={`overflow-hidden border-2 ${model.is_active ? 'border-purple-500/70' : 'border-white/10'} neo-blur bg-black/40 backdrop-blur-xl hover:bg-black/50 transition-all`}>
      <div className="aspect-video relative bg-black/60 overflow-hidden">
        {model.thumbnail_url ? (
          <img
            src={model.thumbnail_url}
            alt={model.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/80">
            <FileAxis3d className="h-12 w-12 text-gray-600" />
          </div>
        )}
        
        {model.is_active && (
          <Badge className="absolute top-2 right-2 bg-purple-600/90 backdrop-blur-md">
            Ativo
          </Badge>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-3">
          <h3 className="text-sm font-medium text-white/90 truncate">{model.name}</h3>
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(model.id)}
                    className="h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="neo-blur bg-black/80 border-white/10">
                  <p>Excluir modelo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href={model.url || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-8 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Ver no Sketchfab
                  </a>
                </TooltipTrigger>
                <TooltipContent className="neo-blur bg-black/80 border-white/10">
                  <p>Abrir no Sketchfab</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Button
            size="sm"
            variant={model.is_active ? "default" : "outline"}
            onClick={() => model.url && onActivate(model.id, model.url)}
            className={`h-8 ${model.is_active ? 'bg-purple-600/80 backdrop-blur-md hover:bg-purple-700/80' : 'bg-black/20 backdrop-blur-md border-white/10 hover:bg-white/10'}`}
            disabled={model.is_active || !model.url}
          >
            {model.is_active ? (
              <>
                <Check size={14} className="mr-1" />
                Ativo
              </>
            ) : "Ativar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedModelCard;
