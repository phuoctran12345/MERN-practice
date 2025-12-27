import { Request, Response } from "express";
import Hotel from "../../models/hotel";
import Booking from "../../models/booking";
import User from "../../models/user";
import { BookingType, HotelSearchResponse } from "../../../shared/types";
import Stripe from "stripe";


// Khởi tạo Stripe instance
const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

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


//createPaymentIntent: Tạo intent thanh toán cho Stripe
export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { numberOfNights } = req.body;
        const hotelId = req.params.hotelId;

        // B1: Kiểm tra khách sạn có tồn tại không
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
        return res.status(400).json({ message: "Không tìm thấy khách sạn" });
        }

        // B2: Tính tổng tiền (Giá x Số đêm)
        const totalCost = hotel.pricePerNight * numberOfNights;

        // B3: Gửi yêu cầu tạo Intent thanh toán tới Stripe
        // Lưu ý: Stripe tính theo đơn vị nhỏ nhất (ví dụ: cents cho USD, pence cho GBP) nên phải nhân 100
        const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost * 100, 
        currency: "gbp", // Đơn vị Bảng Anh (có thể đổi thành "usd" hoặc "vnd")
        metadata: {
            hotelId,
            userId: req.userId, // Gắn ID người dùng để đối chiếu sau khi thanh toán xong
        },
        });

        // B4: Kiểm tra nếu Stripe không trả về client_secret
        if (!paymentIntent.client_secret) {
        return res.status(500).json({ message: "Lỗi khi tạo payment intent" });
        }

        // B5: Trả về clientSecret để Frontend dùng hoàn tất thanh toán (Stripe Element)
        const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost,
        };

        res.send(response);

    } catch (error){
        console.log("Lỗi createPaymentIntent: " + error);
        res.status(500).json({ message: "Lỗi khi tạo intent thanh toán" });
    }
}


// Lưu đơn đặt phòng vào DB
export const createBooking = async (req: Request, res: Response) => {
    try {
      const paymentIntentId = req.body.paymentIntentId;
  
      // B1: Truy vấn lại thông tin thanh toán từ Stripe bằng ID nhận được từ Frontend
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );
  
      if (!paymentIntent) {
        return res.status(400).json({ message: "Không tìm thấy thông tin thanh toán" });
      }
  
      // B2: Bảo mật - Kiểm tra thông tin trong Payment Intent có khớp với request không
      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "Dữ liệu thanh toán không trùng khớp" });
      }
  
      // B3: Kiểm tra trạng thái thanh toán từ phía Stripe
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `Thanh toán chưa hoàn tất. Trạng thái: ${paymentIntent.status}`,
        });
      }
  
      // B4: Chuẩn bị dữ liệu Booking mới
      const newBooking: BookingType = {
        ...req.body,              // Thông tin người đặt, ngày check-in/out từ form
        userId: req.userId,       // ID người đặt
        hotelId: req.params.hotelId, 
        createdAt: new Date(),
        status: "confirmed",      // Mặc định xác nhận luôn vì đã thanh toán xong
        paymentStatus: "paid",
      };
  
      // B5: Lưu Booking vào DB
      const booking = new Booking(newBooking);
      await booking.save();
  
      // B6: Cập nhật thống kê cho Khách sạn ($inc: tăng giá trị hiện có)
      await Hotel.findByIdAndUpdate(req.params.hotelId, {
        $inc: {
          totalBookings: 1,           // Tăng tổng số đơn đặt
          totalRevenue: newBooking.totalCost, // Cộng dồn doanh thu
        },
      });
  
      // B7: Cập nhật thống kê cho Người dùng
      await User.findByIdAndUpdate(req.userId, {
        $inc: {
          totalBookings: 1,           // Tăng số lần đặt phòng của user
          totalSpent: newBooking.totalCost, // Cộng dồn số tiền đã chi
        },
      });
  
      // Trả về thành công
      res.status(200).send();
    } catch (error) {
      console.log("Lỗi createBooking:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra khi tạo đơn đặt phòng" });
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