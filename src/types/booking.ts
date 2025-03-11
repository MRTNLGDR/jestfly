
export type BookingFormData = {
  bookingType: 'dj' | 'studio' | 'consulting';
  date: Date;
  startTime: string;
  endTime: string;
  details: string;
  location?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
};

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export type Booking = BookingFormData & {
  id: string;
  userId: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
};
