import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  /**
   * Create a booking
   * POST /bookings
   */
  @Post('create')
  async createBooking(
    @Body('passengerId', ParseIntPipe) passengerId: number,
    @Body('trainId', ParseIntPipe) trainId: number,
    @Body('routeId', ParseIntPipe) routeId: number,
    @Body('seatIds') seatIds: number[],
  ): Promise<Booking> {
    return this.bookingService.createBooking(passengerId, trainId, routeId, seatIds);
  }

  /**
   * Cancel a booking
   * DELETE /bookings/:id
   */
  @Delete('cancel/:id')
  async cancelBooking(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.bookingService.cancelBooking(id);
  }

  /**
   * Get all bookings
   * GET /bookings
   */
  @Get('findAll')
  async findAll(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  /**
   * Get booking by ID
   * GET /bookings/:id
   */
  @Get('findOne/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
    return this.bookingService.findOne(id);
  }
}
