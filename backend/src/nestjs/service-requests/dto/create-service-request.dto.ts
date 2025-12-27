import { IsString, IsNumber, IsEnum, IsOptional, Min } from "class-validator";

/**
 * DTO: CreateServiceRequestDto
 * MỤC ĐÍCH: Validate dữ liệu khi tạo ServiceRequest mới
 */
export class CreateServiceRequestDto {
  @IsString()
  bookingId: string;

  @IsString()
  userId: string;

  @IsString()
  hotelId: string;

  @IsEnum(["room_service", "laundry", "cleaning", "food", "transport", "minibar", "other"])
  serviceType: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;
}

