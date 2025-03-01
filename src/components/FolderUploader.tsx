
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, FileIcon, Trash2, FolderOpen, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  data: File;
  url: string;
}

const FolderUploader = () => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    setIsUploading(true);
    setUploadComplete(false);
    const files = Array.from(event.target.files);
    
    const newFiles: UploadedFile[] = [];
    
    files.forEach(file => {
      const fileURL = URL.createObjectURL(file);
      
      newFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        data: file,
        url: fileURL
      });
    });
    
    setTimeout(() => {
      setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
      setIsUploading(false);
      setUploadComplete(true);
      
      toast({
        title: "Upload concluído",
        description: `${newFiles.length} arquivo(s) carregado(s) com sucesso.`,
      });
      
      // Reset file input
      if (event.target.files && event.target.value) {
        event.target.value = "";
      }
    }, 1500);
  };

  const handleFolderSelect = () => {
    if (folderInputRef.current) {
      folderInputRef.current.click();
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...uploadedFiles];
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(updatedFiles[index].url);
    
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
    
    toast({
      title: "Arquivo removido",
      description: "O arquivo foi removido da lista.",
    });
  };

  const clearAllFiles = () => {
    // Revoke all object URLs
    uploadedFiles.forEach(file => {
      URL.revokeObjectURL(file.url);
    });
    
    setUploadedFiles([]);
    setUploadComplete(false);
    
    toast({
      title: "Lista limpa",
      description: "Todos os arquivos foram removidos.",
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return 'image';
    } else if (fileType.includes('video')) {
      return 'video';
    } else if (fileType.includes('audio')) {
      return 'audio';
    } else if (fileType.includes('text')) {
      return 'text';
    } else if (fileType.includes('application/json')) {
      return 'json';
    } else if (fileType.includes('application/pdf')) {
      return 'pdf';
    } else if (fileType.includes('model') || fileType.includes('gltf') || fileType.includes('glb')) {
      return '3d';
    }
    return 'unknown';
  };

  return (
    <div className="w-full space-y-4">
      <Card className="border-dashed border-2 border-gray-300 bg-black/20">
        <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="text-gray-400">Processando arquivos...</p>
            </div>
          ) : uploadComplete ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-gray-300">Upload concluído!</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => setUploadComplete(false)}
              >
                Fazer outro upload
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400" />
              <h3 className="text-xl font-medium text-gray-200">Carregue seus arquivos de referência</h3>
              <p className="text-gray-400 text-center">
                Arraste e solte arquivos aqui ou selecione uma pasta completa
              </p>
              
              <div className="flex flex-wrap gap-3 mt-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleFileSelect}
                >
                  <Upload size={16} />
                  Selecionar Arquivos
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleFolderSelect}
                >
                  <FolderOpen size={16} />
                  Selecionar Pasta
                </Button>
              </div>
              
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              
              <input
                type="file"
                multiple
                ref={folderInputRef}
                onChange={handleFileChange}
                webkitdirectory=""
                directory=""
                className="hidden"
              />
              
              <p className="text-xs text-gray-500 mt-2">
                Formatos suportados: imagens, vídeos, áudio, texto, PDF, modelos 3D
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white/90">
                Arquivos Carregados ({uploadedFiles.length})
              </h3>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={clearAllFiles}
                className="text-xs"
              >
                <Trash2 size={14} className="mr-1" /> Limpar Tudo
              </Button>
            </div>
            
            <Separator className="mb-4 bg-gray-700" />
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {uploadedFiles.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <div className="h-10 w-10 rounded overflow-hidden bg-gray-700 flex-shrink-0">
                        <img 
                          src={file.url} 
                          alt={file.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <FileIcon size={20} className="text-gray-400" />
                      </div>
                    )}
                    
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-white truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                    onClick={() => removeFile(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FolderUploader;
