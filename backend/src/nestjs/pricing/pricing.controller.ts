import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from "@nestjs/common";
import { PricingService } from "./pricing.service";
import { CreateSeasonalPricingDto } from "./dto/create-seasonal-pricing.dto";
import { UpdateSeasonalPricingDto } from "./dto/update-seasonal-pricing.dto";

@Controller("api/v2/pricing")
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  /**
   * POST /api/v2/pricing/seasonal
   * Tạo giá theo mùa mới
   */
  @Post("seasonal")
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createSeasonalPricingDto: CreateSeasonalPricingDto) {
    return this.pricingService.create(createSeasonalPricingDto);
  }

  /**
   * GET /api/v2/pricing/seasonal
   * Lấy danh sách giá theo mùa với filters
   */
  @Get("seasonal")
  findAll(
    @Query("hotelId") hotelId?: string,
    @Query("roomType") roomType?: string,
    @Query("season") season?: string,
    @Query("isActive") isActive?: string,
    @Query("currentDate") currentDate?: string
  ) {
    const isActiveBool = isActive === "true" ? true : isActive === "false" ? false : undefined;
    return this.pricingService.findAll(hotelId, roomType, season, isActiveBool, currentDate);
  }

  /**
   * GET /api/v2/pricing/seasonal/:id
   * Lấy chi tiết giá theo mùa
   */
  @Get("seasonal/:id")
  findOne(@Param("id") id: string) {
    return this.pricingService.findOne(id);
  }

  /**
   * PATCH /api/v2/pricing/seasonal/:id
   * Cập nhật giá theo mùa
   */
  @Patch("seasonal/:id")
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param("id") id: string, @Body() updateSeasonalPricingDto: UpdateSeasonalPricingDto) {
    return this.pricingService.update(id, updateSeasonalPricingDto);
  }

  /**
   * DELETE /api/v2/pricing/seasonal/:id
   * Xóa giá theo mùa
   */
  @Delete("seasonal/:id")
  remove(@Param("id") id: string) {
    return this.pricingService.remove(id);
  }

  /**
   * GET /api/v2/pricing/current
   * Lấy giá hiện tại cho hotel và room type cụ thể
   */
  @Get("current")
  async getCurrentPrice(
    @Query("hotelId") hotelId: string,
    @Query("roomType") roomType: string,
    @Query("date") date?: string
  ) {
    if (!hotelId || !roomType) {
      throw new BadRequestException("hotelId and roomType are required query parameters.");
    }

    const checkDate = date ? new Date(date) : new Date();
    
    if (isNaN(checkDate.getTime())) {
      throw new BadRequestException("Invalid date format.");
    }

    const price = await this.pricingService.getCurrentPrice(hotelId, roomType, checkDate);
    
    return {
      hotelId,
      roomType,
      date: checkDate,
      pricePerNight: price,
    };
  }

  /**
   * GET /api/v2/pricing/range
   * Lấy khoảng giá cho một khoảng thời gian
   */
  @Get("range")
  async getPriceRange(
    @Query("hotelId") hotelId: string,
    @Query("roomType") roomType: string,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string
  ) {
    if (!hotelId || !roomType || !startDate || !endDate) {
      throw new BadRequestException("hotelId, roomType, startDate, and endDate are required query parameters.");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException("Invalid date format for startDate or endDate.");
    }

    if (start >= end) {
      throw new BadRequestException("startDate must be before endDate.");
    }

    const priceRange = await this.pricingService.getPriceRange(hotelId, roomType, start, end);
    
    return {
      hotelId,
      roomType,
      startDate: start,
      endDate: end,
      priceRange,
    };
  }
}
