
import React from 'react';
import BookingImage from '../BookingImages';
import { BookingTypeIcon } from '../BookingIcons';

interface BookingTypeSelectorProps {
  bookingType: 'dj' | 'studio' | 'consultation';
  setBookingType: React.Dispatch<React.SetStateAction<'dj' | 'studio' | 'consultation'>>;
}

const BookingTypeSelector: React.FC<BookingTypeSelectorProps> = ({ 
  bookingType, 
  setBookingType 
}) => {
  return (
    <div className="glass-morphism rounded-xl p-6 mb-8 transform hover:translate-y-[-5px] transition-all duration-300">
      <h2 className="text-2xl font-semibold text-gradient mb-4">What would you like to book?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => setBookingType('dj')}
          className={`p-4 rounded-lg border backdrop-blur-md transition-all ${
            bookingType === 'dj' 
              ? 'border-purple-500 bg-purple-900/20' 
              : 'border-white/10 hover:border-purple-500/50 bg-white/5'
          }`}
        >
          <div className="mb-3 h-32 overflow-hidden rounded-md">
            <BookingImage type="dj" className="h-full w-full" />
          </div>
          <div className="flex items-center justify-center mb-2">
            <BookingTypeIcon type="dj" className="text-purple-400" size={28} />
          </div>
          <h3 className="text-lg font-medium">DJ Performance</h3>
          <p className="text-white/70 text-sm mt-1">Book JESTFLY for your event or venue</p>
        </button>
        
        <button 
          onClick={() => setBookingType('studio')}
          className={`p-4 rounded-lg border backdrop-blur-md transition-all ${
            bookingType === 'studio' 
              ? 'border-cyan-500 bg-cyan-900/20' 
              : 'border-white/10 hover:border-cyan-500/50 bg-white/5'
          }`}
        >
          <div className="mb-3 h-32 overflow-hidden rounded-md">
            <BookingImage type="studio" className="h-full w-full" />
          </div>
          <div className="flex items-center justify-center mb-2">
            <BookingTypeIcon type="studio" className="text-cyan-400" size={28} />
          </div>
          <h3 className="text-lg font-medium">Studio Session</h3>
          <p className="text-white/70 text-sm mt-1">Collaborate in the studio on your project</p>
        </button>
        
        <button 
          onClick={() => setBookingType('consultation')}
          className={`p-4 rounded-lg border backdrop-blur-md transition-all ${
            bookingType === 'consultation' 
              ? 'border-pink-500 bg-pink-900/20' 
              : 'border-white/10 hover:border-pink-500/50 bg-white/5'
          }`}
        >
          <div className="mb-3 h-32 overflow-hidden rounded-md">
            <BookingImage type="consultation" className="h-full w-full" />
          </div>
          <div className="flex items-center justify-center mb-2">
            <BookingTypeIcon type="consultation" className="text-pink-400" size={28} />
          </div>
          <h3 className="text-lg font-medium">Consultation</h3>
          <p className="text-white/70 text-sm mt-1">Get advice on your music or event</p>
        </button>
      </div>
    </div>
  );
};

export default BookingTypeSelector;
