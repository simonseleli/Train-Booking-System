import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from '../passenger/entities/passenger.entity';
import { Booking } from './entities/booking.entity';
import { Train } from '../train/entities/train.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { Route } from '../route/entities/route.entity';
import { TrainSeat } from '../train-seat/entities/train-seat.entity';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [TypeOrmModule.forFeature([Booking, Passenger, Train, Ticket,Route,TrainSeat])],
})
export class BookingModule {}
