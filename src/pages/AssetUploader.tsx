
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ArrowLeft, Upload, FileAxis3d, Image } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderUploader } from "@/components/file-uploader";

const AssetUploader = () => {
  useEffect(() => {
    document.title = "Uploader de Referências";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-black/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-purple-400 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl md:text-2xl font-semibold">Uploader de Referências</h1>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto p-4 md:p-6">
        <div className="glass-morphism p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Upload className="text-purple-400" size={24} />
            Uploader de Referências
          </h2>
          <p className="text-gray-400 mb-6">
            Carregue pastas e arquivos que podem ser usados como referência para gerar a aplicação.
            Suporta modelos 3D, texturas, imagens e outros recursos.
          </p>

          <Tabs defaultValue="uploader" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="uploader" className="flex items-center gap-2">
                <Upload size={16} />
                Uploader
              </TabsTrigger>
              <TabsTrigger value="references" className="flex items-center gap-2">
                <FileAxis3d size={16} />
                Referências
              </TabsTrigger>
            </TabsList>
            <TabsContent value="uploader">
              <FolderUploader />
            </TabsContent>
            <TabsContent value="references">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <FileAxis3d size={18} className="text-purple-400" />
                    Modelos 3D
                  </h3>
                  <Separator className="mb-3 bg-gray-700" />
                  <p className="text-gray-400 text-sm">
                    Carregue modelos 3D nos formatos: .glb, .gltf, .obj, .fbx
                  </p>
                  <div className="mt-4 bg-gray-900/50 rounded p-4 flex items-center justify-center h-40">
                    <p className="text-gray-500 text-center">
                      Nenhum modelo 3D carregado
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Image size={18} className="text-blue-400" />
                    Texturas
                  </h3>
                  <Separator className="mb-3 bg-gray-700" />
                  <p className="text-gray-400 text-sm">
                    Carregue texturas e mapas: difuso, normal, roughness, metalness
                  </p>
                  <div className="mt-4 bg-gray-900/50 rounded p-4 flex items-center justify-center h-40">
                    <p className="text-gray-500 text-center">
                      Nenhuma textura carregada
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default AssetUploader;
