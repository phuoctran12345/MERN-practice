import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";

// Import các modules mới
import { RoomsModule } from "./rooms/rooms.module";
import { ServiceRequestsModule } from "./service-requests/service-requests.module";
import { BookingOperationsModule } from "./booking-operations/booking-operations.module";
import { PromotionsModule } from "./promotions/promotions.module";
import { PricingModule } from "./pricing/pricing.module";
import { EmployeesModule } from "./employees/employees.module";

/**
 * MODULE: AppModule (NestJS Root Module)
 * MỤC ĐÍCH: Kết nối tất cả NestJS modules
 */
@Module({
  imports: [
    // Config module (global)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB connection (sử dụng chung connection string với Express)
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING || ""),

    // Feature modules
    RoomsModule,
    ServiceRequestsModule,
    BookingOperationsModule,
    PromotionsModule,
    PricingModule,
    EmployeesModule,
  ],
})
export class AppModule {}

