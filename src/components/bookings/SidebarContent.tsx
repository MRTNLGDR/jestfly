
import React from 'react';
import { Clock, Calendar, BookingTypeIcon } from '../../components/BookingIcons';
import BookingImage from '../BookingImages';

interface SidebarContentProps {
  bookingType: 'dj' | 'studio' | 'consultation';
}

const SidebarContent: React.FC<SidebarContentProps> = ({ bookingType }) => {
  return (
    <div className="space-y-6">
      {/* Showcase Image */}
      <div className="rounded-xl overflow-hidden mb-6 transform hover:translate-y-[-5px] transition-all duration-300">
        <BookingImage type={bookingType} className="h-56 w-full" />
      </div>
    
      {/* Booking Info */}
      <div className="glass-morphism rounded-xl p-6 transform hover:translate-y-[-5px] transition-all duration-300">
        <h2 className="text-2xl font-semibold text-gradient mb-4">Booking Information</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <Clock className="h-5 w-5 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-white">Response Time</h3>
              <p className="text-white/70">We typically respond to booking inquiries within 24-48 hours.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-white">Availability</h3>
              <p className="text-white/70">Bookings are subject to availability. We recommend booking at least 4-6 weeks in advance for events.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <BookingTypeIcon type={bookingType} className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="text-lg font-medium text-white">Technical Requirements</h3>
              <p className="text-white/70">For DJ performances, we'll provide a detailed technical rider after your booking is confirmed.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="glass-morphism rounded-xl p-6 transform hover:translate-y-[-5px] transition-all duration-300">
        <h2 className="text-xl font-semibold text-gradient mb-4">What People Say</h2>
        <div className="space-y-4">
          <div className="p-4 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
            <p className="text-white/80 italic">"JESTFLY brought an incredible energy to our corporate event. The fusion of visual art and music was unlike anything we've experienced before."</p>
            <p className="text-white/60 text-sm mt-2">— Alex Chen, Event Director</p>
          </div>
          <div className="p-4 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
            <p className="text-white/80 italic">"The studio session with JESTFLY transformed our track into something truly special. Professional, creative, and inspiring."</p>
            <p className="text-white/60 text-sm mt-2">— SoundWave Collective</p>
          </div>
        </div>
      </div>
      
      {/* FAQ */}
      <div className="glass-morphism rounded-xl p-6 transform hover:translate-y-[-5px] transition-all duration-300">
        <h2 className="text-xl font-semibold text-gradient mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg">
            <h3 className="text-white/90 font-medium">What areas do you serve?</h3>
            <p className="text-white/70 text-sm mt-1">We're available for bookings worldwide, with additional travel fees for locations outside our base city.</p>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg">
            <h3 className="text-white/90 font-medium">What is your cancellation policy?</h3>
            <p className="text-white/70 text-sm mt-1">Cancellations made 14+ days before the event receive a full refund. Less than 14 days notice will incur a fee.</p>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg">
            <h3 className="text-white/90 font-medium">Do you offer custom music production?</h3>
            <p className="text-white/70 text-sm mt-1">Yes! Book a studio session or consultation to discuss your project's needs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarContent;
