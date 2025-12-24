import api from './api';

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}

export interface CreateBookingDto {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  services?: string[];
}

export const bookingService = {
  // Get all bookings
  getAll: () => api.get<{ bookings: Booking[] }>('/bookings'),
  
  // Get booking by ID
  getById: (id: string) => api.get<{ booking: Booking }>(`/bookings/${id}`),
  
  // Create new booking
  create: (data: CreateBookingDto) => api.post<{ booking: Booking }>('/bookings', data),
  
  // Update booking
  update: (id: string, data: Partial<CreateBookingDto>) => 
    api.put<{ booking: Booking }>(`/bookings/${id}`, data),
  
  // Cancel booking
  cancel: (id: string) => api.delete(`/bookings/${id}`),
  
  // Check-in
  checkIn: (id: string) => api.post<{ booking: Booking }>(`/bookings/${id}/checkin`),
  
  // Check-out
  checkOut: (id: string) => api.post<{ booking: Booking }>(`/bookings/${id}/checkout`),
};

