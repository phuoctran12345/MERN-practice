import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import Booking from "../../models/booking";
import Room from "../../models/room";
import { ServiceRequestsService } from "../service-requests/service-requests.service";
import { CheckInDto } from "./dto/check-in.dto";
import { CheckOutDto } from "./dto/check-out.dto";

/**
 * SERVICE: BookingOperationsService
 * MỤC ĐÍCH: Xử lý business logic cho Check-in và Check-out operations
 */
@Injectable()
export class BookingOperationsService {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  /**
   * FUNCTION: checkIn
   * MỤC ĐÍCH: Thực hiện check-in cho booking
   * VALIDATION:
   * - Booking phải tồn tại
   * - PaymentStatus phải = "paid"
   * - Status phải = "confirmed"
   * - CheckIn date phải đúng ngày hôm nay (hoặc trong quá khứ)
   * - Room phải available (nếu có roomId)
   */
  async checkIn(bookingId: string, checkInDto: CheckInDto) {
    // B1: Tìm booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking với ID ${bookingId} không tồn tại`);
    }

    // B2: Kiểm tra paymentStatus
    if (booking.paymentStatus !== "paid") {
      throw new BadRequestException(
        `Booking chưa thanh toán. PaymentStatus hiện tại: ${booking.paymentStatus}`
      );
    }

    // B3: Kiểm tra status
    if (booking.status !== "confirmed") {
      throw new BadRequestException(
        `Booking phải ở trạng thái "confirmed" để check-in. Status hiện tại: ${booking.status}`
      );
    }

    // B4: Kiểm tra checkIn date (có thể check-in trong ngày hoặc trước đó)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(booking.checkIn);
    checkInDate.setHours(0, 0, 0, 0);

    if (checkInDate > today) {
      throw new BadRequestException(
        `Chưa đến ngày check-in. Ngày check-in: ${checkInDate.toLocaleDateString()}`
      );
    }

    // B5: Nếu có roomId, kiểm tra và update room status
    if (checkInDto.roomId) {
      const room = await Room.findById(checkInDto.roomId);
      if (!room) {
        throw new NotFoundException(`Room với ID ${checkInDto.roomId} không tồn tại`);
      }

      if (room.status !== "AVAILABLE") {
        throw new BadRequestException(
          `Phòng đang ở trạng thái ${room.status}, không thể check-in`
        );
      }

      // Update room status = OCCUPIED
      await Room.findByIdAndUpdate(checkInDto.roomId, { status: "OCCUPIED" });

      // Update booking với roomId
      booking.roomId = checkInDto.roomId;
    }

    // B6: Update booking status = "checked_in" và set checkedInAt
    booking.status = "checked_in";
    booking.checkedInAt = new Date();
    await booking.save();

    return {
      message: "Check-in thành công",
      booking: booking.toObject(),
    };
  }

  /**
   * FUNCTION: checkOut
   * MỤC ĐÍCH: Thực hiện check-out cho booking
   * VALIDATION:
   * - Booking phải tồn tại
   * - Status phải = "checked_in"
   * - Tính tổng chi phí phát sinh (service requests + additional charges)
   * - Update finalTotalCost
   * - Update room status = AVAILABLE
   */
  async checkOut(bookingId: string, checkOutDto: CheckOutDto) {
    // B1: Tìm booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking với ID ${bookingId} không tồn tại`);
    }

    // B2: Kiểm tra status
    if (booking.status !== "checked_in") {
      throw new BadRequestException(
        `Booking phải ở trạng thái "checked_in" để check-out. Status hiện tại: ${booking.status}`
      );
    }

    // B3: Tính tổng chi phí phát sinh từ service requests
    const serviceRequestsTotal = await this.serviceRequestsService.calculateTotalPrice(
      bookingId
    );

    // B4: Tính finalTotalCost = totalCost + serviceRequestsTotal + additionalCharges
    const additionalCharges = checkOutDto.additionalCharges || 0;
    const finalTotalCost = booking.totalCost + serviceRequestsTotal + additionalCharges;

    // B5: Nếu có roomId, update room status = AVAILABLE
    if (booking.roomId) {
      await Room.findByIdAndUpdate(booking.roomId, { status: "AVAILABLE" });
    }

    // B6: Update booking
    booking.status = "completed";
    booking.checkedOutAt = new Date();
    booking.finalTotalCost = finalTotalCost;
    await booking.save();

    // B7: Lấy danh sách service requests để trả về
    const serviceRequests = await this.serviceRequestsService.findByBooking(bookingId);

    return {
      message: "Check-out thành công",
      booking: booking.toObject(),
      summary: {
        originalCost: booking.totalCost,
        serviceRequestsTotal,
        additionalCharges,
        finalTotalCost,
      },
      serviceRequests,
    };
  }
}

