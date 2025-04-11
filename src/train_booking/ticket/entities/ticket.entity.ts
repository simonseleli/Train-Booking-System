import { Booking } from 'src/train_booking/booking/entities/booking.entity';
import { Passenger } from 'src/train_booking/passenger/entities/passenger.entity';
import { Station } from 'src/train_booking/station/entities/station.entity';
import { Train } from 'src/train_booking/train/entities/train.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';


@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  ticketId: number;

  @Column()
  seatCount: number;

  @Column()
  bookingDate: Date;

  @Column()
  ticketNumber: string;

  // 
  @ManyToOne(()=> Booking, (booking)=> booking.tickets)
  bookingTicket:Booking;

  // 
  @ManyToOne(()=> Passenger, (passenger)=> passenger.ticketOfPassengers)
  passengerTicket:Passenger;

  // 
  @ManyToOne(()=> Train, (train)=> train.ticketofTrains)
  trainTicket:Train;

}
