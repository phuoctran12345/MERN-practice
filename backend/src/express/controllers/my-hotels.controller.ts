import { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../../models/hotel";
import { HotelType } from "types";


// ============================================
// MỤC ĐÍCH: Upload ảnh lên Cloudinary
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
// POST /api/my-hotels
  export const createHotel = async (req: Request, res: Response) => { 
    try {
        // B1: Lấy image files và hotel data từ request
        const imageFiles = (req as any).files as any[];
        const newHotel: HotelType = req.body;

        // Kiểm tra imageFiles
        if (!imageFiles || imageFiles.length === 0) {
            console.log("⚠️ Không có file ảnh được upload");
            // Vẫn tiếp tục, nhưng imageUrls sẽ là mảng rỗng
        }


        // B2: Đảm bảo type và facilities luôn là array
        // nếu FE gửi string, chuyển thành array
        if (typeof newHotel.type === "string") {
            // Nếu là string dạng "business,luxury" -> split thành array
            const typeStr = newHotel.type as string;
            newHotel.type = typeStr.includes(",") 
                ? typeStr.split(",").map(t => t.trim())
                : [typeStr];
        }
        
        if (typeof newHotel.facilities === "string") {
            // Nếu là string dạng "WiFi,Pool,Gym" -> split thành array
            const facilitiesStr = newHotel.facilities as string;
            newHotel.facilities = facilitiesStr.includes(",")
                ? facilitiesStr.split(",").map(f => f.trim())
                : [facilitiesStr];
        }

        // B3: Xử lý nested fields (location, contact, policies, amenities)
        // FormData gửi nested object dưới dạng "contact.phone", "contact.email"

        newHotel.contact ={
            phone: newHotel.contact?.phone || "",
            email: newHotel.contact?.email || "",
            website: newHotel.contact?.website || "",
        };

        newHotel.policies ={
            checkInTime: newHotel.policies?.checkInTime || "",
            checkOutTime: newHotel.policies?.checkOutTime || "",
            cancellationPolicy: newHotel.policies?.cancellationPolicy || "",
            petPolicy: newHotel.policies?.petPolicy || "",
            smokingPolicy: newHotel.policies?.smokingPolicy || "",
        };


        // B4: Upload ảnh lên Cloudinary
        let imageUrls: string[] = [];
        if (imageFiles && imageFiles.length > 0) {
            try {
                imageUrls = await uploadImages(imageFiles);
                console.log("✅ Upload ảnh thành công:", imageUrls.length, "ảnh");
            } catch (uploadError) {
                console.error("❌ Lỗi upload ảnh lên Cloudinary:", uploadError);
                // Nếu lỗi upload, vẫn tiếp tục tạo hotel nhưng không có ảnh
                imageUrls = [];
            }
        }

        // B5: Gán imageUrls và metadata
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId; // Lấy từ middleware verifyToken

        // B6: Tạo và lưu hotel vào database
        const hotel = new Hotel(newHotel);
        await hotel.save();

        // B7: Trả về response
        res.status(201).send(hotel);
    }catch (error){
        console.error("❌ Lỗi createHotel:");
        console.error("Error details:", error);
        console.error("Error message:", error instanceof Error ? error.message : String(error));
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
        res.status(500).json({ 
            message: "Lỗi khi tạo khách sạn",
            error: error instanceof Error ? error.message : String(error)
        });
    }
  }

// ============================================
//GET /api/my-hotels
//Lấy tất cả hotels của user hiện tại
export const getMyHotels = async (req: Request, res: Response) => {
    try {
        // tìm tất cả các hotels có userId = req.userId
        // req.userId được set bởi middleware verifyToken
        const hotels = await Hotel.find({ userId: req.userId });
        res.json(hotels);
    } catch (error) {
        console.log("Lỗi getMyHotels: " + error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách khách sạn" });
    }
}

// ============================================
// GET /api/my-hotels/:id
// lấy một hotel cụ thể của user
export const getMyHotelById = async (req: Request, res: Response) => {
    try{
        const id = req.params.id.toString(); //. Ví dụ nếu URL là /api/my-hotels/6588f123, thì req.params.id chính là chuỗi 6588f123.
        const hotel = await Hotel.findOne({ _id: id, userId: req.userId });
        if (!hotel) {
            return res.status(404).json({ message: "Không tìm thấy khách sạn" });
        }
        res.json(hotel);
    } catch (error) {
        console.log("Lỗi getMyHotelById: " + error);
        res.status(500).json({ message: "Lỗi khi lấy thông tin khách sạn" });
    }
}

// ============================================
// PUT /api/my-hotels/:id
// cập nhật một hotel cụ thể của user
export const updateMyHotel = async (req: Request, res: Response) => {
    try{
        //B1: Tìm hotel hiện tại
        // kiểm tra cả _id và userId để đảm bảo user chỉ update được hotel của mình
        const existingHotel = await Hotel.findOne({ 
            _id: req.params.id, 
            userId: req.userId 
        });


        // Nếu không tìm thấy hotel
        if (!existingHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        // B2: Chuẩn bị dữ liệu update
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
        console.log("Lỗi updateMyHotelById: " + error);
        res.status(500).json({ message: "Lỗi khi cập nhật thông tin khách sạn" });
    }
}


// ============================================
// /DELETE /api/my-hotels/:hotelId
export const deleteMyHotel = async (req: Request, res: Response) => {
    try{
        // Tìm và xoá hotel hiện tại 
        const hotel = await Hotel.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!hotel) {
            return res.status(404).json({ message: "Không tìm thấy khách sạn" });
        }
        res.status(200).json({ message: "Xoá khách sạn thành công", hotel });
    } catch (error) {
        console.log("Lỗi deleteMyHotel: " + error);
        res.status(500).json({ message: "Lỗi khi xóa khách sạn" });
    }
}   
