import { Booking } from 'src/train_booking/booking/entities/booking.entity';
import { Station } from 'src/train_booking/station/entities/station.entity';
import { TrainSeat } from 'src/train_booking/train-seat/entities/train-seat.entity';
import { Train } from 'src/train_booking/train/entities/train.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';


@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  routeId: number;

  @Column({ type: 'date' })
  departureDate: Date;  // Use 'date' for the departure day

  @Column({ type: 'time' })
  departureTime: string;  // Use 'time' for precise time (HH:MM:SS)

  @Column({ type: 'time' })
  arrivalTime: string;  // Use 'time' for precise time (HH:MM:SS)

  // 
  @OneToMany(()=> Booking, (booking)=> booking.bookedRoute)
  bookingsToRoute:Booking[];

  // 
  @OneToMany(()=> TrainSeat, (trainSeat)=> trainSeat.routesByTrain)
  seatsTakenByTrains:TrainSeat[];

  // 
  @ManyToOne(()=> Train, (train)=> train.routeTakenByTrain)
  trainTakingRoute:Train;

  // 
  @ManyToOne(()=> Station, (station)=> station.routeDepartingStaion)
  departureStation:Station;

  // 
  @ManyToOne(()=> Station, (station)=> station.routeDepartingStaions)
  arrivalStation:Station;


}