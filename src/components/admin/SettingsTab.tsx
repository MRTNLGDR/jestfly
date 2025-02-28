
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Configurações Gerais</h2>
      <p className="text-gray-400">Gerencie as configurações gerais do site.</p>
      
      <div className="p-4 bg-gray-800/50 rounded-lg">
        <div className="space-y-4">
          <div>
            <Label htmlFor="siteName">Nome do Site</Label>
            <Input 
              id="siteName"
              defaultValue="JESTFLY"
              className="mt-1 bg-gray-700/50 border-gray-600"
            />
          </div>
          
          <div>
            <Label htmlFor="siteDescription">Descrição do Site</Label>
            <Input 
              id="siteDescription"
              defaultValue="Um site de visualização 3D com modelos interativos cristalinos"
              className="mt-1 bg-gray-700/50 border-gray-600"
            />
          </div>
          
          <Separator className="my-4 bg-gray-700" />
          
          <div>
            <Label htmlFor="metaTitle">Título da Meta Tag</Label>
            <Input 
              id="metaTitle"
              defaultValue="JESTFLY - Visualizações 3D Cristalinas"
              className="mt-1 bg-gray-700/50 border-gray-600"
            />
          </div>
          
          <div>
            <Label htmlFor="metaDescription">Descrição da Meta Tag</Label>
            <Input 
              id="metaDescription"
              defaultValue="Explore visualizações 3D cristalinas com efeitos de refração e reflexão perfeitos"
              className="mt-1 bg-gray-700/50 border-gray-600"
            />
          </div>
          
          <div>
            <Label htmlFor="googleAnalytics">ID do Google Analytics</Label>
            <Input 
              id="googleAnalytics"
              placeholder="UA-XXXXXXXXX-X"
              className="mt-1 bg-gray-700/50 border-gray-600"
            />
          </div>
        </div>
        
        <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
          Salvar Configurações Gerais
        </Button>
      </div>
    </div>
  );
};

export default SettingsTab;
