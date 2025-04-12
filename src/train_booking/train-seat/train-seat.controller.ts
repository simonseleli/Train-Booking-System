import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TrainSeatService } from './train-seat.service';

@Controller('train-seat')
export class TrainSeatController {
  constructor(private readonly trainSeatService: TrainSeatService) {}

  // ✅ Create seats for a train on a route
  @Post('create/:trainId/:routeId')
  async createSeats(
    @Param('trainId', ParseIntPipe) trainId: number,
    @Param('routeId', ParseIntPipe) routeId: number,
  ) {
    return this.trainSeatService.createSeatsForTrain(trainId, routeId);
  }

  // ✅ Get seats by train and route
  @Get('getSeats/:trainId/:routeId')
  async getSeats(
    @Param('trainId', ParseIntPipe) trainId: number,
    @Param('routeId', ParseIntPipe) routeId: number,
  ) {
    return this.trainSeatService.getSeatsByTrainAndRoute(trainId, routeId);
  }

  // ✅ Mark seats as booked
  @Post('book')
  async bookSeats(@Body('seatIds') seatIds: number[]) {
    await this.trainSeatService.markSeatsAsBooked(seatIds);
    return { message: 'Seats booked successfully', seatIds };
  }

  // ✅ Unbook seats
  @Post('unbook')
  async unbookSeats(@Body('seatIds') seatIds: number[]) {
    await this.trainSeatService.unbookSeats(seatIds);
    return { message: 'Seats unbooked successfully', seatIds };
  }

  // ✅ Get individual seat details
  @Get('getSeat/:seatId')
  async getSeat(@Param('seatId', ParseIntPipe) seatId: number) {
    return this.trainSeatService.findOne(seatId);
  }

  // ❌ Optional - Delete a seat (dev/testing only)
  @Delete('deleteSeat/:seatId')
  async deleteSeat(@Param('seatId', ParseIntPipe) seatId: number) {
    return this.trainSeatService.remove(seatId);
  }
}
