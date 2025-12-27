import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ type: String, index: true })
  companyId?: string; // ID công ty (optional - có thể null cho customer)

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string; // Sẽ được hash bởi bcrypt

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    type: String,
    enum: ["user", "admin", "hotel_owner", "receptionist", "manager"],
    default: "user",
  })
  role: "user" | "admin" | "hotel_owner" | "receptionist" | "manager";

  @Prop()
  phone?: string;

  @Prop({
    type: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
  })
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };

  @Prop({
    type: {
      preferredDestinations: [String],
      preferredHotelTypes: [String],
      budgetRange: {
        min: Number,
        max: Number,
      },
    },
  })
  preferences?: {
    preferredDestinations?: string[];
    preferredHotelTypes?: string[];
    budgetRange?: {
      min?: number;
      max?: number;
    };
  };

  @Prop({ default: 0 })
  totalBookings: number;

  @Prop({ default: 0 })
  totalSpent: number;

  @Prop()
  lastLogin?: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  emailVerified: boolean;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

// Indexes
EmployeeSchema.index({ email: 1 }, { unique: true });
EmployeeSchema.index({ companyId: 1 });
EmployeeSchema.index({ role: 1 });
