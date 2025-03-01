
import React from 'react';
import { useIsMobile } from '../hooks/use-mobile';

interface ImageWithCrystalProps {
  src: string;
  alt: string;
  crystalPosition?: 'default' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

const ImageWithCrystal: React.FC<ImageWithCrystalProps> = ({ 
  src, 
  alt, 
  crystalPosition = 'default' 
}) => {
  let crystalClass = 'small-crystal';
  if (crystalPosition === 'bottom-left') crystalClass += ' crystal-position-2';
  if (crystalPosition === 'center') crystalClass += ' crystal-position-3';
  if (crystalPosition === 'top-left') crystalClass += ' crystal-position-4';
  if (crystalPosition === 'top-right') crystalClass += ' crystal-position-5';
  if (crystalPosition === 'bottom-right') crystalClass += ' crystal-position-6';
  
  return (
    <div className="image-container relative overflow-hidden rounded-lg">
      <img src={src} alt={alt} className="w-full h-auto object-cover transition-transform hover:scale-105 duration-700" />
      <div className={`${crystalClass} absolute`}></div>
    </div>
  );
};

interface CrystalGalleryProps {
  images?: Array<{
    src: string;
    alt: string;
    crystalPosition?: 'default' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
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
  const isMobile = useIsMobile();
  
  return (
    <section className={`gallery grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 ${className}`}>
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
