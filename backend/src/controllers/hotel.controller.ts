// ============================================
// FILE: hotel.controller.ts
// MỤC ĐÍCH: Controller xử lý business logic cho Hotel (Public routes)
// TRONG MVC: Đây là Controller layer
// ============================================

import { Request, Response } from "express";
import Hotel from "../models/hotel";
import Booking from "../models/booking";
import User from "../models/user";
import { BookingType, HotelSearchResponse } from "../../../shared/types";
import Stripe from "stripe";

// Khởi tạo Stripe instance
const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

// ============================================
// HELPER FUNCTION: constructSearchQuery
// MỤC ĐÍCH: Xây dựng query để tìm kiếm hotels
// ============================================
const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  // Tìm kiếm theo destination (city hoặc country)
  if (queryParams.destination && queryParams.destination.trim() !== "") {
    const destination = queryParams.destination.trim();
    // $or = Tìm trong city HOẶC country
    // $regex = Tìm kiếm không phân biệt hoa thường
    // $options: "i" = Case insensitive
    constructedQuery.$or = [
      { city: { $regex: destination, $options: "i" } },
      { country: { $regex: destination, $options: "i" } },
    ];
  }

  // Tìm kiếm theo số lượng người lớn
  // $gte = Greater than or equal (lớn hơn hoặc bằng)
  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  // Tìm kiếm theo số lượng trẻ em
  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  // Tìm kiếm theo facilities (tiện ích)
  // $all = Phải có TẤT CẢ các facilities trong mảng
  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  // Tìm kiếm theo loại hotel
  // $in = Có ít nhất 1 trong các giá trị
  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  // Tìm kiếm theo số sao
  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  // Tìm kiếm theo giá tối đa
  // $lte = Less than or equal (nhỏ hơn hoặc bằng)
  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

// ============================================
// FUNCTION: searchHotels
// MỤC ĐÍCH: Tìm kiếm hotels với filters và pagination
// ENDPOINT: GET /api/hotels/search
// ============================================
export const searchHotels = async (req: Request, res: Response) => {
  try {
    // Bước 1: Xây dựng query từ query parameters
    const query = constructSearchQuery(req.query);

    // Bước 2: Xử lý sort options (sắp xếp)
    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 }; // Sắp xếp theo sao giảm dần
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 }; // Giá tăng dần
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 }; // Giá giảm dần
        break;
    }

    // Bước 3: Xử lý pagination (phân trang)
    const pageSize = 5; // Số hotels mỗi trang
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize; // Số hotels bỏ qua

    // Bước 4: Tìm hotels với query, sort, skip, limit
    const hotels = await Hotel.find(query)
      .sort(sortOptions)  // Sắp xếp
      .skip(skip)         // Bỏ qua N hotels
      .limit(pageSize);   // Chỉ lấy pageSize hotels

    // Bước 5: Đếm tổng số hotels (để tính số trang)
    const total = await Hotel.countDocuments(query);

    // Bước 6: Tạo response với pagination info
    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,                    // Tổng số hotels
        page: pageNumber,         // Trang hiện tại
        pages: Math.ceil(total / pageSize), // Tổng số trang
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ============================================
// FUNCTION: getAllHotels
// MỤC ĐÍCH: Lấy tất cả hotels (sắp xếp theo lastUpdated)
// ENDPOINT: GET /api/hotels
// ============================================
export const getAllHotels = async (req: Request, res: Response) => {
  try {
    // Tìm tất cả hotels, sắp xếp theo lastUpdated giảm dần (mới nhất trước)
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

// ============================================
// FUNCTION: getHotelById
// MỤC ĐÍCH: Lấy thông tin một hotel cụ thể
// ENDPOINT: GET /api/hotels/:id
// VALIDATION: Đã được xử lý ở routes
// ============================================
export const getHotelById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id.toString();

    // Tìm hotel theo ID
    const hotel = await Hotel.findById(id);
    
    // Trả về hotel (có thể null nếu không tìm thấy)
    res.json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching hotel" });
  }
};

// ============================================
// FUNCTION: createPaymentIntent
// MỤC ĐÍCH: Tạo Stripe payment intent để thanh toán
// ENDPOINT: POST /api/hotels/:hotelId/bookings/payment-intent
// MIDDLEWARE: verifyToken (đã được gọi ở routes)
// ============================================
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    // Lấy số đêm và hotelId từ request
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;

    // Bước 1: Tìm hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found" });
    }

    // Bước 2: Tính tổng chi phí
    // totalCost = Giá mỗi đêm × Số đêm
    const totalCost = hotel.pricePerNight * numberOfNights;

    // Bước 3: Tạo Stripe payment intent
    // stripe.paymentIntents.create() = Tạo payment intent trong Stripe
    // amount: totalCost * 100 = Chuyển đổi sang cents (Stripe dùng cents)
    // currency: "gbp" = Đồng tiền (GBP = British Pound)
    // metadata = Dữ liệu bổ sung (hotelId, userId)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100, // Stripe dùng cents, nên nhân 100
      currency: "gbp",
      metadata: {
        hotelId,
        userId: req.userId, // Lấy từ middleware verifyToken
      },
    });

    // Bước 4: Kiểm tra client_secret
    // client_secret = Secret key để frontend xác thực với Stripe
    if (!paymentIntent.client_secret) {
      return res.status(500).json({ message: "Error creating payment intent" });
    }

    // Bước 5: Trả về response
    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost,
    };

    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating payment intent" });
  }
};

// ============================================
// FUNCTION: createBooking
// MỤC ĐÍCH: Tạo booking sau khi thanh toán thành công
// ENDPOINT: POST /api/hotels/:hotelId/bookings
// MIDDLEWARE: verifyToken (đã được gọi ở routes)
// ============================================
export const createBooking = async (req: Request, res: Response) => {
  try {
    // Bước 1: Lấy paymentIntentId từ request body
    const paymentIntentId = req.body.paymentIntentId;

    // Bước 2: Retrieve payment intent từ Stripe
    // stripe.paymentIntents.retrieve() = Lấy thông tin payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId as string
    );

    // Kiểm tra payment intent có tồn tại không
    if (!paymentIntent) {
      return res.status(400).json({ message: "payment intent not found" });
    }

    // Bước 3: Verify payment intent
    // Kiểm tra hotelId và userId trong metadata có khớp không
    if (
      paymentIntent.metadata.hotelId !== req.params.hotelId ||
      paymentIntent.metadata.userId !== req.userId
    ) {
      return res.status(400).json({ message: "payment intent mismatch" });
    }

    // Kiểm tra payment đã thành công chưa
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
      });
    }

    // Bước 4: Tạo booking mới
    const newBooking: BookingType = {
      ...req.body,              // Lấy tất cả data từ request body
      userId: req.userId,       // Gán userId từ middleware
      hotelId: req.params.hotelId, // Gán hotelId từ URL params
      createdAt: new Date(),    // Thời gian tạo booking
      status: "confirmed",      // Trạng thái: đã xác nhận
      paymentStatus: "paid",     // Trạng thái thanh toán: đã thanh toán
    };

    // Lưu booking vào database
    const booking = new Booking(newBooking);
    await booking.save();

    // Bước 5: Cập nhật analytics cho hotel
    // $inc = Increment (tăng giá trị)
    await Hotel.findByIdAndUpdate(req.params.hotelId, {
      $inc: {
        totalBookings: 1,                    // Tăng số booking lên 1
        totalRevenue: newBooking.totalCost, // Tăng revenue
      },
    });

    // Bước 6: Cập nhật analytics cho user
    await User.findByIdAndUpdate(req.userId, {
      $inc: {
        totalBookings: 1,                    // Tăng số booking của user
        totalSpent: newBooking.totalCost,   // Tăng tổng chi tiêu
      },
    });

    // Bước 7: Trả về response thành công
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

