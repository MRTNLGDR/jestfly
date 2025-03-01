
import React from 'react';
import { Users, Clock, MapPin, MessageSquare, Calendar } from 'lucide-react';
import { BookingTypeIcon } from '../BookingIcons';

interface BookingFormProps {
  bookingType: 'dj' | 'studio' | 'consultation';
  formData: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    location: string;
    details: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  getGradientClass: () => string;
  getButtonGradient: () => string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  bookingType,
  formData,
  handleChange,
  handleSubmit,
  getGradientClass,
  getButtonGradient
}) => {
  return (
    <div className={`glass-morphism rounded-xl border-t border-l border-white/20 p-6 bg-gradient-to-br ${getGradientClass()}`}>
      <h2 className="text-2xl font-semibold text-gradient mb-6 glow-text flex items-center gap-3">
        <BookingTypeIcon type={bookingType} size={28} />
        {bookingType === 'dj' ? 'DJ Booking Request' : 
         bookingType === 'studio' ? 'Studio Session Request' : 
         'Consultation Request'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-white/80 mb-2 flex items-center gap-2">
              <Users size={16} className="text-white/60" />
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 mb-2 flex items-center gap-2">
              <MessageSquare size={16} className="text-white/60" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 mb-2 flex items-center gap-2">
              <Users size={16} className="text-white/60" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/80 mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-white/60" />
              Preferred Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 mb-2 flex items-center gap-2">
              <Clock size={16} className="text-white/60" />
              Preferred Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/80 mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-white/60" />
              {bookingType === 'dj' ? 'Event Location' : 
               bookingType === 'studio' ? 'Studio Location' : 
               'Preferred Meeting Method'}
            </label>
            {bookingType === 'consultation' ? (
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">Select one...</option>
                <option value="zoom">Zoom</option>
                <option value="teams">Microsoft Teams</option>
                <option value="hangouts">Google Meet</option>
                <option value="in-person">In Person</option>
              </select>
            ) : (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-white/80 mb-2 flex items-center gap-2">
            <MessageSquare size={16} className="text-white/60" />
            {bookingType === 'dj' ? 'Event Details' : 
             bookingType === 'studio' ? 'Project Details' : 
             'What would you like to discuss?'}
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            rows={5}
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          className={`px-8 py-3 rounded-full text-white transition-colors ${getButtonGradient()} shadow-lg transform hover:scale-105 transition duration-300 ease-in-out`}
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
