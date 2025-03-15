
import React from 'react';

interface CoverImageProps {
  coverImage?: string;
  displayName: string;
}

const CoverImage: React.FC<CoverImageProps> = ({ coverImage, displayName }) => {
  return (
    <div className="h-48 md:h-64 w-full relative bg-gradient-to-r from-purple-900 to-blue-900 rounded-b-xl overflow-hidden">
      {coverImage && (
        <img 
          src={coverImage} 
          alt={`Capa de ${displayName}`}
          className="w-full h-full object-cover"
        />
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    </div>
  );
};

export default CoverImage;
