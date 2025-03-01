
import React from 'react';
import { Music, Headphones, Users, CalendarCheck, Clock, MapPin, MessageSquare } from 'lucide-react';

interface BookingIconProps {
  type: 'dj' | 'studio' | 'consultation';
  size?: number;
  className?: string;
}

export const BookingTypeIcon: React.FC<BookingIconProps> = ({ type, size = 24, className = "" }) => {
  switch(type) {
    case 'dj':
      return <Headphones size={size} className={`glow-purple ${className}`} />;
    case 'studio':
      return <Music size={size} className={`glow-blue ${className}`} />;
    case 'consultation':
      return <MessageSquare size={size} className={`glow-purple ${className}`} />;
    default:
      return null;
  }
};

export const EventIcon: React.FC<BookingIconProps & { name: string }> = ({ name, size = 20, className = "" }) => {
  switch(name) {
    case 'date':
      return <CalendarCheck size={size} className={className} />;
    case 'time':
      return <Clock size={size} className={className} />;
    case 'location':
      return <MapPin size={size} className={className} />;
    case 'attendees':
      return <Users size={size} className={className} />;
    default:
      return null;
  }
};
