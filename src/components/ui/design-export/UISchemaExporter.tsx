
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  collectUISchemaData, 
  getItemCounts, 
  getTotalItems 
} from './collectors';
import { 
  AllTabContent, 
  SingleSectionTabContent, 
  CombinedSectionsTabContent 
} from './components/TabContent';

const UISchemaExporter = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Exportar o schema completo para JSON
  const exportAsJson = () => {
    try {
      setIsExporting(true);
      
      const uiSchemaData = collectUISchemaData();
      
      // Formatando para JSON com indentação para melhor legibilidade
      const jsonData = JSON.stringify({
        name: "JESTFLY UI/UX Schema",
        version: "1.0",
        description: "Documentação completa da interface do JESTFLY",
        exportDate: new Date().toISOString(),
        sections: uiSchemaData
      }, null, 2);
      
      // Criando blob e iniciando download
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'jestfly-ui-schema.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Schema UI/UX exportado com sucesso');
    } catch (error) {
      console.error('Erro ao exportar schema UI/UX:', error);
      toast.error('Falha ao exportar schema UI/UX');
    } finally {
      setIsExporting(false);
    }
  };
  
  const schemaData = collectUISchemaData();
  const itemCounts = getItemCounts();
  const totalItems = getTotalItems();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">UI/UX Schema Exporter</h2>
          <p className="text-sm text-white/70">
            Exporte a documentação completa da interface JESTFLY ({totalItems} itens)
          </p>
        </div>
        
        <Button
          onClick={exportAsJson}
          disabled={isExporting}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isExporting ? (
            <>Exportando...</>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar UI Schema
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-black/20 border border-white/10">
          <TabsTrigger value="all">Todos ({totalItems})</TabsTrigger>
          <TabsTrigger value="typography">Tipografia ({itemCounts.typography})</TabsTrigger>
          <TabsTrigger value="colors">Cores ({itemCounts.colors})</TabsTrigger>
          <TabsTrigger value="components">Componentes ({itemCounts.components})</TabsTrigger>
          <TabsTrigger value="glass">Glassmorfismo ({itemCounts.glassmorphism})</TabsTrigger>
          <TabsTrigger value="effects">Efeitos ({itemCounts.effects})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <AllTabContent 
            schemaData={schemaData} 
            isExporting={isExporting} 
            exportAsJson={exportAsJson} 
          />
        </TabsContent>
        
        <TabsContent value="typography" className="mt-4">
          <SingleSectionTabContent section={schemaData.typography} />
        </TabsContent>
        
        <TabsContent value="colors" className="mt-4">
          <SingleSectionTabContent section={schemaData.colors} />
        </TabsContent>
        
        <TabsContent value="components" className="mt-4">
          <SingleSectionTabContent section={schemaData.components} />
        </TabsContent>
        
        <TabsContent value="glass" className="mt-4">
          <SingleSectionTabContent section={schemaData.glassmorphism} />
        </TabsContent>
        
        <TabsContent value="effects" className="mt-4">
          <CombinedSectionsTabContent 
            sections={[schemaData.effects, schemaData.animations]}
            title="Efeitos e Animações"
            description="Efeitos visuais, animações e transições"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UISchemaExporter;
