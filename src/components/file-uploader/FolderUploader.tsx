
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UploadedFile } from "./types";
import { UploadArea } from "./UploadArea";
import { FileList } from "./FileList";

const FolderUploader = () => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

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

  return (
    <div className="w-full space-y-4">
      <Card className="border-dashed border-2 border-gray-300 bg-black/20">
        <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
          <UploadArea
            isUploading={isUploading}
            uploadComplete={uploadComplete}
            handleFileChange={handleFileChange}
            setUploadComplete={setUploadComplete}
          />
        </CardContent>
      </Card>

      <FileList 
        uploadedFiles={uploadedFiles}
        removeFile={removeFile}
        clearAllFiles={clearAllFiles}
      />
    </div>
  );
};

export default FolderUploader;
