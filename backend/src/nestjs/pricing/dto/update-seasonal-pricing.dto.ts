import { PartialType } from "@nestjs/mapped-types";
import { CreateSeasonalPricingDto } from "./create-seasonal-pricing.dto";

export class UpdateSeasonalPricingDto extends PartialType(CreateSeasonalPricingDto) {}
