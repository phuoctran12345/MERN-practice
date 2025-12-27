import mongoose, { Document } from "mongoose";

/**
 * INTERFACE: IServiceRequest
 * MỤC ĐÍCH: Định nghĩa cấu trúc ServiceRequest document trong MongoDB
 */
export interface IServiceRequest extends Document {
  _id: string;
  bookingId: string;
  userId: string;
  hotelId: string;
  serviceType: "room_service" | "laundry" | "cleaning" | "food" | "transport" | "minibar" | "other";
  description?: string;
  price: number;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  requestedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SCHEMA: serviceRequestSchema
 * MỤC ĐÍCH: Định nghĩa cấu trúc ServiceRequest collection trong MongoDB
 */
const serviceRequestSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    hotelId: { type: String, required: true, index: true },
    serviceType: {
      type: String,
      enum: ["room_service", "laundry", "cleaning", "food", "transport", "minibar", "other"],
      required: true,
      index: true,
    },
    description: { type: String },
    price: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    requestedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
serviceRequestSchema.index({ bookingId: 1, status: 1 });
serviceRequestSchema.index({ userId: 1, createdAt: -1 });
serviceRequestSchema.index({ hotelId: 1, status: 1 });

export default mongoose.model<IServiceRequest>("ServiceRequest", serviceRequestSchema);

