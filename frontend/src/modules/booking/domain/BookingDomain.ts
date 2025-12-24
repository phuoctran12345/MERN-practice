/**
 * Booking Domain - Business Logic Layer
 * Chứa logic nghiệp vụ cho Booking module
 */

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface Booking {
  id: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  checkIn: Date;
  checkOut: Date;
}

export class BookingDomain {
  /**
   * Tính tổng tiền đặt phòng
   */
  calculateTotal(roomPrice: number, nights: number, services: Service[] = []): number {
    const roomTotal = roomPrice * nights;
    const servicesTotal = services.reduce((sum, service) => sum + service.price, 0);
    return roomTotal + servicesTotal;
  }

  /**
   * Validate ngày check-in và check-out
   */
  validateBookingDates(checkIn: Date, checkOut: Date): { valid: boolean; error: string | null } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return { valid: false, error: 'Ngày check-in không thể là quá khứ' };
    }

    if (checkOut <= checkIn) {
      return { valid: false, error: 'Ngày check-out phải sau ngày check-in' };
    }

    return { valid: true, error: null };
  }

  /**
   * Kiểm tra có thể hủy đặt phòng không
   */
  canCancel(booking: Booking): boolean {
    // Chỉ có thể hủy nếu chưa check-in
    const allowedStatuses: Booking['status'][] = ['pending', 'confirmed'];
    return allowedStatuses.includes(booking.status);
  }

  /**
   * Tính số đêm
   */
  calculateNights(checkIn: Date, checkOut: Date): number {
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Kiểm tra có thể check-in không
   */
  canCheckIn(booking: Booking): { canCheckIn: boolean; reason: string | null } {
    if (booking.status !== 'confirmed') {
      return { canCheckIn: false, reason: 'Đặt phòng chưa được xác nhận' };
    }

    const checkInDate = new Date(booking.checkIn);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkInDate.setHours(0, 0, 0, 0);

    if (checkInDate > today) {
      return { canCheckIn: false, reason: 'Chưa đến ngày check-in' };
    }

    return { canCheckIn: true, reason: null };
  }

  /**
   * Kiểm tra có thể check-out không
   */
  canCheckOut(booking: Booking): { canCheckOut: boolean; reason: string | null } {
    if (booking.status !== 'checked_in') {
      return { canCheckOut: false, reason: 'Khách chưa check-in' };
    }

    return { canCheckOut: true, reason: null };
  }
}

// Export singleton instance
export const bookingDomain = new BookingDomain();

