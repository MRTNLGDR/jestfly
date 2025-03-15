
import React from 'react';

interface BookingImageProps {
  type: 'dj' | 'studio' | 'consultation';
  className?: string;
}

const BookingImage: React.FC<BookingImageProps> = ({ type, className = "" }) => {
  const getImagePath = () => {
    switch(type) {
      case 'dj':
        return '/assets/dj-event.jpg';
      case 'studio':
        return '/assets/studio-session.jpg';
      case 'consultation':
        return '/assets/consultation.jpg';
      default:
        return '/assets/placeholder.svg';
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <img 
        src={getImagePath()} 
        alt={`${type} booking`} 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        onError={(e) => {
          // Fallback for placeholder
          (e.target as HTMLImageElement).src = '/assets/placeholder.svg';
        }}
      />
    </div>
  );
};

export default BookingImage;
