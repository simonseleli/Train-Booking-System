import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passenger } from '../passenger/entities/passenger.entity';
import { Route } from '../route/entities/route.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { TrainSeat } from '../train-seat/entities/train-seat.entity';
import { Train } from '../train/entities/train.entity';
import { Booking } from './entities/booking.entity';
import { In } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    @InjectRepository(Train)
    private trainRepo: Repository<Train>,

    @InjectRepository(Route)
    private routeRepo: Repository<Route>,

    @InjectRepository(Passenger)
    private passengerRepo: Repository<Passenger>,

    @InjectRepository(TrainSeat)
    private trainSeatRepo: Repository<TrainSeat>,

    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
  ) {}

  /**
   * Create a booking
   */
  async createBooking(
    passengerId: number,
    trainId: number,
    routeId: number,
    seatIds: number[],
  ): Promise<any> {
    const passenger = await this.passengerRepo.findOne({
      where: { passengerId },
    });
    const train = await this.trainRepo.findOne({ where: { trainId } });
    const route = await this.routeRepo.findOne({ where: { routeId } });
  
    if (!passenger || !train || !route)
      throw new NotFoundException('Passenger, Train or Route not found');
  
    // Fetch and validate seats
    const seats = await this.trainSeatRepo.find({
      where: { seatId: In(seatIds) },
      relations: ['bookedTrain', 'routesByTrain'],
    });
  
    if (seats.length !== seatIds.length) {
      throw new BadRequestException('Some seats do not exist');
    }
  
    const unavailableSeats = seats.filter((seat) => seat.isBooked);
    if (unavailableSeats.length > 0) {
      throw new BadRequestException('Some seats are already booked');
    }
  
    // Create booking
    const booking = this.bookingRepo.create({
      passengerThatBook: passenger,
      trainThatBook: train,
      bookedRoute: route,
      bookedSeats: seats,
      seatCount: seats.length,
      bookingDate: new Date().toISOString(), // storing as string in ISO format
    });
  
    const savedBooking = await this.bookingRepo.save(booking);
  
    // Update seats to mark them as booked
    await this.trainSeatRepo.update(seatIds, {
      isBooked: true,
      bookingSeat: savedBooking,
    });
  
    // Generate ticket
    const ticket = this.ticketRepo.create({
      bookingTicket: savedBooking,
      passengerTicket: passenger,
      trainTicket: train,
      seatCount: seatIds.length,
      bookingDate: new Date(),
      ticketNumber: `TICKET-${Date.now()}`,
    });
  
    await this.ticketRepo.save(ticket);
  
    return {
      message: 'Booking and ticket created successfully',
      data: {
        booking: savedBooking,
        ticket: ticket,
      },
      result: true,
    };
  }
  

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: number): Promise<any> {
    const booking = await this.bookingRepo.findOne({
      where: { bookingId },
      relations: ['bookedSeats'],
    });
  
    if (!booking) throw new NotFoundException('Booking not found');
  
    const seatIds = booking.bookedSeats.map((seat) => seat.seatId);
  
    // Unbook seats
    await this.trainSeatRepo.update(seatIds, {
      isBooked: false,
      bookingSeat: undefined, // null is safer than undefined in DB ops
    });
  
    // Remove booking and related ticket
    await this.bookingRepo.delete(bookingId);
    await this.ticketRepo.delete({ bookingTicket: { bookingId } });
  
    return {
      message: `Booking ${bookingId} cancelled and seats unbooked`,
      data: null,
      result: true,
    };
  }
  

  /**
   * Get all bookings
   */
  async findAll(): Promise<any> {
    const bookings = await this.bookingRepo.find({
      relations: ['passengerThatBook', 'trainThatBook', 'bookedRoute', 'bookedSeats'],
    });
  
    return {
      message: 'Bookings fetched successfully',
      data: bookings,
      result: true,
    };
  }
  

  /**
   * Get booking by ID
   */
  async findOne(id: number): Promise<any> {
    const booking = await this.bookingRepo.findOne({
      where: { bookingId: id },
      relations: ['passengerThatBook', 'trainThatBook', 'bookedRoute', 'bookedSeats'],
    });
  
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
  
    return {
      message: `Booking ${id} fetched successfully`,
      data: booking,
      result: true,
    };
  }
  
}
