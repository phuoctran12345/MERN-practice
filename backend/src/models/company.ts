import mongoose, { Document } from "mongoose";

/**
 * INTERFACE: ICompany
 * MỤC ĐÍCH: Định nghĩa cấu trúc Company document trong MongoDB
 */
export interface ICompany extends Document {
  _id: string;
  name: string;
  taxId: string;
  address: string;
  representative: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SCHEMA: companySchema
 * MỤC ĐÍCH: Định nghĩa cấu trúc Company collection trong MongoDB
 */
const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    taxId: { type: String, required: true, unique: true, index: true },
    address: { type: String, required: true },
    representative: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Indexes
companySchema.index({ taxId: 1 }, { unique: true });
companySchema.index({ isActive: 1 });

export default mongoose.model<ICompany>("Company", companySchema);

