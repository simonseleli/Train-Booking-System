import { Module } from '@nestjs/common';
import { TrainSeatService } from './train-seat.service';
import { TrainSeatController } from './train-seat.controller';
import { Train } from '../train/entities/train.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainSeat } from './entities/train-seat.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Route } from '../route/entities/route.entity';

@Module({
  controllers: [TrainSeatController],
  providers: [TrainSeatService],
  imports: [TypeOrmModule.forFeature([Train,TrainSeat, Booking, Route])], 
})
export class TrainSeatModule {}
