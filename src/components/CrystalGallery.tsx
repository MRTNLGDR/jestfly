
import React from 'react';

interface ImageWithCrystalProps {
  src: string;
  alt: string;
  crystalPosition?: 'default' | 'bottom-left' | 'center';
}

const ImageWithCrystal: React.FC<ImageWithCrystalProps> = ({ 
  src, 
  alt, 
  crystalPosition = 'default' 
}) => {
  let crystalClass = 'small-crystal';
  if (crystalPosition === 'bottom-left') crystalClass += ' crystal-position-2';
  if (crystalPosition === 'center') crystalClass += ' crystal-position-3';
  
  return (
    <div className="image-container">
      <img src={src} alt={alt} />
      <div className={crystalClass}></div>
    </div>
  );
};

interface CrystalGalleryProps {
  images?: Array<{
    src: string;
    alt: string;
    crystalPosition?: 'default' | 'bottom-left' | 'center';
  }>;
  className?: string;
}

const CrystalGallery: React.FC<CrystalGalleryProps> = ({ 
  images = [
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'default' },
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'bottom-left' },
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'center' }
  ],
  className = ""
}) => {
  return (
    <section className={`gallery ${className}`}>
      {images.map((image, index) => (
        <ImageWithCrystal 
          key={index} 
          src={image.src} 
          alt={image.alt} 
          crystalPosition={image.crystalPosition} 
        />
      ))}
    </section>
  );
};

export default CrystalGallery;
