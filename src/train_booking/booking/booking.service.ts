import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passenger } from '../passenger/entities/passenger.entity';
import { Route } from '../route/entities/route.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { TrainSeat } from '../train-seat/entities/train-seat.entity';
import { Train } from '../train/entities/train.entity';
import { Booking } from './entities/booking.entity';
import { In } from 'typeorm';
import { EntityManager } from 'typeorm';

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

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
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
    return this.entityManager.transaction(async (transactionalEntityManager) => {
      // 1. Fetch required entities
      const [passenger, train, route] = await Promise.all([
        transactionalEntityManager.findOne(Passenger, { where: { passengerId } }),
        transactionalEntityManager.findOne(Train, { where: { trainId } }),
        transactionalEntityManager.findOne(Route, { where: { routeId } }),
      ]);
  
      if (!passenger || !train || !route) {
        throw new NotFoundException('Passenger, Train or Route not found');
      }
  
      // 2. Validate seats
      const seats = await transactionalEntityManager.find(TrainSeat, {
        where: { seatId: In(seatIds) },
      });
  
      if (seats.length !== seatIds.length) {
        throw new BadRequestException('Some seats do not exist');
      }
  
      const unavailableSeats = seats.filter((seat) => seat.isBooked);
      if (unavailableSeats.length > 0) {
        throw new BadRequestException('Some seats are already booked');
      }
  
      // 3. Create and save booking with string dates
      const currentDateISO = new Date().toISOString();
      
      const booking = transactionalEntityManager.create(Booking, {
        passengerThatBook: passenger,
        trainThatBook: train,
        bookedRoute: route,
        bookedSeats: seats,
        seatCount: seats.length,
        bookingDate: currentDateISO,
        state: 'confirmed',
      });
  
      const savedBooking = await transactionalEntityManager.save(booking);
  
      // 4. Update seats to mark them as booked
      await transactionalEntityManager.update(
        TrainSeat,
        seatIds,
        { isBooked: true, bookingSeat: savedBooking },
      );
  
      // 5. Update train seat counts
      const bookedSeatsCount = await transactionalEntityManager
      .createQueryBuilder(TrainSeat, 'seat')
      .where('seat.bookedTrain.trainId = :trainId', { trainId })
      .andWhere('seat.isBooked = true')
      .getCount();
  
      await transactionalEntityManager.update(
        Train,
        trainId,
        {
          bookedSeats: bookedSeatsCount,
          availableSeats: train.capacity - bookedSeatsCount,
        },
      );
  
      // 6. Generate ticket with string dates
      const ticket = transactionalEntityManager.create(Ticket, {
        bookingTicket: savedBooking,
        passengerTicket: passenger,
        trainTicket: train,
        seatCount: seatIds.length,
        bookingDate: currentDateISO,
        ticketNumber: `TICKET-${Date.now()}`,
      });
  
      await transactionalEntityManager.save(ticket);
  
      return {
        message: 'Booking and ticket created successfully',
        data: {
          booking: savedBooking,
          ticket: ticket,
          updatedTrain: {
            trainId,
            bookedSeats: bookedSeatsCount,
            availableSeats: train.capacity - bookedSeatsCount,
          },
        },
        result: true,
      };
    });
  }    

//          THIS ALSO WORKS, BUT TRANSACTIONAL IS THE BEST FOR MANY PROCESSES AT A SAME TIME 


  // async createBooking(
  //   passengerId: number,
  //   trainId: number,
  //   routeId: number,
  //   seatIds: number[],
  // ): Promise<any> {
  //   // Step 1: Fetch and validate main entities
  //   const passenger = await this.passengerRepo.findOne({ where: { passengerId } });
  //   const train = await this.trainRepo.findOne({ where: { trainId } });
  //   const route = await this.routeRepo.findOne({ where: { routeId } });
  
  //   if (!passenger || !train || !route) {
  //     throw new NotFoundException('Passenger, Train, or Route not found');
  //   }
  
  //   // Step 2: Fetch and validate seats
  //   const seats = await this.trainSeatRepo.find({
  //     where: { seatId: In(seatIds) },
  //   });
  
  //   if (seats.length !== seatIds.length) {
  //     throw new BadRequestException('Some seats do not exist');
  //   }
  
  //   const unavailableSeats = seats.filter(seat => seat.isBooked);
  //   if (unavailableSeats.length > 0) {
  //     throw new BadRequestException('Some seats are already booked');
  //   }
  
  //   // Step 3: Create booking
  //   const booking = this.bookingRepo.create({
  //     passengerThatBook: passenger,
  //     trainThatBook: train,
  //     bookedRoute: route,
  //     bookedSeats: seats,
  //     seatCount: seats.length,
  //     bookingDate: new Date().toISOString(),
  //     state: 'confirmed',
  //   });
  
  //   const savedBooking = await this.bookingRepo.save(booking);
  
  //   // Step 4: Update seat status
  //   for (const seat of seats) {
  //     seat.isBooked = true;
  //     seat.bookingSeat = savedBooking;
  //     await this.trainSeatRepo.save(seat); // <-- not atomic
  //   }
  
  //   // Step 5: Update train seat count
  //   const bookedSeatsCount = await this.trainSeatRepo.count({
  //     where: {
  //       bookedTrain: { trainId },
  //       isBooked: true,
  //     },
  //   });
  
  //   train.bookedSeats = bookedSeatsCount;
  //   train.availableSeats = train.capacity - bookedSeatsCount;
  //   await this.trainRepo.save(train);
  
  //   // Step 6: Create and save ticket
  //   const ticket = this.ticketRepo.create({
  //     bookingTicket: savedBooking,
  //     passengerTicket: passenger,
  //     trainTicket: train,
  //     seatCount: seatIds.length,
  //     bookingDate: new Date().toISOString(),
  //     ticketNumber: `TICKET-${Date.now()}`,
  //   });
  
  //   const savedTicket = await this.ticketRepo.save(ticket);
  
  //   return {
  //     message: 'Booking and ticket created successfully',
  //     data: {
  //       booking: savedBooking,
  //       ticket: savedTicket,
  //       updatedTrain: {
  //         trainId,
  //         bookedSeats: train.bookedSeats,
  //         availableSeats: train.availableSeats,
  //       },
  //     },
  //     result: true,
  //   };
  // }

  
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
