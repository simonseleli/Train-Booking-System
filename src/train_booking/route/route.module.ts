import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { Route } from './entities/route.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../booking/entities/booking.entity';
import { TrainSeat } from '../train-seat/entities/train-seat.entity';
import { Train } from '../train/entities/train.entity';
import { Station } from '../station/entities/station.entity';

@Module({
  controllers: [RouteController],
  providers: [RouteService],
  imports: [TypeOrmModule.forFeature([Route, Booking, TrainSeat, Train, Station])], 
})
export class RouteModule {}
