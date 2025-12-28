import mongoose, { Document } from "mongoose";

export interface IBooking extends Document {
  _id: string;
  userId: string;
  hotelId: string;
  roomId?: string; // ✅ THÊM: ID phòng cụ thể được đặt
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
  finalTotalCost?: number; // ✅ THÊM: Tổng tiền cuối (bao gồm extra services)
  status: "pending" | "confirmed" | "checked_in" | "completed" | "cancelled" | "refunded"; // ✅ THÊM: "checked_in"
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  paymentIntentId?: string; // ⚠️ DEPRECATED: Stripe Payment Intent ID (giữ lại để tương thích)
  orderCode?: number; // ✅ THÊM: PayOS Order Code
  specialRequests?: string;
  cancellationReason?: string;
  refundAmount: number;
  checkedInAt?: Date; // ✅ THÊM: Thời gian thực tế check-in
  checkedOutAt?: Date; // ✅ THÊM: Thời gian thực tế check-out
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    hotelId: { type: String, required: true, index: true },
    roomId: { type: String, index: true }, // ✅ THÊM: ID phòng cụ thể
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    checkIn: { type: Date, required: true, index: true },
    checkOut: { type: Date, required: true },
    totalCost: { type: Number, required: true },
    finalTotalCost: { type: Number }, // ✅ THÊM: Tổng tiền cuối
    status: {
      type: String,
      enum: ["pending", "confirmed", "checked_in", "completed", "cancelled", "refunded"], // ✅ THÊM: "checked_in"
      default: "pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paymentMethod: { type: String },
    paymentIntentId: { type: String }, // ⚠️ DEPRECATED: Stripe (giữ lại để tương thích)
    orderCode: { type: Number, index: true }, // ✅ THÊM: PayOS Order Code
    specialRequests: { type: String },
    cancellationReason: { type: String },
    refundAmount: { type: Number, default: 0 },
    checkedInAt: { type: Date }, // ✅ THÊM: Thời gian check-in thực tế
    checkedOutAt: { type: Date }, // ✅ THÊM: Thời gian check-out thực tế
    // Audit fields
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Add compound indexes for better query performance
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ hotelId: 1, checkIn: 1 });
bookingSchema.index({ roomId: 1, checkIn: 1 }); // ✅ THÊM: Index cho roomId
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ paymentStatus: 1, createdAt: -1 });
bookingSchema.index({ checkIn: 1, status: 1 });

export default mongoose.model<IBooking>("Booking", bookingSchema);
