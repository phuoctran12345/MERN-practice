import mongoose, { Document } from "mongoose";

/**
 * INTERFACE: IPromotion
 * MỤC ĐÍCH: Định nghĩa cấu trúc Promotion document trong MongoDB
 */
export interface IPromotion extends Document {
  _id: string;
  hotelId?: string; // null = áp dụng cho tất cả hotels
  name: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  startDate: Date;
  endDate: Date;
  minStay?: number; // Số đêm tối thiểu
  maxUsage?: number; // Số lần sử dụng tối đa
  currentUsage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SCHEMA: promotionSchema
 * MỤC ĐÍCH: Định nghĩa cấu trúc Promotion collection trong MongoDB
 */
const promotionSchema = new mongoose.Schema(
  {
    hotelId: { type: String, index: true }, // null = áp dụng cho tất cả
    name: { type: String, required: true },
    description: { type: String, required: true },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED_AMOUNT"],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    minStay: { type: Number, min: 1 }, // Số đêm tối thiểu
    maxUsage: { type: Number, min: 1 }, // Số lần sử dụng tối đa
    currentUsage: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
promotionSchema.index({ hotelId: 1, isActive: 1 });
promotionSchema.index({ startDate: 1, endDate: 1 });
promotionSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

export default mongoose.model<IPromotion>("Promotion", promotionSchema);
