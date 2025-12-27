import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PricingService } from "./pricing.service";
import { PricingController } from "./pricing.controller";
import { SeasonalPricing, SeasonalPricingSchema } from "./schemas/seasonal-pricing.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SeasonalPricing.name, schema: SeasonalPricingSchema }]),
  ],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService], // Export if other modules need to use PricingService
})
export class PricingModule {}
