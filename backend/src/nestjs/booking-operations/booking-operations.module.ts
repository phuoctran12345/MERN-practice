import { Module } from "@nestjs/common";
import { BookingOperationsController } from "./booking-operations.controller";
import { BookingOperationsService } from "./booking-operations.service";
import { ServiceRequestsModule } from "../service-requests/service-requests.module";

/**
 * MODULE: BookingOperationsModule
 * MỤC ĐÍCH: Module xử lý Check-in và Check-out operations (NestJS)
 */
@Module({
  imports: [ServiceRequestsModule], // Import để sử dụng ServiceRequestsService
  controllers: [BookingOperationsController],
  providers: [BookingOperationsService],
  exports: [BookingOperationsService],
})
export class BookingOperationsModule {}

