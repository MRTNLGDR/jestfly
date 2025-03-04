
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AssetUploader: React.FC = () => {
  const { toast } = useToast();
  
  const handleUpload = () => {
    toast({
      title: "Upload em desenvolvimento",
      description: "O sistema de upload de assets está em desenvolvimento."
    });
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Gerenciador de Assets</h1>
      
      <Card className="bg-black/20 border-white/10 text-white backdrop-blur-md">
        <CardHeader>
          <CardTitle>Upload de Assets</CardTitle>
          <CardDescription className="text-white/60">
            Faça upload de imagens, áudios e outros arquivos para usar no JESTFLY.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center">
            <p className="mb-4 text-white/60">Arraste arquivos aqui ou clique para selecionar</p>
            <Button onClick={handleUpload}>Selecionar Arquivos</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetUploader;
