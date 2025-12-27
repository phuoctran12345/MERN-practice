import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ServiceRequest, ServiceRequestDocument } from "./schemas/service-request.schema";
import { CreateServiceRequestDto } from "./dto/create-service-request.dto";
import { UpdateServiceRequestDto } from "./dto/update-service-request.dto";
import Booking from "../../models/booking";

/**
 * SERVICE: ServiceRequestsService
 * MỤC ĐÍCH: Xử lý business logic cho ServiceRequest operations
 */
@Injectable()
export class ServiceRequestsService {
  constructor(
    @InjectModel(ServiceRequest.name)
    private serviceRequestModel: Model<ServiceRequestDocument>
  ) {}

  /**
   * FUNCTION: create
   * MỤC ĐÍCH: Tạo ServiceRequest mới
   * VALIDATION: Kiểm tra booking tồn tại và đang ở trạng thái phù hợp
   */
  async create(createServiceRequestDto: CreateServiceRequestDto): Promise<ServiceRequest> {
    // B1: Kiểm tra booking có tồn tại không
    const booking = await Booking.findById(createServiceRequestDto.bookingId);
    if (!booking) {
      throw new NotFoundException(
        `Booking với ID ${createServiceRequestDto.bookingId} không tồn tại`
      );
    }

    // B2: Kiểm tra booking có đang ở trạng thái phù hợp không (confirmed hoặc checked_in)
    if (!["confirmed", "checked_in"].includes(booking.status)) {
      throw new NotFoundException(
        `Booking phải ở trạng thái "confirmed" hoặc "checked_in" để yêu cầu dịch vụ`
      );
    }

    // B3: Tạo service request mới
    const serviceRequest = new this.serviceRequestModel(createServiceRequestDto);
    return serviceRequest.save();
  }

  /**
   * FUNCTION: findAll
   * MỤC ĐÍCH: Lấy tất cả service requests (có thể filter)
   */
  async findAll(
    userId?: string,
    bookingId?: string,
    hotelId?: string,
    status?: string
  ): Promise<ServiceRequest[]> {
    const query: any = {};

    if (userId) query.userId = userId;
    if (bookingId) query.bookingId = bookingId;
    if (hotelId) query.hotelId = hotelId;
    if (status) query.status = status;

    return this.serviceRequestModel.find(query).sort({ requestedAt: -1 }).exec();
  }

  /**
   * FUNCTION: findOne
   * MỤC ĐÍCH: Lấy thông tin một service request cụ thể
   */
  async findOne(id: string): Promise<ServiceRequest> {
    const serviceRequest = await this.serviceRequestModel.findById(id).exec();

    if (!serviceRequest) {
      throw new NotFoundException(`ServiceRequest với ID ${id} không tồn tại`);
    }

    return serviceRequest;
  }

  /**
   * FUNCTION: update
   * MỤC ĐÍCH: Cập nhật thông tin service request
   */
  async update(
    id: string,
    updateServiceRequestDto: UpdateServiceRequestDto
  ): Promise<ServiceRequest> {
    // Nếu update status thành "completed", set completedAt
    if (updateServiceRequestDto.status === "completed" && !updateServiceRequestDto.completedAt) {
      updateServiceRequestDto.completedAt = new Date();
    }

    const updatedServiceRequest = await this.serviceRequestModel
      .findByIdAndUpdate(id, updateServiceRequestDto, { new: true })
      .exec();

    if (!updatedServiceRequest) {
      throw new NotFoundException(`ServiceRequest với ID ${id} không tồn tại`);
    }

    return updatedServiceRequest;
  }

  /**
   * FUNCTION: remove
   * MỤC ĐÍCH: Xóa service request
   */
  async remove(id: string): Promise<void> {
    const result = await this.serviceRequestModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`ServiceRequest với ID ${id} không tồn tại`);
    }
  }

  /**
   * FUNCTION: findByBooking
   * MỤC ĐÍCH: Lấy tất cả service requests của một booking (dùng cho check-out)
   */
  async findByBooking(bookingId: string): Promise<ServiceRequest[]> {
    return this.serviceRequestModel
      .find({ bookingId, status: { $ne: "cancelled" } })
      .sort({ requestedAt: -1 })
      .exec();
  }

  /**
   * FUNCTION: calculateTotalPrice
   * MỤC ĐÍCH: Tính tổng giá của tất cả service requests của một booking
   */
  async calculateTotalPrice(bookingId: string): Promise<number> {
    const serviceRequests = await this.findByBooking(bookingId);
    return serviceRequests.reduce((total, sr) => total + (sr.price || 0), 0);
  }
}

