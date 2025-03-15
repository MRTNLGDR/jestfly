
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Smartphone, Tablet, ArrowDownUp, ArrowLeftRight, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ModelParameters } from "@/types/model";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Badge } from "@/components/ui/badge";

interface LayoutTabProps {
  titleText: string;
  subtitleText: string;
  modelParams: ModelParameters;
}

// Componente de prévia do layout
const LayoutTab = ({ titleText, subtitleText, modelParams }: LayoutTabProps) => {
  const [activeTab, setActiveTab] = useState("desktop");
  const [layoutMode, setLayoutMode] = useState("preview");

  // Função simulada para reordenar elementos
  const onDragEnd = (result: any) => {
    // Implementar funcionalidade de arrastar e soltar aqui
    console.log("Reordenação:", result);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Monitor className="text-purple-400" size={24} />
          Layout e Posicionamento
        </h2>
        
        <Tabs value={layoutMode} onValueChange={setLayoutMode}>
          <TabsList className="bg-gray-800/60">
            <TabsTrigger value="preview" className="data-[state=active]:bg-purple-600">
              <Eye size={14} className="mr-2" /> Prévia
            </TabsTrigger>
            <TabsTrigger value="edit" className="data-[state=active]:bg-purple-600">
              <ArrowDownUp size={14} className="mr-2" /> Editar
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="bg-gray-800/30 p-4 rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Visualização do Layout</h3>
            
            <TabsList className="bg-gray-800/60">
              <TabsTrigger value="mobile" className="data-[state=active]:bg-purple-600">
                <Smartphone size={14} className="mr-2" /> Mobile
              </TabsTrigger>
              <TabsTrigger value="tablet" className="data-[state=active]:bg-purple-600">
                <Tablet size={14} className="mr-2" /> Tablet
              </TabsTrigger>
              <TabsTrigger value="desktop" className="data-[state=active]:bg-purple-600">
                <Monitor size={14} className="mr-2" /> Desktop
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="mobile" className="mt-0">
            <LayoutPreview device="mobile" titleText={titleText} subtitleText={subtitleText} modelParams={modelParams} layoutMode={layoutMode} />
          </TabsContent>
          
          <TabsContent value="tablet" className="mt-0">
            <LayoutPreview device="tablet" titleText={titleText} subtitleText={subtitleText} modelParams={modelParams} layoutMode={layoutMode} />
          </TabsContent>
          
          <TabsContent value="desktop" className="mt-0">
            <LayoutPreview device="desktop" titleText={titleText} subtitleText={subtitleText} modelParams={modelParams} layoutMode={layoutMode} />
          </TabsContent>
        </Tabs>
      </div>
      
      {layoutMode === "edit" && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="bg-gray-800/30 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Ordem dos Elementos</h3>
            <p className="text-sm text-gray-400 mb-4">Arraste para reordenar os elementos na página:</p>
            
            <Droppable droppableId="layout-elements">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  <Draggable draggableId="title" index={0}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md border border-gray-600"
                      >
                        <div className="flex items-center gap-3">
                          <ArrowDownUp size={16} className="text-gray-400" />
                          <div>
                            <div className="font-medium">Título Principal</div>
                            <div className="text-sm text-gray-400 truncate max-w-[300px]">{titleText}</div>
                          </div>
                        </div>
                        <Badge className="bg-red-600">Centralizado</Badge>
                      </div>
                    )}
                  </Draggable>
                  
                  <Draggable draggableId="model" index={1}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md border border-gray-600"
                      >
                        <div className="flex items-center gap-3">
                          <ArrowDownUp size={16} className="text-gray-400" />
                          <div>
                            <div className="font-medium">Modelo 3D</div>
                            <div className="text-sm text-gray-400">Visualização principal</div>
                          </div>
                        </div>
                        <Badge className="bg-purple-600">Fundo</Badge>
                      </div>
                    )}
                  </Draggable>
                  
                  <Draggable draggableId="subtitle" index={2}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md border border-gray-600"
                      >
                        <div className="flex items-center gap-3">
                          <ArrowDownUp size={16} className="text-gray-400" />
                          <div>
                            <div className="font-medium">Subtítulo</div>
                            <div className="text-sm text-gray-400 truncate max-w-[300px]">{subtitleText}</div>
                          </div>
                        </div>
                        <Badge className="bg-blue-600">Inferior Esquerdo</Badge>
                      </div>
                    )}
                  </Draggable>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      )}
      
      <div className="flex justify-center">
        <Button asChild>
          <Link to="/" className="inline-flex items-center gap-2">
            <Eye size={16} />
            Ver no site
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Componente de Prévia do Layout
const LayoutPreview = ({ 
  device, 
  titleText, 
  subtitleText,
  modelParams,
  layoutMode
}: { 
  device: 'mobile' | 'tablet' | 'desktop',
  titleText: string,
  subtitleText: string,
  modelParams: ModelParameters,
  layoutMode: string
}) => {
  // Dimensões baseadas no dispositivo
  const dimensions = {
    mobile: { width: '320px', height: '640px' },
    tablet: { width: '600px', height: '800px' },
    desktop: { width: '100%', height: '600px' }
  };
  
  return (
    <div className="relative bg-black overflow-hidden rounded-lg border border-gray-700 mx-auto"
      style={{ 
        width: dimensions[device].width, 
        height: dimensions[device].height 
      }}
    >
      {/* Sobreposição de grid para modo de edição */}
      {layoutMode === "edit" && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="h-full w-full grid grid-cols-4 grid-rows-6 gap-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border border-purple-500/20 bg-purple-500/5 flex items-center justify-center">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Simulação do modelo 3D */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-56 h-56 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 animate-pulse blur-xl"></div>
      </div>
      
      {/* Título centralizado */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className={`
          font-bold tracking-tighter text-red-600 leading-none opacity-90 text-center px-4
          ${device === 'mobile' ? 'text-4xl' : device === 'tablet' ? 'text-5xl' : 'text-7xl'}
        `}>
          {titleText}
        </h1>
      </div>
      
      {/* Texto inferior */}
      <div className={`
        absolute ${device === 'mobile' ? 'bottom-16 mx-6' : 'bottom-8 left-8'} max-w-xs
      `}>
        <p className={`
          uppercase tracking-widest text-white/80
          ${device === 'mobile' ? 'text-xs' : 'text-sm'}
        `}>
          {subtitleText}
        </p>
      </div>
      
      {/* Admin link */}
      <div className={`
        absolute top-4 right-4
      `}>
        <div className="px-2 py-1 bg-black/70 rounded-md text-white text-xs border border-white/10">
          Admin
        </div>
      </div>
    </div>
  );
};

export default LayoutTab;
