import { Controller, Post, Body, Param } from "@nestjs/common";
import { BookingOperationsService } from "./booking-operations.service";
import { CheckInDto } from "./dto/check-in.dto";
import { CheckOutDto } from "./dto/check-out.dto";

/**
 * CONTROLLER: BookingOperationsController
 * MỤC ĐÍCH: Xử lý HTTP requests cho Check-in và Check-out operations
 * ROUTE: /api/v2/booking-operations
 */
@Controller("booking-operations")
export class BookingOperationsController {
  constructor(private readonly bookingOperationsService: BookingOperationsService) {}

  /**
   * POST /api/v2/booking-operations/:bookingId/check-in
   * Thực hiện check-in cho booking
   */
  @Post(":bookingId/check-in")
  checkIn(@Param("bookingId") bookingId: string, @Body() checkInDto: CheckInDto) {
    return this.bookingOperationsService.checkIn(bookingId, checkInDto);
  }

  /**
   * POST /api/v2/booking-operations/:bookingId/check-out
   * Thực hiện check-out cho booking
   */
  @Post(":bookingId/check-out")
  checkOut(@Param("bookingId") bookingId: string, @Body() checkOutDto: CheckOutDto) {
    return this.bookingOperationsService.checkOut(bookingId, checkOutDto);
  }
}

