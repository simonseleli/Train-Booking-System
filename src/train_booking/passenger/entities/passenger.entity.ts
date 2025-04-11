import { Booking } from 'src/train_booking/booking/entities/booking.entity';
import { Ticket } from 'src/train_booking/ticket/entities/ticket.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Passenger {
  @PrimaryGeneratedColumn()
  passengerId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  // 
  @OneToMany(()=> Booking, (booking)=> booking.passengerThatBook)
  bookedByPassengers:Booking[];

  // 
  @OneToMany(()=>Ticket, (ticket)=> ticket.passengerTicket)
  ticketOfPassengers:Ticket[];


}
