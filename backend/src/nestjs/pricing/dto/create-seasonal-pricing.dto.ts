import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
} from "class-validator";

export class CreateSeasonalPricingDto {
  @IsNotEmpty()
  @IsString()
  hotelId: string;

  @IsNotEmpty()
  @IsEnum(["SINGLE", "DOUBLE", "SUITE", "DELUXE", "ALL"])
  roomType: "SINGLE" | "DOUBLE" | "SUITE" | "DELUXE" | "ALL";

  @IsNotEmpty()
  @IsEnum(["LOW", "MEDIUM", "HIGH", "PEAK"])
  season: "LOW" | "MEDIUM" | "HIGH" | "PEAK";

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
