import mongoose, { Document } from "mongoose";

/**
 * INTERFACE: IContractFinancials
 * MỤC ĐÍCH: Định nghĩa cấu trúc ContractFinancials document (1-1 với Contract)
 */
export interface IContractFinancials extends Document {
  _id: string;
  contractId: string;
  rentAmount: number;
  deposit: number;
  paymentSchedule: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SCHEMA: contractFinancialsSchema
 * MỤC ĐÍCH: Định nghĩa cấu trúc ContractFinancials collection
 */
const contractFinancialsSchema = new mongoose.Schema(
  {
    contractId: { type: String, required: true, unique: true, index: true }, // 1-1 relationship
    rentAmount: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    paymentSchedule: { type: String }, // VD: "Theo tháng", "Theo quý", "Theo năm"
    currency: { type: String, default: "VND" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Index
contractFinancialsSchema.index({ contractId: 1 }, { unique: true });

export default mongoose.model<IContractFinancials>("ContractFinancials", contractFinancialsSchema);

