import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
  Max,
} from "class-validator";

export class CreatePromotionDto {
  @IsOptional()
  @IsString()
  hotelId?: string; // null = áp dụng cho tất cả hotels

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(["PERCENTAGE", "FIXED_AMOUNT"])
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100) // Giới hạn 100% cho PERCENTAGE, có thể bỏ nếu FIXED_AMOUNT
  discountValue: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minStay?: number; // Số đêm tối thiểu

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUsage?: number; // Số lần sử dụng tối đa

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
