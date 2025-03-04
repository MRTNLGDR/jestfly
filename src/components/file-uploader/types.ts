
export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  data: File;
  url: string;
}

export interface DirectoryInputProps {
  webkitdirectory: string;
  directory: string;
}
