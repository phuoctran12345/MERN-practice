import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SeasonalPricing, SeasonalPricingDocument } from "./schemas/seasonal-pricing.schema";
import { CreateSeasonalPricingDto } from "./dto/create-seasonal-pricing.dto";
import { UpdateSeasonalPricingDto } from "./dto/update-seasonal-pricing.dto";
import Hotel from "../../models/hotel"; // Import Mongoose Hotel model

@Injectable()
export class PricingService {
  constructor(
    @InjectModel(SeasonalPricing.name) private seasonalPricingModel: Model<SeasonalPricingDocument>
  ) {}

  async create(createSeasonalPricingDto: CreateSeasonalPricingDto): Promise<SeasonalPricing> {
    // Validate hotelId exists
    const hotel = await Hotel.findById(createSeasonalPricingDto.hotelId);
    if (!hotel) {
      throw new NotFoundException(
        `Hotel with ID ${createSeasonalPricingDto.hotelId} not found`
      );
    }

    // Validate dates
    const startDate = new Date(createSeasonalPricingDto.startDate);
    const endDate = new Date(createSeasonalPricingDto.endDate);
    
    if (startDate >= endDate) {
      throw new BadRequestException("Start date must be before end date");
    }

    // Check for overlapping pricing periods for the same hotel and room type
    const overlappingPricing = await this.seasonalPricingModel.findOne({
      hotelId: createSeasonalPricingDto.hotelId,
      roomType: createSeasonalPricingDto.roomType,
      isActive: true,
      $or: [
        { startDate: { $lt: endDate, $gte: startDate } }, // Starts within new period
        { endDate: { $gt: startDate, $lte: endDate } }, // Ends within new period
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } }, // Spans new period
      ],
    });

    if (overlappingPricing) {
      throw new BadRequestException(
        `Overlapping pricing period found for hotel ${createSeasonalPricingDto.hotelId} and room type ${createSeasonalPricingDto.roomType}`
      );
    }

    const createdSeasonalPricing = new this.seasonalPricingModel(createSeasonalPricingDto);
    return createdSeasonalPricing.save();
  }

  async findAll(
    hotelId?: string,
    roomType?: string,
    season?: string,
    isActive?: boolean,
    currentDate?: string
  ): Promise<SeasonalPricing[]> {
    const query: any = {};
    
    if (hotelId) {
      query.hotelId = hotelId;
    }
    
    if (roomType) {
      query.roomType = roomType;
    }
    
    if (season) {
      query.season = season;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    // Filter by current date (pricing that is currently valid)
    if (currentDate) {
      const date = new Date(currentDate);
      query.startDate = { $lte: date };
      query.endDate = { $gte: date };
    }

    return this.seasonalPricingModel.find(query).sort({ startDate: 1 }).exec();
  }

  async findOne(id: string): Promise<SeasonalPricing> {
    const seasonalPricing = await this.seasonalPricingModel.findById(id).exec();
    if (!seasonalPricing) {
      throw new NotFoundException(`Seasonal Pricing with ID ${id} not found`);
    }
    return seasonalPricing;
  }

  async update(id: string, updateSeasonalPricingDto: UpdateSeasonalPricingDto): Promise<SeasonalPricing> {
    const existingPricing = await this.seasonalPricingModel.findById(id);
    if (!existingPricing) {
      throw new NotFoundException(`Seasonal Pricing with ID ${id} not found`);
    }

    // Validate hotelId exists (nếu có update)
    if (updateSeasonalPricingDto.hotelId && updateSeasonalPricingDto.hotelId !== existingPricing.hotelId) {
      const hotel = await Hotel.findById(updateSeasonalPricingDto.hotelId);
      if (!hotel) {
        throw new NotFoundException(
          `Hotel with ID ${updateSeasonalPricingDto.hotelId} not found`
        );
      }
    }

    // Validate dates (nếu có update)
    if (updateSeasonalPricingDto.startDate || updateSeasonalPricingDto.endDate) {
      const startDate = new Date(updateSeasonalPricingDto.startDate || existingPricing.startDate);
      const endDate = new Date(updateSeasonalPricingDto.endDate || existingPricing.endDate);
      
      if (startDate >= endDate) {
        throw new BadRequestException("Start date must be before end date");
      }

      // Check for overlapping pricing periods (exclude current record)
      const hotelId = updateSeasonalPricingDto.hotelId || existingPricing.hotelId;
      const roomType = updateSeasonalPricingDto.roomType || existingPricing.roomType;
      
      const overlappingPricing = await this.seasonalPricingModel.findOne({
        _id: { $ne: id }, // Exclude current record
        hotelId: hotelId,
        roomType: roomType,
        isActive: true,
        $or: [
          { startDate: { $lt: endDate, $gte: startDate } },
          { endDate: { $gt: startDate, $lte: endDate } },
          { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
        ],
      });

      if (overlappingPricing) {
        throw new BadRequestException(
          `Overlapping pricing period found for hotel ${hotelId} and room type ${roomType}`
        );
      }
    }

    const updatedSeasonalPricing = await this.seasonalPricingModel
      .findByIdAndUpdate(id, updateSeasonalPricingDto, { new: true })
      .exec();
    
    if (!updatedSeasonalPricing) {
      throw new NotFoundException(`Seasonal Pricing with ID ${id} not found`);
    }
    
    return updatedSeasonalPricing;
  }

  async remove(id: string): Promise<any> {
    const result = await this.seasonalPricingModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Seasonal Pricing with ID ${id} not found`);
    }
    return { message: `Seasonal Pricing with ID ${id} deleted successfully` };
  }

  async getCurrentPrice(
    hotelId: string,
    roomType: string,
    checkDate: Date
  ): Promise<number | null> {
    const seasonalPricing = await this.seasonalPricingModel.findOne({
      hotelId: hotelId,
      $or: [
        { roomType: roomType },
        { roomType: "ALL" } // Fallback to ALL room types
      ],
      isActive: true,
      startDate: { $lte: checkDate },
      endDate: { $gte: checkDate },
    }).sort({ roomType: 1 }).exec(); // Prioritize specific room type over ALL

    return seasonalPricing ? seasonalPricing.pricePerNight : null;
  }

  async getPriceRange(
    hotelId: string,
    roomType: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ minPrice: number; maxPrice: number; avgPrice: number } | null> {
    const seasonalPricings = await this.seasonalPricingModel.find({
      hotelId: hotelId,
      $or: [
        { roomType: roomType },
        { roomType: "ALL" }
      ],
      isActive: true,
      $or: [
        { startDate: { $lt: endDate, $gte: startDate } },
        { endDate: { $gt: startDate, $lte: endDate } },
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
      ],
    }).exec();

    if (seasonalPricings.length === 0) {
      return null;
    }

    const prices = seasonalPricings.map(p => p.pricePerNight);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    return { minPrice, maxPrice, avgPrice: Math.round(avgPrice) };
  }
}
