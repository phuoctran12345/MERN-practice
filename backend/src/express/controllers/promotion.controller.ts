import { Request, Response } from "express";
import Promotion from "../../models/promotion";
import Hotel from "../../models/hotel";
import { validationResult } from "express-validator";

// ============================================
// POST /api/v2/promotions
// Tạo khuyến mãi mới (Manager)
export const createPromotion = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Dữ liệu không hợp lệ", 
        errors: errors.array() 
      });
    }

    const {
      hotelId,
      name,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      minStay,
      maxUsage,
      isActive,
    } = req.body;

    // Validate hotelId exists (nếu có)
    if (hotelId) {
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({ 
          message: `Không tìm thấy khách sạn với ID ${hotelId}` 
        });
      }
    }

    // Validate dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    if (startDateObj >= endDateObj) {
      return res.status(400).json({ 
        message: "Ngày bắt đầu phải trước ngày kết thúc" 
      });
    }

    if (startDateObj < new Date()) {
      return res.status(400).json({ 
        message: "Ngày bắt đầu không thể là quá khứ" 
      });
    }

    // Validate discount value based on type
    if (discountType === "PERCENTAGE" && discountValue > 100) {
      return res.status(400).json({ 
        message: "Giảm giá phần trăm không thể vượt quá 100%" 
      });
    }

    const promotion = new Promotion({
      hotelId: hotelId || null,
      name,
      description,
      discountType,
      discountValue,
      startDate: startDateObj,
      endDate: endDateObj,
      minStay,
      maxUsage,
      currentUsage: 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await promotion.save();

    res.status(201).json({
      message: "Tạo khuyến mãi thành công",
      promotion,
    });
  } catch (error) {
    console.error("❌ Lỗi createPromotion:", error);
    res.status(500).json({ 
      message: "Lỗi khi tạo khuyến mãi",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// GET /api/v2/promotions
// Lấy danh sách khuyến mãi với filters (Manager)
export const getAllPromotions = async (req: Request, res: Response) => {
  try {
    const { hotelId, isActive, currentDate } = req.query;

    const query: any = {};
    
    if (hotelId) {
      query.$or = [
        { hotelId: hotelId as string },
        { hotelId: null } // Global promotions
      ];
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    // Filter by current date (promotions that are currently valid)
    if (currentDate) {
      const date = new Date(currentDate as string);
      query.startDate = { $lte: date };
      query.endDate = { $gte: date };
    }

    const promotions = await Promotion.find(query)
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      message: "Lấy danh sách khuyến mãi thành công",
      count: promotions.length,
      promotions,
    });
  } catch (error) {
    console.error("❌ Lỗi getAllPromotions:", error);
    res.status(500).json({ 
      message: "Lỗi khi lấy danh sách khuyến mãi",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// GET /api/v2/promotions/active
// Lấy danh sách khuyến mãi đang hoạt động
export const getActivePromotions = async (req: Request, res: Response) => {
  try {
    const { hotelId } = req.query;
    const currentDate = new Date();
    
    const query: any = {
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    };

    if (hotelId) {
      query.$or = [
        { hotelId: hotelId as string },
        { hotelId: null } // Global promotions
      ];
    }

    const promotions = await Promotion.find(query)
      .sort({ discountValue: -1 })
      .exec();

    res.status(200).json({
      message: "Lấy danh sách khuyến mãi đang hoạt động thành công",
      count: promotions.length,
      promotions,
    });
  } catch (error) {
    console.error("❌ Lỗi getActivePromotions:", error);
    res.status(500).json({ 
      message: "Lỗi khi lấy danh sách khuyến mãi đang hoạt động",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// GET /api/v2/promotions/:id
// Lấy thông tin một khuyến mãi cụ thể
export const getPromotionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({ 
        message: `Không tìm thấy khuyến mãi với ID ${id}` 
      });
    }

    res.status(200).json({
      message: "Lấy thông tin khuyến mãi thành công",
      promotion,
    });
  } catch (error) {
    console.error("❌ Lỗi getPromotionById:", error);
    res.status(500).json({ 
      message: "Lỗi khi lấy thông tin khuyến mãi",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// PATCH /api/v2/promotions/:id
// Cập nhật khuyến mãi (Manager)
export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Dữ liệu không hợp lệ", 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const existingPromotion = await Promotion.findById(id);
    if (!existingPromotion) {
      return res.status(404).json({ 
        message: `Không tìm thấy khuyến mãi với ID ${id}` 
      });
    }

    // Validate hotelId exists (nếu có update)
    if (updateData.hotelId && updateData.hotelId !== existingPromotion.hotelId) {
      const hotel = await Hotel.findById(updateData.hotelId);
      if (!hotel) {
        return res.status(404).json({ 
          message: `Không tìm thấy khách sạn với ID ${updateData.hotelId}` 
        });
      }
    }

    // Validate dates (nếu có update)
    if (updateData.startDate || updateData.endDate) {
      const startDate = new Date(updateData.startDate || existingPromotion.startDate);
      const endDate = new Date(updateData.endDate || existingPromotion.endDate);
      
      if (startDate >= endDate) {
        return res.status(400).json({ 
          message: "Ngày bắt đầu phải trước ngày kết thúc" 
        });
      }
    }

    // Validate discount value based on type (nếu có update)
    const discountType = updateData.discountType || existingPromotion.discountType;
    const discountValue = updateData.discountValue || existingPromotion.discountValue;
    
    if (discountType === "PERCENTAGE" && discountValue > 100) {
      return res.status(400).json({ 
        message: "Giảm giá phần trăm không thể vượt quá 100%" 
      });
    }

    // Convert dates if provided
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    const updatedPromotion = await Promotion.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedPromotion) {
      return res.status(404).json({ 
        message: `Không tìm thấy khuyến mãi với ID ${id}` 
      });
    }

    res.status(200).json({
      message: "Cập nhật khuyến mãi thành công",
      promotion: updatedPromotion,
    });
  } catch (error) {
    console.error("❌ Lỗi updatePromotion:", error);
    res.status(500).json({ 
      message: "Lỗi khi cập nhật khuyến mãi",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// DELETE /api/v2/promotions/:id
// Xóa khuyến mãi (Manager)
export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({ 
        message: `Không tìm thấy khuyến mãi với ID ${id}` 
      });
    }

    await Promotion.findByIdAndDelete(id);

    res.status(200).json({
      message: `Xóa khuyến mãi với ID ${id} thành công`,
    });
  } catch (error) {
    console.error("❌ Lỗi deletePromotion:", error);
    res.status(500).json({ 
      message: "Lỗi khi xóa khuyến mãi",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// POST /api/v2/promotions/:id/increment-usage
// Tăng số lần sử dụng khuyến mãi (khi áp dụng vào booking)
export const incrementPromotionUsage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({ 
        message: `Không tìm thấy khuyến mãi với ID ${id}` 
      });
    }

    if (promotion.maxUsage && promotion.currentUsage >= promotion.maxUsage) {
      return res.status(400).json({ 
        message: "Đã đạt giới hạn sử dụng khuyến mãi" 
      });
    }

    promotion.currentUsage += 1;
    await promotion.save();

    res.status(200).json({
      message: "Tăng số lần sử dụng khuyến mãi thành công",
      promotion,
    });
  } catch (error) {
    console.error("❌ Lỗi incrementPromotionUsage:", error);
    res.status(500).json({ 
      message: "Lỗi khi tăng số lần sử dụng khuyến mãi",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};



// ============================================
// GET /api/v2/promotions/validate
// Validate promotion code và tính toán discount (Public - không cần auth)
export const validatePromotionCode = async (req: Request, res: Response) => {
  try {
    const { code , hotelId, checkIn, checkOut, numberOfNights , totalCost} = req.body;

    //validate input
    if (!code || !hotelId || !checkIn || !checkOut || !numberOfNights ||  !totalCost) {
      return res.status(400).json({ 
        message: "Dữ liệu không hợp lệ , thông tin bắt buộc code , hotelId, checkIn, checkOut, numberOfNights , totalCost" 
      });
    }



    //Tìm promotion theo name
    const promotion = await Promotion.findOne({ 
      name: code ,
      isActive:true,
    }).exec();


    if (!promotion) {
      return res.status(404).json({ 
        message: "Mã khuyến mãi không tồn tại hoặc đã bị vô hiệu hoá"
      })
    }

    //validate date range 
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const currentDate = new Date();


    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ 
        message: "Ngày check-in phải trước ngày check-out"
      });
    }


    if (checkInDate > currentDate) {
      return res.status(400).json({ 
        message: "Ngày check-in không thể là quá khứ"
      });
    }


    if (promotion.endDate < currentDate) {
      return res.status(400).json({
        message: "Mã khuyến mãi đã hết hạn",
        valid: false,
      });
    }

    // Validate hotelId (nếu promotion có hotelId cụ thể)
    if (promotion.hotelId && promotion.hotelId !== hotelId) {
      return res.status(400).json({
        message: "Mã khuyến mãi không áp dụng cho khách sạn này",
        valid: false,
      });
    }

    // Validate minStay (số đêm tối thiểu)
    if (promotion.minStay && numberOfNights < promotion.minStay) {
      return res.status(400).json({
        message: `Mã khuyến mãi yêu cầu tối thiểu ${promotion.minStay} đêm`,
        valid: false,
      });
    }

    // Validate maxUsage (số lần sử dụng tối đa)
    if (promotion.maxUsage && promotion.currentUsage >= promotion.maxUsage) {
      return res.status(400).json({
        message: "Mã khuyến mãi đã đạt giới hạn sử dụng",
        valid: false,
      });
    }


    // TÍnh toán discount amount
    let discountAmount = 0;
    if (promotion.discountType === "PERCENTAGE") {
      // Giảm giá theo phần trăm 
      discountAmount = Math.round(totalCost * (promotion.discountValue / 100));
    } else if (promotion.discountType === "FIXED_AMOUNT") {
      // Giảm giá theo số tiền cố định
      discountAmount = promotion.discountValue;
       // Đảm bảo discount không vượt quá totalCost
      if( discountAmount > totalCost) {
        discountAmount = totalCost;
      }
    }
    // Tính final price sau khi giảm giá
    const finalPrice = totalCost - discountAmount;
    
    res.status(200).json({
      message: "Mã khuyến mãi hợp lệ",
      valid: true,
      promotion: {
        _id: promotion._id,
        name: promotion.name,
        description: promotion.description,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue,        
      },
      discountAmount,
      finalPrice,
      orginalPrice: totalCost,
    })    




  }catch (error) {
    console.error("❌ Lỗi validatePromotionCode:", error);
    res.status(500).json({ 
      message: "Lỗi khi validate mã khuyến mãi",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
