import { IsString, IsOptional } from "class-validator";

/**
 * DTO: CheckInDto
 * MỤC ĐÍCH: Validate dữ liệu khi check-in
 */
export class CheckInDto {
  @IsOptional()
  @IsString()
  roomId?: string; // Phòng cụ thể được assign
}

