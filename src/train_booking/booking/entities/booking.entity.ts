import { Passenger } from 'src/train_booking/passenger/entities/passenger.entity';
import { Route } from 'src/train_booking/route/entities/route.entity';
import { Station } from 'src/train_booking/station/entities/station.entity';
import { Ticket } from 'src/train_booking/ticket/entities/ticket.entity';
import { TrainSeat } from 'src/train_booking/train-seat/entities/train-seat.entity';
import { Train } from 'src/train_booking/train/entities/train.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';


@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  bookingId: number;

  @Column()
  seatCount: number;

  @Column()
  bookingDate: string;

  @Column({ default: 'draft' })
  state: 'draft' | 'confirmed' | 'cancelled';

  // Modify: Link to a specific train that is booked
  @ManyToOne(() => Train, (train) => train.bookedByTrains)
  @JoinColumn({ name: 'trainId' })
  trainThatBook: Train; // A booking refers to a specific train

  // Modify: Link to a specific route for the booking
  @ManyToOne(() => Route, (route) => route.bookingsToRoute)
  @JoinColumn({ name: 'routeId' })
  bookedRoute: Route; // A booking refers to a specific route
  
  // Link to the passenger who made the booking
  @ManyToOne(() => Passenger, (passenger) => passenger.bookedByPassengers)
  passengerThatBook: Passenger;

  // Link to the tickets for the booking (to handle ticket generation)
  @OneToMany(() => Ticket, (ticket) => ticket.bookingTicket)
  tickets: Ticket[];

  // Modify: A booking can have multiple selected train seats (linked via train-seat entity)
  @OneToMany(() => TrainSeat, (trainSeat) => trainSeat.bookingSeat)
  bookedSeats: TrainSeat[]; // Each booking can have multiple seats

}
