import mongoose, { Document } from "mongoose";

/**
 * INTERFACE: IAuditLog
 * MỤC ĐÍCH: Định nghĩa cấu trúc AuditLog document (Nhật ký hệ thống)
 */
export interface IAuditLog extends Document {
  _id: string;
  userId: string;
  action: string;
  targetType: string;
  targetId: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any; // JSON object chứa chi tiết thay đổi
  timestamp: Date;
}

/**
 * SCHEMA: auditLogSchema
 * MỤC ĐÍCH: Định nghĩa cấu trúc AuditLog collection
 */
const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true }, // VD: "VIEW", "CREATE", "UPDATE", "DELETE"
    targetType: { type: String, required: true, index: true }, // VD: "BOOKING", "HOTEL", "CONTRACT"
    targetId: { type: String, required: true, index: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    details: { type: mongoose.Schema.Types.Mixed }, // JSON object
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

export default mongoose.model<IAuditLog>("AuditLog", auditLogSchema);

