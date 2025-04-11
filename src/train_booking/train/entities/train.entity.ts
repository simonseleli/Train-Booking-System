import { Booking } from 'src/train_booking/booking/entities/booking.entity';
import { Route } from 'src/train_booking/route/entities/route.entity';
import { Ticket } from 'src/train_booking/ticket/entities/ticket.entity';
import { TrainSeat } from 'src/train_booking/train-seat/entities/train-seat.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Train {
  @PrimaryGeneratedColumn()
  trainId: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  capacity: number;

  @Column() 
  trainNo: string;

  @Column()
  trainType: 'express' | 'passenger' | 'freight';

  @Column({ default: true })
  active: boolean;

  @Column({ default: 0 })
  bookedSeats: number;

  @Column({ default: 0 })
  availableSeats: number;

  // 
  @OneToMany(()=> Booking, (booking)=>booking.trainThatBook)
  bookedByTrains:Booking[]

  // 
  @OneToMany(()=> TrainSeat, (trainSeat)=> trainSeat.bookedTrain)
  trainSeats:TrainSeat[];

  // 
  @OneToMany(()=> Ticket, (ticket)=> ticket.trainTicket)
  ticketofTrains:Ticket[];

  // 
  @OneToMany(()=> Route, (route)=> route.trainTakingRoute)
  routeTakenByTrain:Route[];

  
}
