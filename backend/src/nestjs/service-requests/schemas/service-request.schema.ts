import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/**
 * SCHEMA: ServiceRequest (NestJS)
 * MỤC ĐÍCH: Định nghĩa ServiceRequest schema cho NestJS với Mongoose
 */
export type ServiceRequestDocument = ServiceRequest & Document;

@Schema({ timestamps: true })
export class ServiceRequest {
  @Prop({ required: true, index: true })
  bookingId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  hotelId: string;

  @Prop({
    required: true,
    enum: ["room_service", "laundry", "cleaning", "food", "transport", "minibar", "other"],
    index: true,
  })
  serviceType: string;

  @Prop()
  description?: string;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({
    enum: ["pending", "in_progress", "completed", "cancelled"],
    default: "pending",
    index: true,
  })
  status: string;

  @Prop({ default: Date.now })
  requestedAt: Date;

  @Prop()
  completedAt?: Date;
}

export const ServiceRequestSchema = SchemaFactory.createForClass(ServiceRequest);

// Compound indexes
ServiceRequestSchema.index({ bookingId: 1, status: 1 });
ServiceRequestSchema.index({ userId: 1, createdAt: -1 });
ServiceRequestSchema.index({ hotelId: 1, status: 1 });

