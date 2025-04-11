import { Booking } from 'src/train_booking/booking/entities/booking.entity';
import { Route } from 'src/train_booking/route/entities/route.entity';
import { Train } from 'src/train_booking/train/entities/train.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class TrainSeat {
  @PrimaryGeneratedColumn()
  seatId: number;

  @Column()
  seatNumber: number;

  @Column({ default: false })
  isBooked: boolean;

  // Link to the booking (if a seat is booked)
  @ManyToOne(() => Booking, (booking) => booking.bookedSeats)
  bookingSeat: Booking; // A seat can be linked to one booking

  // Link to the train where the seat exists
  @ManyToOne(() => Train, (train) => train.trainSeats)
  bookedTrain: Train; // A seat belongs to a specific train

  // Link to the route for which the seat is valid (seats exist for specific routes)
  @ManyToOne(() => Route, (route) => route.seatsTakenByTrains)
  routesByTrain: Route; // A seat is also linked to the specific route it serves

  
}
