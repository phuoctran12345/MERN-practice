import mongoose, { Document } from "mongoose";

/**
 * INTERFACE: IRoom
 * MỤC ĐÍCH: Định nghĩa cấu trúc Room document trong MongoDB
 */
export interface IRoom extends Document {
  _id: string;
  hotelId: string;
  roomNumber: string;
  roomType: "SINGLE" | "DOUBLE" | "SUITE" | "DELUXE";
  basePrice: number;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "RESERVED";
  maxOccupancy?: number;
  bedType?: string;
  amenities?: string[];
  floor?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SCHEMA: roomSchema
 * MỤC ĐÍCH: Định nghĩa cấu trúc Room collection trong MongoDB
 */
const roomSchema = new mongoose.Schema(
  {
    hotelId: { type: String, required: true, index: true },
    roomNumber: { type: String, required: true },
    roomType: {
      type: String,
      enum: ["SINGLE", "DOUBLE", "SUITE", "DELUXE"],
      required: true,
      index: true,
    },
    basePrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"],
      default: "AVAILABLE",
      index: true,
    },
    maxOccupancy: { type: Number },
    bedType: { type: String },
    amenities: [{ type: String }],
    floor: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
roomSchema.index({ hotelId: 1, status: 1 });
roomSchema.index({ hotelId: 1, roomType: 1 });
roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true }); // Mỗi phòng trong hotel phải unique

export default mongoose.model<IRoom>("Room", roomSchema);

