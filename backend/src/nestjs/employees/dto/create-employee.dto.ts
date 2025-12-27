import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  MinLength,
  IsObject,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class AddressDto {
  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;
}

class BudgetRangeDto {
  @IsOptional()
  @IsNumber()
  min?: number;

  @IsOptional()
  @IsNumber()
  max?: number;
}

class PreferencesDto {
  @IsOptional()
  @IsString({ each: true })
  preferredDestinations?: string[];

  @IsOptional()
  @IsString({ each: true })
  preferredHotelTypes?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BudgetRangeDto)
  budgetRange?: BudgetRangeDto;
}

export class CreateEmployeeDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEnum(["user", "admin", "hotel_owner", "receptionist", "manager"])
  role: "user" | "admin" | "hotel_owner" | "receptionist" | "manager";

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences?: PreferencesDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;
}
