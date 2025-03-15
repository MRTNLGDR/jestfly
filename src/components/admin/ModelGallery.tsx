
import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Save, 
  Trash, 
  Eye, 
  Upload, 
  Search,
  MoreHorizontal,
  Copy
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { materialPresets } from '../../types/materialPresets';

interface ModelItem {
  id: string;
  name: string;
  thumbnail: string;
  dateCreated: Date;
  type: 'crystal' | 'custom';
}

const ModelGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [models, setModels] = useState<ModelItem[]>([
    {
      id: '1',
      name: 'Cristal Padrão',
      thumbnail: '/textures/presets/crystal.jpg',
      dateCreated: new Date(2023, 5, 15),
      type: 'crystal'
    },
    {
      id: '2',
      name: 'Diamante Roxo',
      thumbnail: '/textures/presets/holographic.jpg',
      dateCreated: new Date(2023, 6, 22),
      type: 'crystal'
    },
    {
      id: '3',
      name: 'Vidro Neon',
      thumbnail: '/textures/presets/glass.jpg',
      dateCreated: new Date(2023, 7, 10),
      type: 'crystal'
    },
    {
      id: '4',
      name: 'Ouro Metálico',
      thumbnail: '/textures/presets/gold.jpg',
      dateCreated: new Date(2023, 8, 5),
      type: 'crystal'
    }
  ]);
  
  // Filter models based on search query
  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteModel = (id: string) => {
    setModels(models.filter(model => model.id !== id));
  };
  
  const handleDuplicateModel = (model: ModelItem) => {
    const newModel = {
      ...model,
      id: `${model.id}-copy-${Date.now()}`,
      name: `${model.name} (Cópia)`,
      dateCreated: new Date()
    };
    setModels([...models, newModel]);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Buscar modelos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setShowUploadDialog(true)}
        >
          <Upload className="mr-2 h-4 w-4" />
          Novo Modelo
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredModels.map(model => (
          <Card key={model.id} className="glass-morphism overflow-hidden group">
            <div className="aspect-video relative">
              <img 
                src={model.thumbnail} 
                alt={model.name} 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-black/50 backdrop-blur-sm hover:bg-black/70"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="bg-black/50 backdrop-blur-sm hover:bg-black/70"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDuplicateModel(model)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteModel(model.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="font-medium text-sm truncate">{model.name}</h3>
              <p className="text-xs text-gray-400">{model.dateCreated.toLocaleDateString()}</p>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Nenhum modelo encontrado</p>
        </div>
      )}
      
      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Modelo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="model-name">Nome do Modelo</Label>
              <Input id="model-name" placeholder="Ex: Cristal Personalizado" />
            </div>
            
            <div className="space-y-2">
              <Label>Base do Modelo</Label>
              <div className="grid grid-cols-3 gap-2">
                {materialPresets.slice(0, 3).map(preset => (
                  <Card key={preset.id} className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500">
                    <div className="aspect-square relative">
                      <img 
                        src={preset.thumbnail} 
                        alt={preset.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full border-2 border-white" />
                      </div>
                    </div>
                    <div className="p-1">
                      <p className="text-xs truncate text-center">{preset.name}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Arquivos 3D (opcional)</Label>
              <div className="border-2 border-dashed border-gray-400/30 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-400">
                  Arraste e solte arquivos .glb, .gltf ou .obj
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ou
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-purple-600">
              Criar Modelo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModelGallery;
