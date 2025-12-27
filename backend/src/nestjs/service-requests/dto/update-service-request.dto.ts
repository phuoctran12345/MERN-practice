import { IsString, IsEnum, IsOptional, IsDate } from "class-validator";

/**
 * DTO: UpdateServiceRequestDto
 * MỤC ĐÍCH: Validate dữ liệu khi update ServiceRequest
 */
export class UpdateServiceRequestDto {
  @IsOptional()
  @IsEnum(["pending", "in_progress", "completed", "cancelled"])
  status?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  completedAt?: Date;
}

