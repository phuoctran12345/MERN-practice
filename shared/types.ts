/**
 * TYPE: UserType - Định nghĩa cấu trúc người dùng
 */
export type UserType = {
  _id: string;
  email: string;
  password: string; // Password đã hash
  firstName: string;
  lastName: string;
  role?: "user" | "hotel_owner" | "receptionist" | "manager";
  phone?: string;
  
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  preferences?: {
    preferredDestinations: string[];
    preferredHotelTypes: string[];
    budgetRange: {
      min: number;
      max: number;
    };
  };

  totalBookings?: number;
  totalSpent?: number;
  lastLogin?: Date;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * TYPE: HotelType - Định nghĩa cấu trúc khách sạn
 */
export type HotelType = {
  _id: string;
  userId: string; // ID của chủ sở hữu (Owner)
  name: string;
  city: string;
  country: string;
  description: string;
  type: string[];
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;

  location?: {
    latitude: number;
    longitude: number;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };

  contact?: {
    phone: string;
    email: string;
    website: string;
  };

  policies?: {
    checkInTime: string;
    checkOutTime: string;
    cancellationPolicy: string;
    petPolicy: string;
    smokingPolicy: string;
  };

  amenities?: {
    parking: boolean;
    wifi: boolean;
    pool: boolean;
    gym: boolean;
    spa: boolean;
    restaurant: boolean;
    bar: boolean;
    airportShuttle: boolean;
    businessCenter: boolean;
  };

  totalBookings?: number;
  totalRevenue?: number;
  averageRating?: number;
  reviewCount?: number;
  occupancyRate?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * TYPE: BookingType - Định nghĩa cấu trúc đặt phòng
 */
export type BookingType = {
  _id: string;
  userId: string;
  hotelId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
  
  // Trạng thái đơn hàng và thanh toán
  status?: "pending" | "confirmed" | "cancelled" | "completed" | "refunded";
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  
  paymentMethod?: string;
  specialRequests?: string;
  cancellationReason?: string;
  refundAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Các Type mở rộng cho Response API
 */
export type HotelWithBookingsType = HotelType & {
  bookings: BookingType[];
};

export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type PaymentIntentResponse = {
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
};

/**
 * TYPE: EmployeeType - Định nghĩa cấu trúc nhân viên
 */
export type EmployeeType = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "receptionist" | "manager" | "hotel_owner";
  phone?: string;
  companyId?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * TYPE: PromotionType - Định nghĩa cấu trúc khuyến mãi
 */
export type PromotionType = {
  _id: string;
  name: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  startDate: Date;
  endDate: Date;
  hotelId?: string;
  minStay?: number;
  maxUsage?: number;
  currentUsage?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};