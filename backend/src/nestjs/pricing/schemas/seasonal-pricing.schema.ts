import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type SeasonalPricingDocument = SeasonalPricing & Document;

@Schema({ timestamps: true })
export class SeasonalPricing {
  @Prop({ required: true, index: true })
  hotelId: string;

  @Prop({
    type: String,
    enum: ["SINGLE", "DOUBLE", "SUITE", "DELUXE", "ALL"],
    required: true,
    index: true,
  })
  roomType: "SINGLE" | "DOUBLE" | "SUITE" | "DELUXE" | "ALL"; // ALL = áp dụng cho tất cả loại phòng

  @Prop({
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH", "PEAK"],
    required: true,
    index: true,
  })
  season: "LOW" | "MEDIUM" | "HIGH" | "PEAK";

  @Prop({ required: true, index: true })
  startDate: Date;

  @Prop({ required: true, index: true })
  endDate: Date;

  @Prop({ required: true, min: 0 })
  pricePerNight: number;

  @Prop({ default: true, index: true })
  isActive: boolean;
}

export const SeasonalPricingSchema = SchemaFactory.createForClass(SeasonalPricing);

// Compound indexes
SeasonalPricingSchema.index({ hotelId: 1, roomType: 1, isActive: 1 });
SeasonalPricingSchema.index({ startDate: 1, endDate: 1 });
SeasonalPricingSchema.index({ hotelId: 1, startDate: 1, endDate: 1 });
