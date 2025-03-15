
/**
 * Formats a file size in bytes to a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Returns an icon type based on the file type
 */
export const getFileIcon = (fileType: string) => {
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
