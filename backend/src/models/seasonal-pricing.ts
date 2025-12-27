import mongoose, { Document } from "mongoose";

/**
 * INTERFACE: ISeasonalPricing
 * MỤC ĐÍCH: Định nghĩa cấu trúc SeasonalPricing document trong MongoDB
 */
export interface ISeasonalPricing extends Document {
  _id: string;
  hotelId: string;
  roomType: "SINGLE" | "DOUBLE" | "SUITE" | "DELUXE" | "ALL"; // ALL = áp dụng cho tất cả loại phòng
  season: "LOW" | "MEDIUM" | "HIGH" | "PEAK";
  startDate: Date;
  endDate: Date;
  pricePerNight: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SCHEMA: seasonalPricingSchema
 * MỤC ĐÍCH: Định nghĩa cấu trúc SeasonalPricing collection trong MongoDB
 */
const seasonalPricingSchema = new mongoose.Schema(
  {
    hotelId: { type: String, required: true, index: true },
    roomType: {
      type: String,
      enum: ["SINGLE", "DOUBLE", "SUITE", "DELUXE", "ALL"],
      required: true,
      index: true,
    },
    season: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "PEAK"],
      required: true,
      index: true,
    },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
seasonalPricingSchema.index({ hotelId: 1, roomType: 1, isActive: 1 });
seasonalPricingSchema.index({ startDate: 1, endDate: 1 });
seasonalPricingSchema.index({ hotelId: 1, startDate: 1, endDate: 1 });

export default mongoose.model<ISeasonalPricing>("SeasonalPricing", seasonalPricingSchema);
