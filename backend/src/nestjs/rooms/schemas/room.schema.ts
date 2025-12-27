import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/**
 * SCHEMA: Room (NestJS)
 * MỤC ĐÍCH: Định nghĩa Room schema cho NestJS với Mongoose
 */
export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, index: true })
  hotelId: string;

  @Prop({ required: true })
  roomNumber: string;

  @Prop({
    required: true,
    enum: ["SINGLE", "DOUBLE", "SUITE", "DELUXE"],
    index: true,
  })
  roomType: string;

  @Prop({ required: true })
  basePrice: number;

  @Prop({
    enum: ["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"],
    default: "AVAILABLE",
    index: true,
  })
  status: string;

  @Prop()
  maxOccupancy?: number;

  @Prop()
  bedType?: string;

  @Prop({ type: [String] })
  amenities?: string[];

  @Prop()
  floor?: number;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

// Compound indexes
RoomSchema.index({ hotelId: 1, status: 1 });
RoomSchema.index({ hotelId: 1, roomType: 1 });
RoomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });

