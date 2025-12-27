import mongoose, { Document } from "mongoose";

/**
 * INTERFACE: IAIContractAnalysis
 * MỤC ĐÍCH: Định nghĩa cấu trúc AI Contract Analysis document (1-1 với Contract)
 */
export interface IAIContractAnalysis extends Document {
  _id: string;
  contractId: string;
  summary: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  riskTags: string[];
  vectorId?: string;
  lastAnalyzed: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SCHEMA: aiContractAnalysisSchema
 * MỤC ĐÍCH: Định nghĩa cấu trúc AI Contract Analysis collection
 */
const aiContractAnalysisSchema = new mongoose.Schema(
  {
    contractId: { type: String, required: true, unique: true, index: true }, // 1-1 relationship
    summary: { type: String, required: true },
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
      index: true,
    },
    riskTags: [{ type: String }], // VD: ["Thiếu bảo hiểm", "Phí phạt cao"]
    vectorId: { type: String }, // ID liên kết Vector DB (Qdrant/Pinecone) cho RAG
    lastAnalyzed: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Indexes
aiContractAnalysisSchema.index({ contractId: 1 }, { unique: true });
aiContractAnalysisSchema.index({ riskLevel: 1 });

export default mongoose.model<IAIContractAnalysis>("AIContractAnalysis", aiContractAnalysisSchema);

