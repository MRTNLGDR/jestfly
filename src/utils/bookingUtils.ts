
// Utility functions for the booking page

// Get the right gradient based on booking type
export const getGradientClass = (bookingType: 'dj' | 'studio' | 'consultation') => {
  switch(bookingType) {
    case 'dj':
      return 'from-purple-600/20 to-blue-600/20';
    case 'studio':
      return 'from-cyan-600/20 to-blue-600/20';
    case 'consultation':
      return 'from-pink-600/20 to-purple-600/20';
  }
};

// Get button gradient based on booking type
export const getButtonGradient = (bookingType: 'dj' | 'studio' | 'consultation') => {
  switch(bookingType) {
    case 'dj':
      return 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700';
    case 'studio':
      return 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700';
    case 'consultation':
      return 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700';
  }
};
