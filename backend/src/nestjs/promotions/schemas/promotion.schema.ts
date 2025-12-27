import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PromotionDocument = Promotion & Document;

@Schema({ timestamps: true })
export class Promotion {
  @Prop({ type: String, index: true })
  hotelId?: string; // null = áp dụng cho tất cả hotels

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: String,
    enum: ["PERCENTAGE", "FIXED_AMOUNT"],
    required: true,
  })
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";

  @Prop({ required: true, min: 0 })
  discountValue: number;

  @Prop({ required: true, index: true })
  startDate: Date;

  @Prop({ required: true, index: true })
  endDate: Date;

  @Prop({ min: 1 })
  minStay?: number; // Số đêm tối thiểu

  @Prop({ min: 1 })
  maxUsage?: number; // Số lần sử dụng tối đa

  @Prop({ default: 0, min: 0 })
  currentUsage: number;

  @Prop({ default: true, index: true })
  isActive: boolean;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);

// Compound indexes
PromotionSchema.index({ hotelId: 1, isActive: 1 });
PromotionSchema.index({ startDate: 1, endDate: 1 });
PromotionSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
