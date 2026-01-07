import { Request, Response } from "express";
import Hotel from "../../models/hotel";
import Booking from "../../models/booking";
import User from "../../models/user";
import { BookingType, HotelSearchResponse } from "../../shared/types";
// ❌ XÓA Stripe
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

// ✅ THÊM PayOS
import { createPaymentLink, getPaymentInfo } from "../../services/payos.service";

// ============================================
// HELPER FUNCTION: createPaymentIntent
// Mục đích: Chuyển đổi các tham số từ URL (query params) thành đối tượng truy vấn MongoDB

const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    // B1: Tìm kiếm theo destination ( city hoặc country)
    if (queryParams.destination && queryParams.destination.trim() !== "") {
        let destination = queryParams.destination.trim(); 
    
        // Sử dụngk $or để tìm khớp 1 trong 2 trường city hoặc country
        // $regex với option  "i" -> không phân biệt hoa thường
        constructedQuery.$or = [
            { city: { $regex: destination, $options: "i" } },
            { country: { $regex: destination, $options: "i" } },
        ];
    }

    // B2: Lọc theo số lượng người lớn ($gte: Lớn hơn hoặc bằng)
    if (queryParams.adultCount) {

        constructedQuery.adultCount = { $gte: parseInt(queryParams.adultCount) };
    }

    // B3: Lọc theo số lượng trẻ em ($gte: Lớn hơn hoặc bằng)
    if (queryParams.childCount) {
        constructedQuery.childCount = { $gte: parseInt(queryParams.childCount) };
    }


    // B4: Lọc theo tiện ích (Facilities)
    // $all yêu  cầu mảng trong DB phải chứa đầy đủ các tiện ích được chọn
    if ( queryParams.facilities) {
        constructedQuery.facilities = { $all: queryParams.facilities.split(",") };
    }

    // B5: Lọc theo loại hình khách sạn (Type)
    // $in cho phép tìm  các khách sạn thuộc một trong các loại được chọn 
    if ( queryParams.types) {
        constructedQuery.type = { $in: queryParams.types.split(",") };
    }

    // B6: Lọc theo số sao (Star Rating)
    if ( queryParams.types) {
        const starRatings = Array.isArray(queryParams.stars) ? queryParams.stars.map((star: string) => parseInt(star)) : [parseInt(queryParams.stars)];

        constructedQuery.starRating = { $in: starRatings };
    }
    
    // B7: Lọc theo giá trần  mỗi đêm ( $lte: Nhỏ hỏn hoặc bằng)
    if ( queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        }
    }

    return constructedQuery;
};

// FUNCTION:  searchHotels
// Mục đích: Tìm kiếm và phân trang khách sạn  dựa trên bộ lọc
export const searchHotels = async (req: Request, res: Response) => {
    try {
        // B1: Xây dựng câu lệnh query từ dữ liệu khách gửi lên 
        const query = constructSearchQuery(req.query);

        // B2: Thiết lập tuỳ chọn sắp xếp ( Sort)
        let sortOptions = {};

        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 };
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 };
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 };
                break;
        }


        // B3: Thiết lập tuỳ chọn phân trang ( Pagination)
        const pageSize = 5; // Mặc định 5 khách sạn mỗi trang
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip =  (pageNumber - 1) * pageSize; // số lượng bản ghi cần bỏ qua
        
        // B4: Thực thi truy vấn vào DB
        const hotels = await Hotel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);

        // B5: Lấy tổng số lượng bản ghi thỏa mãn để tính tổng số trang ở Frontend
        const total = await Hotel.countDocuments(query);
        
        // B6: Đóng kết quả trả về
        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total: total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };

        res.status(200).json(response);    
    } catch (error) {
        console.log("Lỗi searchHotels: " + error);
        res.status(500).json({ message: "Lỗi khi tìm kiếm khách sạn" });
    }
}


//getHotelById: Lấy thông tin chi tiết của một khách sạn dựa trên ID
export const getHotelById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id.toString();
        const hotel = await Hotel.findById(id);
        res.json(hotel);
    }  catch (error) {
        console.log("Lỗi getHotelById: " + error);
        res.status(500).json({ message: "Lỗi khi lấy thông tin khách sạn" });
    }
}


//createPaymentIntent: Tạo payment link từ PayOS
export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { numberOfNights } = req.body;
        const hotelId = req.params.hotelId;
        const userId = req.userId;

        // B1: Kiểm tra khách sạn có tồn tại không
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(400).json({ message: "Không tìm thấy khách sạn" });
        }

        // B2: Tính tổng tiền (Giá x Số đêm) - VND
        const totalCost = hotel.pricePerNight * numberOfNights;

        // B3: Tạo orderCode unique (dùng timestamp + random)
        const orderCode = Date.now() + Math.floor(Math.random() * 1000);

        // B4: Tạo payment link từ PayOS
        // ✅ FIX: PayOS yêu cầu description tối đa 25 ký tự
        const description = `Đặt phòng ${numberOfNights} đêm`.substring(0, 25);
        
        // ✅ FIX: Đảm bảo dùng đúng port 5174 (frontend port)
        // Nếu có FRONTEND_URL trong .env thì dùng, không thì dùng localhost:5174
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5174";
        
        const paymentLink = await createPaymentLink({
            orderCode: orderCode,
            amount: totalCost, // VND (không cần nhân 100 như Stripe)
            description: description, // Tối đa 25 ký tự
            returnUrl: `${frontendUrl}/booking/success?orderCode=${orderCode}&hotelId=${hotelId}`,
            cancelUrl: `${frontendUrl}/booking/cancel`,
            items: [
                {
                    name: hotel.name.length > 50 ? hotel.name.substring(0, 50) : hotel.name, // Tên hotel có thể dài
                    quantity: 1,
                    price: totalCost,
                },
            ],
        });

        // B5: Trả về payment link
        res.status(200).json({
            paymentLinkId: paymentLink.paymentLinkId,
            checkoutUrl: paymentLink.checkoutUrl, // URL để redirect khách hàng
            orderCode: orderCode,
            totalCost: totalCost,
            qrCode: paymentLink.qrCode, // QR code để quét
        });
    } catch (error) {
        console.error("❌ Lỗi createPaymentLink:", error);
        res.status(500).json({ 
            message: "Lỗi khi tạo payment link",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}


// Lưu đơn đặt phòng vào DB sau khi thanh toán thành công qua PayOS
export const createBooking = async (req: Request, res: Response) => {
    try {
      const { orderCode , promotionCode, discountAmount } = req.body; // Thay paymentIntentId bằng orderCode

      // Kiểm tra orderCode có tồn tại không
      if (!orderCode) {
        return res.status(400).json({ 
          message: "orderCode là bắt buộc. Vui lòng cung cấp orderCode từ PayOS." 
        });
      }
  
      // B1: Lấy thông tin payment từ PayOS
      const paymentInfo = await getPaymentInfo(orderCode);
  
      if (!paymentInfo) {
        return res.status(400).json({ message: "Không tìm thấy thông tin thanh toán" });
      }
  
      // B2: Kiểm tra trạng thái thanh toán
      if (paymentInfo.status !== "PAID") {
        return res.status(400).json({
          message: `Thanh toán chưa hoàn tất. Trạng thái: ${paymentInfo.status}`,
        });
      }
  
      // B3: Kiểm tra thông tin có khớp không (nếu có metadata)
      const hotelId = req.params.hotelId || paymentInfo.data?.hotelId;
      if (paymentInfo.data?.userId && paymentInfo.data.userId !== req.userId) {
        return res.status(400).json({ 
          message: "Dữ liệu thanh toán không trùng khớp" 
        });
      }

      // B4: Xử lý promotion code
      let finalTotalCost = req.body.totalCost;
      if (promotionCode && discountAmount) { 
        // áp dụng discount vào totalCost
        finalTotalCost = req.body.totalCost - (discountAmount || 0);


        // Tăng số lần sử dụng promotion
        const Promotion = require("../../models/promotion").default;
        const promotion = await Promotion.findOne({ name: promotionCode }).exec();
        if (promotion) {
          promotion.currentUsage += 1;
          await promotion.save();
        }
      }
     // B5: Chuẩn bị dữ liệu Booking mới
     const newBooking: BookingType = {
      ...req.body,              // Thông tin người đặt, ngày check-in/out từ form
      userId: req.userId,       // ID người đặt
      hotelId: hotelId, 
      createdAt: new Date(),
      status: "confirmed",      // Mặc định xác nhận luôn vì đã thanh toán xong
      paymentStatus: "paid",
      orderCode: orderCode,     // Lưu orderCode
      promotionCode: promotionCode || undefined, // ✅ Lưu promotion code
      discountAmount: discountAmount || 0, // ✅ Lưu discount amount
      totalCost: finalTotalCost, // ✅ Lưu total cost sau khi giảm giá
    };

    // B6: Lưu Booking vào DB
    const booking = new Booking(newBooking);
    await booking.save();

    // B7: Cập nhật thống kê cho Khách sạn
    await Hotel.findByIdAndUpdate(hotelId, {
      $inc: {
        totalBookings: 1,
        totalRevenue: finalTotalCost, // ✅ Dùng finalTotalCost thay vì totalCost
      },
    });

    // B8: Cập nhật thống kê cho Người dùng
    await User.findByIdAndUpdate(req.userId, {
      $inc: {
        totalBookings: 1,
        totalSpent: finalTotalCost, // ✅ Dùng finalTotalCost
      },
    });
  
      // Trả về thành công
      res.status(200).json({ 
        message: "Đặt phòng thành công",
        booking 
      });
    } catch (error) {
      console.error("❌ Lỗi createBooking:");
      console.error("Error details:", error);
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      res.status(500).json({ 
        message: "Đã có lỗi xảy ra khi tạo đơn đặt phòng",
        error: error instanceof Error ? error.message : String(error)
      });
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