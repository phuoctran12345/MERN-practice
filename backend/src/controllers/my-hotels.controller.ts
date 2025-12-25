// ============================================
// FILE: my-hotels.controller.ts
// MỤC ĐÍCH: Controller xử lý business logic cho My Hotels (Hotels của user)
// TRONG MVC: Đây là Controller layer
// ============================================

import { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { HotelType } from "../../../shared/types";

// ============================================
// HELPER FUNCTION: uploadImages
// MỤC ĐÍCH: Upload ảnh lên Cloudinary
// ============================================
async function uploadImages(imageFiles: any[]) {
  // Promise.all() = Chạy tất cả uploads song song (nhanh hơn)
  const uploadPromises = imageFiles.map(async (image) => {
    // Bước 1: Chuyển đổi buffer thành base64
    // Buffer.from() = Tạo buffer từ Uint8Array
    // .toString("base64") = Chuyển sang base64 string
    const b64 = Buffer.from(image.buffer as Uint8Array).toString("base64");
    
    // Bước 2: Tạo data URI (Data URL)
    // Format: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    
    // Bước 3: Upload lên Cloudinary
    // cloudinary.v2.uploader.upload() = Upload ảnh lên Cloudinary
    // secure: true = Force HTTPS URLs
    // transformation = Resize và optimize ảnh
    const res = await cloudinary.v2.uploader.upload(dataURI, {
      secure: true, // Force HTTPS URLs
      transformation: [
        { width: 800, height: 600, crop: "fill" }, // Resize về 800x600
        { quality: "auto" },                        // Auto optimize quality
      ],
    });
    
    // Trả về URL của ảnh đã upload
    return res.url;
  });

  // Đợi tất cả uploads hoàn thành
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

// ============================================
// FUNCTION: createHotel
// MỤC ĐÍCH: Tạo hotel mới
// ENDPOINT: POST /api/my-hotels
// MIDDLEWARE: verifyToken, upload.array(), validation (đã được gọi ở routes)
// ============================================
export const createHotel = async (req: Request, res: Response) => {
  try {
    // Bước 1: Lấy image files và hotel data từ request
    const imageFiles = (req as any).files as any[];
    const newHotel: HotelType = req.body;

    // Bước 2: Đảm bảo type luôn là array
    // Nếu frontend gửi string, chuyển thành array
    if (typeof newHotel.type === "string") {
      newHotel.type = [newHotel.type];
    }

    // Bước 3: Xử lý nested objects từ FormData
    // FormData gửi nested objects dưới dạng "contact.phone", "contact.email"
    newHotel.contact = {
      phone: req.body["contact.phone"] || "",
      email: req.body["contact.email"] || "",
      website: req.body["contact.website"] || "",
    };

    newHotel.policies = {
      checkInTime: req.body["policies.checkInTime"] || "",
      checkOutTime: req.body["policies.checkOutTime"] || "",
      cancellationPolicy: req.body["policies.cancellationPolicy"] || "",
      petPolicy: req.body["policies.petPolicy"] || "",
      smokingPolicy: req.body["policies.smokingPolicy"] || "",
    };

    // Bước 4: Upload ảnh lên Cloudinary
    const imageUrls = await uploadImages(imageFiles);

    // Bước 5: Gán imageUrls và metadata
    newHotel.imageUrls = imageUrls;
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.userId; // Lấy từ middleware verifyToken

    // Bước 6: Tạo và lưu hotel vào database
    const hotel = new Hotel(newHotel);
    await hotel.save();

    // Bước 7: Trả về response
    res.status(201).send(hotel);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ============================================
// FUNCTION: getMyHotels
// MỤC ĐÍCH: Lấy tất cả hotels của user hiện tại
// ENDPOINT: GET /api/my-hotels
// MIDDLEWARE: verifyToken (đã được gọi ở routes)
// ============================================
export const getMyHotels = async (req: Request, res: Response) => {
  try {
    // Tìm tất cả hotels có userId = req.userId
    // req.userId được set bởi middleware verifyToken
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

// ============================================
// FUNCTION: getMyHotelById
// MỤC ĐÍCH: Lấy một hotel cụ thể của user
// ENDPOINT: GET /api/my-hotels/:id
// MIDDLEWARE: verifyToken (đã được gọi ở routes)
// ============================================
export const getMyHotelById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id.toString();

    // Tìm hotel theo ID và userId (đảm bảo user chỉ xem được hotel của mình)
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

// ============================================
// FUNCTION: updateMyHotel
// MỤC ĐÍCH: Cập nhật hotel
// ENDPOINT: PUT /api/my-hotels/:hotelId
// MIDDLEWARE: verifyToken, upload.array() (đã được gọi ở routes)
// ============================================
export const updateMyHotel = async (req: Request, res: Response) => {
  try {
    // Bước 1: Tìm hotel hiện tại
    // Kiểm tra cả _id và userId để đảm bảo user chỉ update được hotel của mình
    const existingHotel = await Hotel.findOne({
      _id: req.params.hotelId,
      userId: req.userId,
    });

    // Nếu không tìm thấy hotel
    if (!existingHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Bước 2: Chuẩn bị dữ liệu update
    const updateData: any = {
      name: req.body.name,
      city: req.body.city,
      country: req.body.country,
      description: req.body.description,
      type: Array.isArray(req.body.type) ? req.body.type : [req.body.type],
      pricePerNight: Number(req.body.pricePerNight),
      starRating: Number(req.body.starRating),
      adultCount: Number(req.body.adultCount),
      childCount: Number(req.body.childCount),
      facilities: Array.isArray(req.body.facilities)
        ? req.body.facilities
        : [req.body.facilities],
      lastUpdated: new Date(),
    };

    // Bước 3: Xử lý nested objects (contact, policies)
    updateData.contact = {
      phone: req.body["contact.phone"] || "",
      email: req.body["contact.email"] || "",
      website: req.body["contact.website"] || "",
    };

    updateData.policies = {
      checkInTime: req.body["policies.checkInTime"] || "",
      checkOutTime: req.body["policies.checkOutTime"] || "",
      cancellationPolicy: req.body["policies.cancellationPolicy"] || "",
      petPolicy: req.body["policies.petPolicy"] || "",
      smokingPolicy: req.body["policies.smokingPolicy"] || "",
    };

    // Bước 4: Cập nhật hotel
    // findByIdAndUpdate() = Tìm và cập nhật trong một lần
    // { new: true } = Trả về document sau khi update
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.hotelId,
      updateData,
      { new: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Bước 5: Xử lý upload ảnh mới (nếu có)
    const files = (req as any).files as any[];
    if (files && files.length > 0) {
      // Upload ảnh mới
      const updatedImageUrls = await uploadImages(files);
      
      // Kết hợp ảnh mới với ảnh cũ (nếu có)
      updatedHotel.imageUrls = [
        ...updatedImageUrls,
        ...(req.body.imageUrls
          ? Array.isArray(req.body.imageUrls)
            ? req.body.imageUrls
            : [req.body.imageUrls]
          : []),
      ];
      
      // Lưu lại hotel với ảnh mới
      await updatedHotel.save();
    }

    // Bước 6: Trả về response
    res.status(200).json(updatedHotel);
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ============================================
// FUNCTION: deleteMyHotel
// MỤC ĐÍCH: Xóa hotel
// ENDPOINT: DELETE /api/my-hotels/:hotelId
// MIDDLEWARE: verifyToken (đã được gọi ở routes)
// ============================================
export const deleteMyHotel = async (req: Request, res: Response) => {
  try {
    // Tìm và xóa hotel
    // Kiểm tra cả _id và userId để đảm bảo user chỉ xóa được hotel của mình
    const hotel = await Hotel.findOneAndDelete({
      _id: req.params.hotelId,
      userId: req.userId,
    });

    // Nếu không tìm thấy hotel
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Trả về response thành công
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting hotel" });
  }
};

