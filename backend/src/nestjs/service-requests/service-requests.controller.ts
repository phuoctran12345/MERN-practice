import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ServiceRequestsService } from "./service-requests.service";
import { CreateServiceRequestDto } from "./dto/create-service-request.dto";
import { UpdateServiceRequestDto } from "./dto/update-service-request.dto";

/**
 * CONTROLLER: ServiceRequestsController
 * MỤC ĐÍCH: Xử lý HTTP requests cho ServiceRequest operations
 * ROUTE: /api/v2/service-requests
 */
@Controller("service-requests")
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  /**
   * POST /api/v2/service-requests
   * Tạo service request mới
   */
  @Post()
  create(@Body() createServiceRequestDto: CreateServiceRequestDto) {
    return this.serviceRequestsService.create(createServiceRequestDto);
  }

  /**
   * GET /api/v2/service-requests?userId=xxx&bookingId=xxx&hotelId=xxx&status=pending
   * Lấy danh sách service requests (có thể filter)
   */
  @Get()
  findAll(
    @Query("userId") userId?: string,
    @Query("bookingId") bookingId?: string,
    @Query("hotelId") hotelId?: string,
    @Query("status") status?: string
  ) {
    return this.serviceRequestsService.findAll(userId, bookingId, hotelId, status);
  }

  /**
   * GET /api/v2/service-requests/booking/:bookingId
   * Lấy tất cả service requests của một booking
   */
  @Get("booking/:bookingId")
  findByBooking(@Param("bookingId") bookingId: string) {
    return this.serviceRequestsService.findByBooking(bookingId);
  }

  /**
   * GET /api/v2/service-requests/booking/:bookingId/total
   * Tính tổng giá của tất cả service requests của một booking
   */
  @Get("booking/:bookingId/total")
  async calculateTotalPrice(@Param("bookingId") bookingId: string) {
    const total = await this.serviceRequestsService.calculateTotalPrice(bookingId);
    return { bookingId, totalPrice: total };
  }

  /**
   * GET /api/v2/service-requests/:id
   * Lấy thông tin một service request cụ thể
   */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.serviceRequestsService.findOne(id);
  }

  /**
   * PATCH /api/v2/service-requests/:id
   * Cập nhật thông tin service request
   */
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateServiceRequestDto: UpdateServiceRequestDto
  ) {
    return this.serviceRequestsService.update(id, updateServiceRequestDto);
  }

  /**
   * DELETE /api/v2/service-requests/:id
   * Xóa service request
   */
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.serviceRequestsService.remove(id);
  }
}

