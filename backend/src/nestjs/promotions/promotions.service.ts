import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Promotion, PromotionDocument } from "./schemas/promotion.schema";
import { CreatePromotionDto } from "./dto/create-promotion.dto";
import { UpdatePromotionDto } from "./dto/update-promotion.dto";
import Hotel from "../../models/hotel"; // Import Mongoose Hotel model

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>
  ) {}

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    // Validate hotelId exists (nếu có)
    if (createPromotionDto.hotelId) {
      const hotel = await Hotel.findById(createPromotionDto.hotelId);
      if (!hotel) {
        throw new NotFoundException(
          `Hotel with ID ${createPromotionDto.hotelId} not found`
        );
      }
    }

    // Validate dates
    const startDate = new Date(createPromotionDto.startDate);
    const endDate = new Date(createPromotionDto.endDate);
    
    if (startDate >= endDate) {
      throw new BadRequestException("Start date must be before end date");
    }

    if (startDate < new Date()) {
      throw new BadRequestException("Start date cannot be in the past");
    }

    // Validate discount value based on type
    if (createPromotionDto.discountType === "PERCENTAGE" && createPromotionDto.discountValue > 100) {
      throw new BadRequestException("Percentage discount cannot exceed 100%");
    }

    const createdPromotion = new this.promotionModel(createPromotionDto);
    return createdPromotion.save();
  }

  async findAll(
    hotelId?: string,
    isActive?: boolean,
    currentDate?: string
  ): Promise<Promotion[]> {
    const query: any = {};
    
    if (hotelId) {
      query.$or = [
        { hotelId: hotelId },
        { hotelId: null } // Global promotions
      ];
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    // Filter by current date (promotions that are currently valid)
    if (currentDate) {
      const date = new Date(currentDate);
      query.startDate = { $lte: date };
      query.endDate = { $gte: date };
    }

    return this.promotionModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Promotion> {
    const promotion = await this.promotionModel.findById(id).exec();
    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
    return promotion;
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    const existingPromotion = await this.promotionModel.findById(id);
    if (!existingPromotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    // Validate hotelId exists (nếu có update)
    if (updatePromotionDto.hotelId && updatePromotionDto.hotelId !== existingPromotion.hotelId) {
      const hotel = await Hotel.findById(updatePromotionDto.hotelId);
      if (!hotel) {
        throw new NotFoundException(
          `Hotel with ID ${updatePromotionDto.hotelId} not found`
        );
      }
    }

    // Validate dates (nếu có update)
    if (updatePromotionDto.startDate || updatePromotionDto.endDate) {
      const startDate = new Date(updatePromotionDto.startDate || existingPromotion.startDate);
      const endDate = new Date(updatePromotionDto.endDate || existingPromotion.endDate);
      
      if (startDate >= endDate) {
        throw new BadRequestException("Start date must be before end date");
      }
    }

    // Validate discount value based on type (nếu có update)
    const discountType = updatePromotionDto.discountType || existingPromotion.discountType;
    const discountValue = updatePromotionDto.discountValue || existingPromotion.discountValue;
    
    if (discountType === "PERCENTAGE" && discountValue > 100) {
      throw new BadRequestException("Percentage discount cannot exceed 100%");
    }

    const updatedPromotion = await this.promotionModel
      .findByIdAndUpdate(id, updatePromotionDto, { new: true })
      .exec();
    
    if (!updatedPromotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
    
    return updatedPromotion;
  }

  async remove(id: string): Promise<any> {
    const result = await this.promotionModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
    return { message: `Promotion with ID ${id} deleted successfully` };
  }

  async findActivePromotions(hotelId?: string): Promise<Promotion[]> {
    const currentDate = new Date();
    const query: any = {
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    };

    if (hotelId) {
      query.$or = [
        { hotelId: hotelId },
        { hotelId: null } // Global promotions
      ];
    }

    return this.promotionModel.find(query).sort({ discountValue: -1 }).exec();
  }

  async incrementUsage(id: string): Promise<Promotion> {
    const promotion = await this.promotionModel.findById(id);
    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    if (promotion.maxUsage && promotion.currentUsage >= promotion.maxUsage) {
      throw new BadRequestException("Promotion usage limit exceeded");
    }

    promotion.currentUsage += 1;
    return promotion.save();
  }
}
