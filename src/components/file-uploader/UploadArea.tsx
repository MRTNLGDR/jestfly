
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FolderOpen, Check } from "lucide-react";
import { DirectoryInputProps } from "./types";

interface UploadAreaProps {
  isUploading: boolean;
  uploadComplete: boolean;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setUploadComplete: (value: boolean) => void;
}

export const UploadArea = ({ 
  isUploading, 
  uploadComplete, 
  handleFileChange, 
  setUploadComplete 
}: UploadAreaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFolderSelect = () => {
    if (folderInputRef.current) {
      folderInputRef.current.click();
    }
  };

  if (isUploading) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="text-gray-400">Processando arquivos...</p>
      </div>
    );
  }

  if (uploadComplete) {
    return (
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
    );
  }

  return (
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
      
      {/* Cast input element to accept directory attributes */}
      <input
        type="file"
        multiple
        ref={folderInputRef}
        onChange={handleFileChange}
        {...{webkitdirectory: "", directory: ""} as DirectoryInputProps}
        className="hidden"
      />
      
      <p className="text-xs text-gray-500 mt-2">
        Formatos suportados: imagens, vídeos, áudio, texto, PDF, modelos 3D
      </p>
    </>
  );
};
