import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from './entities/passenger.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Ticket } from '../ticket/entities/ticket.entity';

@Module({
  controllers: [PassengerController],
  imports: [TypeOrmModule.forFeature([Passenger, Booking, Ticket])], 
  providers: [PassengerService],
})
export class PassengerModule {}
