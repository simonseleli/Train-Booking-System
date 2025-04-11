import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Ticket } from './entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../booking/entities/booking.entity';
import { Train } from '../train/entities/train.entity';
import { Passenger } from '../passenger/entities/passenger.entity';

@Module({
  controllers: [TicketController],
  providers: [TicketService],
  imports: [TypeOrmModule.forFeature([Ticket, Booking, Train, Passenger])], 
})
export class TicketModule {}
