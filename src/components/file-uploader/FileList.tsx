
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileIcon, Trash2 } from "lucide-react";
import { UploadedFile } from "./types";
import { formatFileSize } from "./utils";

interface FileListProps {
  uploadedFiles: UploadedFile[];
  removeFile: (index: number) => void;
  clearAllFiles: () => void;
}

export const FileList = ({ uploadedFiles, removeFile, clearAllFiles }: FileListProps) => {
  if (uploadedFiles.length === 0) {
    return null;
  }

  return (
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
  );
};
