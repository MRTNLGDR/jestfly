
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileAxis3d, Check, Plus, Loader2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

interface ModelCardProps {
  model: SketchfabModel;
  isAlreadySaved: boolean;
  onAddModel: (model: SketchfabModel) => void;
  isSaving: boolean;
}

const ModelCard = ({ model, isAlreadySaved, onAddModel, isSaving }: ModelCardProps) => {
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
          variant={isAlreadySaved ? "secondary" : "outline"}
          onClick={() => !isAlreadySaved && onAddModel(model)}
          disabled={isSaving || isAlreadySaved}
          className="h-8"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isAlreadySaved ? (
            <>
              <Check size={14} className="mr-1" />
              Salvo
            </>
          ) : (
            <>
              <Plus size={14} className="mr-1" />
              Adicionar
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModelCard;
