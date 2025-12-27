import mongoose, { Document } from "mongoose";

/**
 * INTERFACE: IContract
 * MỤC ĐÍCH: Định nghĩa cấu trúc Contract document trong MongoDB (CLM Feature)
 */
export interface IContract extends Document {
  _id: string;
  companyId: string;
  customerId: string;
  hotelId?: string;
  contractCode: string;
  status: "DRAFT" | "ACTIVE" | "EXPIRED" | "TERMINATED";
  signedAt?: Date;
  effectiveDate?: Date;
  expiryDate?: Date;
  renewalDate?: Date;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SCHEMA: contractSchema
 * MỤC ĐÍCH: Định nghĩa cấu trúc Contract collection trong MongoDB
 */
const contractSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true, index: true },
    customerId: { type: String, required: true, index: true },
    hotelId: { type: String, index: true },
    contractCode: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "EXPIRED", "TERMINATED"],
      default: "DRAFT",
      index: true,
    },
    signedAt: { type: Date },
    effectiveDate: { type: Date },
    expiryDate: { type: Date, index: true }, // Index để query contracts sắp hết hạn
    renewalDate: { type: Date },
    fileUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Indexes
contractSchema.index({ companyId: 1, status: 1 });
contractSchema.index({ customerId: 1 });
contractSchema.index({ contractCode: 1 }, { unique: true });
contractSchema.index({ expiryDate: 1 }); // Để query contracts sắp hết hạn (AI alert)

export default mongoose.model<IContract>("Contract", contractSchema);

