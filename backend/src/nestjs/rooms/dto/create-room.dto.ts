import { IsString, IsNumber, IsEnum, IsOptional, IsArray, Min } from "class-validator";

/**
 * DTO: CreateRoomDto
 * MỤC ĐÍCH: Validate dữ liệu khi tạo Room mới
 */
export class CreateRoomDto {
  @IsString()
  hotelId: string;

  @IsString()
  roomNumber: string;

  @IsEnum(["SINGLE", "DOUBLE", "SUITE", "DELUXE"])
  roomType: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsEnum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"])
  status?: string;

  @IsOptional()
  @IsNumber()
  maxOccupancy?: number;

  @IsOptional()
  @IsString()
  bedType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsNumber()
  floor?: number;
}

