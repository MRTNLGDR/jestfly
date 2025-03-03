
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  Download, 
  Copy, 
  Trash, 
  CheckCircle2, 
  Plus, 
  Type, 
  Loader2, 
  ExternalLink 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Font {
  id: string;
  name: string;
  url: string;
  preview?: string;
  fallback?: string;
  type: 'google' | 'custom';
  created_at: string;
  weights?: string[];
}

const FontsTab = () => {
  const { toast } = useToast();
  const [fonts, setFonts] = useState<Font[]>([]);
  const [selectedFont, setSelectedFont] = useState<Font | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingFont, setUploadingFont] = useState(false);
  const [activeTab, setActiveTab] = useState<"google" | "custom">("google");
  const [googleFontName, setGoogleFontName] = useState("");
  const [googleFontUrl, setGoogleFontUrl] = useState("");
  const [googleFontWeights, setGoogleFontWeights] = useState("400,700");
  const [customFontName, setCustomFontName] = useState("");
  const [customFontFallback, setCustomFontFallback] = useState("sans-serif");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentSiteFont, setCurrentSiteFont] = useState("");
  const [previewText, setPreviewText] = useState("AaBbCcDdEeFfGg 1234567890");
  const [saving, setSaving] = useState(false);
  
  // Carregar fontes do banco de dados
  useEffect(() => {
    const fetchFonts = async () => {
      try {
        setLoading(true);
        // Substituir por uma tabela real quando estiver disponível
        // Exemplo simulado de dados
        const mockFonts: Font[] = [
          {
            id: '1',
            name: 'Roboto',
            url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
            type: 'google',
            created_at: new Date().toISOString(),
            weights: ['400', '700']
          },
          {
            id: '2',
            name: 'Open Sans',
            url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap',
            type: 'google',
            created_at: new Date().toISOString(),
            weights: ['400', '600', '700']
          },
          {
            id: '3',
            name: 'Lato',
            url: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
            type: 'google',
            created_at: new Date().toISOString(),
            weights: ['300', '400', '700']
          }
        ];
        
        setFonts(mockFonts);
        
        // Carregar a fonte atual do site
        const siteFont = localStorage.getItem("siteFont") || "Roboto";
        setCurrentSiteFont(siteFont);
        
      } catch (error) {
        console.error("Erro ao carregar fontes:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar fontes",
          description: "Não foi possível carregar as fontes disponíveis."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFonts();
  }, [toast]);

  // Adicionar fonte do Google
  const addGoogleFont = () => {
    if (!googleFontName.trim() || !googleFontUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha o nome e a URL da fonte do Google."
      });
      return;
    }
    
    // Verificar se a URL é válida (exemplo básico)
    if (!googleFontUrl.includes('fonts.googleapis.com')) {
      toast({
        variant: "destructive",
        title: "URL inválida",
        description: "Por favor, insira uma URL válida do Google Fonts."
      });
      return;
    }
    
    setSaving(true);
    
    // Simulação de salvamento
    setTimeout(() => {
      const newFont: Font = {
        id: Date.now().toString(),
        name: googleFontName,
        url: googleFontUrl,
        type: 'google',
        created_at: new Date().toISOString(),
        weights: googleFontWeights.split(',').map(w => w.trim())
      };
      
      setFonts([newFont, ...fonts]);
      
      // Limpar os campos
      setGoogleFontName("");
      setGoogleFontUrl("");
      setGoogleFontWeights("400,700");
      
      toast({
        title: "Fonte adicionada",
        description: `A fonte ${googleFontName} foi adicionada com sucesso.`
      });
      
      setSaving(false);
    }, 1000);
  };
  
  // Upload de fonte customizada
  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!customFontName.trim()) {
      toast({
        variant: "destructive",
        title: "Nome da fonte ausente",
        description: "Por favor, informe o nome da fonte antes de fazer o upload."
      });
      return;
    }
    
    // Verificar se é um arquivo de fonte válido
    const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo TTF, OTF, WOFF ou WOFF2."
      });
      return;
    }
    
    setUploadingFont(true);
    
    // Simulação de upload
    setTimeout(() => {
      const newFont: Font = {
        id: Date.now().toString(),
        name: customFontName,
        url: URL.createObjectURL(file), // Na produção, seria o URL de uma fonte armazenada
        type: 'custom',
        fallback: customFontFallback,
        created_at: new Date().toISOString()
      };
      
      setFonts([newFont, ...fonts]);
      
      // Limpar os campos
      setCustomFontName("");
      setCustomFontFallback("sans-serif");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast({
        title: "Fonte carregada",
        description: `A fonte ${customFontName} foi carregada com sucesso.`
      });
      
      setUploadingFont(false);
    }, 1500);
  };
  
  // Aplicar fonte ao site
  const applyFont = (font: Font) => {
    setSaving(true);
    
    // Aplicar folha de estilo se for do Google
    if (font.type === 'google') {
      // Verificar se o link já existe
      const existingLink = document.querySelector(`link[href="${font.url}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = font.url;
        document.head.appendChild(link);
      }
    }
    
    // Salvar no localStorage
    localStorage.setItem("siteFont", font.name);
    setCurrentSiteFont(font.name);
    
    // Aplicar a fonte ao elemento root
    document.documentElement.style.setProperty('--font-primary', `'${font.name}', ${font.fallback || 'sans-serif'}`);
    
    setTimeout(() => {
      toast({
        title: "Fonte aplicada",
        description: `A fonte ${font.name} foi aplicada ao site.`
      });
      setSaving(false);
    }, 800);
  };
  
  // Remover fonte
  const removeFont = (fontId: string) => {
    const fontToRemove = fonts.find(f => f.id === fontId);
    if (!fontToRemove) return;
    
    setFonts(fonts.filter(f => f.id !== fontId));
    
    toast({
      title: "Fonte removida",
      description: `A fonte ${fontToRemove.name} foi removida com sucesso.`
    });
    
    // Se a fonte removida era a atual, resetar para a primeira disponível
    if (currentSiteFont === fontToRemove.name && fonts.length > 1) {
      const nextFont = fonts.find(f => f.id !== fontId);
      if (nextFont) {
        applyFont(nextFont);
      }
    }
  };
  
  // Gerar CSS para @font-face (apenas para exemplo)
  const generateFontFaceCSS = (font: Font) => {
    if (font.type === 'google') return '';
    
    return `@font-face {
  font-family: '${font.name}';
  src: url('${font.url}') format('${font.url.includes('.woff2') ? 'woff2' : 
    font.url.includes('.woff') ? 'woff' :
    font.url.includes('.otf') ? 'opentype' : 'truetype'}');
  font-weight: normal;
  font-style: normal;
}`;
  };
  
  // Copiar CSS para @font-face
  const copyFontFaceCSS = (font: Font) => {
    const css = generateFontFaceCSS(font);
    navigator.clipboard.writeText(css);
    
    toast({
      title: "CSS copiado",
      description: "O código CSS foi copiado para a área de transferência."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Type className="text-purple-400" size={24} />
          Gerenciador de Fontes
        </h2>
      </div>
      
      <Card className="bg-gray-800/30 border-gray-700">
        <CardHeader>
          <CardTitle>Prévia da Fonte</CardTitle>
          <CardDescription>Veja como a fonte atual é exibida no site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="preview-text">Texto de exemplo</Label>
              <Input 
                id="preview-text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="bg-gray-700/50 border-gray-600"
              />
            </div>
            
            <div className="p-6 bg-gray-900/50 rounded-md border border-gray-700">
              <p className="text-3xl mb-4" style={{fontFamily: `'${currentSiteFont}', sans-serif`}}>
                {previewText || "AaBbCcDdEeFfGg 1234567890"}
              </p>
              <p className="text-xl mb-4" style={{fontFamily: `'${currentSiteFont}', sans-serif`}}>
                {previewText || "AaBbCcDdEeFfGg 1234567890"}
              </p>
              <p className="text-base" style={{fontFamily: `'${currentSiteFont}', sans-serif`}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Fonte atual:</span>
              <span className="font-medium text-white">{currentSiteFont}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/30 border-gray-700">
        <CardHeader>
          <CardTitle>Adicionar Nova Fonte</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "google" | "custom")}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-900/50">
              <TabsTrigger value="google">Google Fonts</TabsTrigger>
              <TabsTrigger value="custom">Upload de Fonte</TabsTrigger>
            </TabsList>
            
            <TabsContent value="google" className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="google-font-name">Nome da Fonte</Label>
                  <Input 
                    id="google-font-name" 
                    placeholder="Ex: Roboto, Open Sans, etc." 
                    value={googleFontName}
                    onChange={(e) => setGoogleFontName(e.target.value)}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="google-font-url">URL do Google Fonts</Label>
                  <Input 
                    id="google-font-url" 
                    placeholder="https://fonts.googleapis.com/css2?family=..." 
                    value={googleFontUrl}
                    onChange={(e) => setGoogleFontUrl(e.target.value)}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="google-font-weights">Pesos da Fonte (separados por vírgula)</Label>
                  <Input 
                    id="google-font-weights" 
                    placeholder="400,700" 
                    value={googleFontWeights}
                    onChange={(e) => setGoogleFontWeights(e.target.value)}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" className="bg-gray-700/50 border-gray-600 hover:bg-gray-600">
                    <ExternalLink size={16} className="mr-2" />
                    Abrir Google Fonts
                  </Button>
                  <Button 
                    onClick={addGoogleFont} 
                    disabled={saving || !googleFontName || !googleFontUrl}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus size={16} className="mr-2" />}
                    Adicionar Fonte
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-amber-500/10 border border-amber-600/30 rounded-md text-amber-200 text-sm">
                <p>Para usar o Google Fonts:</p>
                <ol className="list-decimal ml-4 mt-2 space-y-1">
                  <li>Visite <a href="https://fonts.google.com" className="underline" target="_blank" rel="noreferrer">fonts.google.com</a></li>
                  <li>Selecione uma fonte e os pesos desejados</li>
                  <li>Clique em "Select this style"</li>
                  <li>Copie o URL da tag link gerada</li>
                  <li>Cole na caixa acima e forneça um nome para a fonte</li>
                </ol>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="custom-font-name">Nome da Fonte</Label>
                  <Input 
                    id="custom-font-name" 
                    placeholder="Ex: MinhaFonte" 
                    value={customFontName}
                    onChange={(e) => setCustomFontName(e.target.value)}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="custom-font-fallback">Família Fallback</Label>
                  <Input 
                    id="custom-font-fallback" 
                    placeholder="sans-serif" 
                    value={customFontFallback}
                    onChange={(e) => setCustomFontFallback(e.target.value)}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Arquivo da Fonte</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-700/50 border-gray-600 hover:bg-gray-600 flex-1"
                    >
                      <Upload size={16} className="mr-2" />
                      Selecionar Arquivo (.ttf, .otf, .woff, .woff2)
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".ttf,.otf,.woff,.woff2"
                      className="hidden"
                      onChange={handleFontUpload}
                    />
                  </div>
                </div>
                
                {uploadingFont && (
                  <div className="flex items-center gap-3 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Fazendo upload do arquivo...</span>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-blue-500/10 border border-blue-600/30 rounded-md text-blue-200 text-sm">
                <p>Dicas para upload de fontes:</p>
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  <li>É recomendado o uso do formato WOFF2, que é mais compacto</li>
                  <li>Certifique-se de ter direitos para usar a fonte em seu site</li>
                  <li>Para melhor suporte entre navegadores, forneça múltiplos formatos da fonte</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/30 border-gray-700">
        <CardHeader>
          <CardTitle>Biblioteca de Fontes</CardTitle>
          <CardDescription>Gerencie as fontes disponíveis para seu site</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : fonts.length === 0 ? (
            <div className="text-center py-12 bg-gray-900/30 rounded-lg border border-gray-700">
              <Type size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-lg text-gray-400">Nenhuma fonte adicionada</p>
              <p className="text-sm text-gray-500 mt-2">
                Adicione fontes do Google ou faça upload de arquivos de fonte.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {fonts.map(font => (
                <div 
                  key={font.id}
                  className={`p-5 rounded-lg border ${currentSiteFont === font.name ? 'bg-purple-600/20 border-purple-500/50' : 'bg-gray-900/40 border-gray-700'}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg" style={{fontFamily: `'${font.name}', ${font.fallback || 'sans-serif'}`}}>
                        {font.name}
                      </h3>
                      {currentSiteFont === font.name && (
                        <span className="px-2 py-1 bg-purple-600/80 text-white text-xs rounded-full flex items-center">
                          <CheckCircle2 size={12} className="mr-1" /> Ativa
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {font.type === 'custom' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => copyFontFaceCSS(font)}
                          className="h-8 bg-gray-800/50 border-gray-600 hover:bg-gray-700"
                        >
                          <Copy size={14} className="mr-1" />
                          CSS
                        </Button>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => removeFont(font.id)}
                        className="h-8 hover:bg-red-900/30 hover:text-red-400 text-gray-400 bg-gray-800/50 border-gray-600"
                      >
                        <Trash size={14} />
                      </Button>
                      
                      {currentSiteFont !== font.name && (
                        <Button 
                          size="sm"
                          onClick={() => applyFont(font)}
                          className="h-8 bg-purple-600 hover:bg-purple-700"
                          disabled={saving}
                        >
                          {saving ? <Loader2 size={14} className="animate-spin" /> : "Aplicar"}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <div className="p-4 bg-gray-900/80 rounded border border-gray-700">
                      <p className="text-xl" style={{fontFamily: `'${font.name}', ${font.fallback || 'sans-serif'}`}}>
                        AaBbCcDdEeFfGg 1234567890
                      </p>
                      <p className="text-sm mt-2" style={{fontFamily: `'${font.name}', ${font.fallback || 'sans-serif'}`}}>
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                      <span className="px-2 py-1 bg-gray-800 rounded">
                        {font.type === 'google' ? 'Google Font' : 'Fonte Customizada'}
                      </span>
                      
                      {font.weights && font.weights.length > 0 && (
                        <span className="px-2 py-1 bg-gray-800 rounded">
                          Pesos: {font.weights.join(', ')}
                        </span>
                      )}
                      
                      {font.fallback && (
                        <span className="px-2 py-1 bg-gray-800 rounded">
                          Fallback: {font.fallback}
                        </span>
                      )}
                      
                      <span className="px-2 py-1 bg-gray-800 rounded">
                        Adicionado em: {new Date(font.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full p-4 bg-purple-900/20 rounded-md text-sm text-purple-300 border border-purple-700/30">
            <p>As fontes afetam a aparência geral do seu site. Escolha fontes que reflitam a identidade da sua marca e garantam boa legibilidade.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FontsTab;
