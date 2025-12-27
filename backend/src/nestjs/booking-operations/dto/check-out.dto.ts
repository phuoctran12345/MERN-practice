import { IsOptional, IsNumber, Min } from "class-validator";

/**
 * DTO: CheckOutDto
 * MỤC ĐÍCH: Validate dữ liệu khi check-out
 */
export class CheckOutDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  additionalCharges?: number; // Chi phí phát sinh thêm (ngoài service requests)
}

