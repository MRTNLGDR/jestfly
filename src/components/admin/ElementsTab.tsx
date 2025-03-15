
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Type, Save, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

interface ElementsTabProps {
  titleText: string;
  setTitleText: React.Dispatch<React.SetStateAction<string>>;
  subtitleText: string;
  setSubtitleText: React.Dispatch<React.SetStateAction<string>>;
}

const ElementsTab = ({
  titleText,
  setTitleText,
  subtitleText,
  setSubtitleText
}: ElementsTabProps) => {
  const { toast } = useToast();
  const [localTitle, setLocalTitle] = useState(titleText);
  const [localSubtitle, setLocalSubtitle] = useState(subtitleText);
  const [activePreviewTab, setActivePreviewTab] = useState("mobile");

  // Atualizar estados locais quando as props mudam
  useEffect(() => {
    setLocalTitle(titleText);
    setLocalSubtitle(subtitleText);
  }, [titleText, subtitleText]);

  // Função para salvar as alterações
  const saveChanges = () => {
    setTitleText(localTitle);
    setSubtitleText(localSubtitle);
    
    // Salvar no localStorage
    localStorage.setItem("siteTitle", localTitle);
    localStorage.setItem("siteSubtitle", localSubtitle);
    
    toast({
      title: "Alterações salvas",
      description: "As alterações de texto foram salvas com sucesso."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Type size={24} className="text-blue-400" />
          Textos e Elementos
        </h2>
        <Button onClick={saveChanges} className="bg-blue-600 hover:bg-blue-700">
          <Save size={16} className="mr-2" />
          Salvar Alterações
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Painel de Edição */}
        <div className="space-y-6">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-lg font-medium mb-3">Título Principal</h3>
              
              <div className="space-y-2">
                <Label htmlFor="main-title">Título em destaque</Label>
                <Input
                  id="main-title"
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  placeholder="Digite o título principal"
                  className="bg-gray-900/60 border-gray-700"
                />
                <p className="text-xs text-gray-400">
                  Este é o texto que aparece em destaque no centro da página inicial.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-lg font-medium mb-3">Subtítulo</h3>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Texto secundário</Label>
                <Textarea
                  id="subtitle"
                  value={localSubtitle}
                  onChange={(e) => setLocalSubtitle(e.target.value)}
                  placeholder="Digite o subtítulo"
                  className="bg-gray-900/60 border-gray-700 min-h-[100px]"
                />
                <p className="text-xs text-gray-400">
                  Este texto aparece na parte inferior da página inicial.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Painel de Prévia */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Prévia em Tempo Real</h3>
            
            <Tabs value={activePreviewTab} onValueChange={setActivePreviewTab}>
              <TabsList className="bg-gray-800/60">
                <TabsTrigger value="mobile" className="data-[state=active]:bg-blue-600">
                  Mobile
                </TabsTrigger>
                <TabsTrigger value="desktop" className="data-[state=active]:bg-blue-600">
                  Desktop
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Card className="border-gray-700 bg-black overflow-hidden">
            <CardContent className="p-0">
              <TabsContent value="mobile" className="mt-0">
                <div className="aspect-[9/16] relative bg-black overflow-hidden mx-auto" style={{ maxWidth: "320px" }}>
                  {/* Simulação da tela do dispositivo */}
                  <div className="absolute inset-0 flex flex-col">
                    {/* Título centralizado */}
                    <div className="flex-1 flex items-center justify-center">
                      <h1 className="text-4xl font-bold tracking-tighter text-red-600 leading-none opacity-90 text-center px-4">
                        {localTitle}
                      </h1>
                    </div>
                    
                    {/* Texto inferior */}
                    <div className="mb-16 mx-6">
                      <p className="text-xs uppercase tracking-widest text-white/80">
                        {localSubtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="desktop" className="mt-0">
                <div className="aspect-video relative bg-black overflow-hidden">
                  {/* Simulação da tela desktop */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-6xl font-bold tracking-tighter text-red-600 leading-none opacity-90">
                      {localTitle}
                    </h1>
                  </div>
                  
                  {/* Texto inferior */}
                  <div className="absolute bottom-8 left-8 max-w-xs">
                    <p className="text-sm uppercase tracking-widest text-white/80">
                      {localSubtitle}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
          
          <div className="flex justify-center">
            <Button variant="outline" asChild className="text-sm">
              <Link to="/" className="inline-flex items-center gap-2">
                <Eye size={14} />
                Ver no site completo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementsTab;
