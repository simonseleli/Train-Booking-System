import { Module } from '@nestjs/common';
import { TrainService } from './train.service';
import { TrainController } from './train.controller';
import { TrainSeat } from '../train-seat/entities/train-seat.entity';
import { Train } from './entities/train.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../booking/entities/booking.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { Route } from '../route/entities/route.entity';

@Module({
  controllers: [TrainController],
  providers: [TrainService],
  imports: [TypeOrmModule.forFeature([TrainSeat, Booking, Train, Ticket, Route])], 
})
export class TrainModule {}
