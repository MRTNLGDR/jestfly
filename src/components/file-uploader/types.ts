
export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  data: File;
  url: string;
}

// Define a type that includes the non-standard directory attributes
export interface DirectoryInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: string;
  directory?: string;
}
