import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TrainSeat } from './entities/train-seat.entity';
import { Train } from '../train/entities/train.entity';
import { Route } from '../route/entities/route.entity';

@Injectable()
export class TrainSeatService {
  constructor(
    @InjectRepository(TrainSeat)
    private trainSeatRepo: Repository<TrainSeat>,

    @InjectRepository(Train)
    private trainRepo: Repository<Train>,

    @InjectRepository(Route)
    private routeRepo: Repository<Route>,
  ) {}

  /**
   * Create multiple seats for a train (used when creating a train or initializing)
   */
  async createSeatsForTrain(trainId: number, routeId: number): Promise<any> {
    const train = await this.trainRepo.findOne({ where: { trainId } });
    const route = await this.routeRepo.findOne({ where: { routeId } });
  
    if (!train || !route) {
      throw new NotFoundException('Train or Route not found');
    }
  
    const seats: TrainSeat[] = [];
  
    for (let i = 1; i <= train.capacity; i++) {
      const seat = this.trainSeatRepo.create({
        seatNumber: i,
        isBooked: false,
        bookedTrain: train,
        routesByTrain: route,
      });
      seats.push(seat);
    }
  
    const savedSeats = await this.trainSeatRepo.save(seats);
  
    return {
      message: `${savedSeats.length} seats created successfully for Train ${trainId}`,
      data: savedSeats,
      result: true,
    };
  }
  

  /**
   * Optional: Create a single seat manually (admin or dev use)
   */
  async createSingleSeat(
    trainId: number,
    routeId: number,
    seatNumber: number,
  ): Promise<any> {
    const train = await this.trainRepo.findOne({ where: { trainId } });
    const route = await this.routeRepo.findOne({ where: { routeId } });
  
    if (!train || !route) throw new NotFoundException('Train or Route not found');
  
    const seat = this.trainSeatRepo.create({
      seatNumber,
      isBooked: false,
      bookedTrain: train,
      routesByTrain: route,
    });
  
    const savedSeat = await this.trainSeatRepo.save(seat);
  
    return {
      message: `Seat ${seatNumber} created successfully for Train ${trainId} and Route ${routeId}`,
      data: savedSeat,
      result: true,
    };
  }
  

  /**
   * Get all seats for a train on a specific route
   */
  async getSeatsByTrainAndRoute(
    trainId: number,
    routeId: number,
  ): Promise<any> {
    const seats = await this.trainSeatRepo.find({
      where: {
        bookedTrain: { trainId },
        routesByTrain: { routeId },
      },
      relations: ['bookedTrain', 'routesByTrain'],
    });
  
    if (!seats || seats.length === 0) {
      return {
        message: 'No seats found for the specified train and route',
        data: [],
        result: false,
      };
    }
  
    return {
      message: `Seats fetched successfully for Train ${trainId} and Route ${routeId}`,
      data: seats,
      result: true,
    };
  }
  

  /**
   * Book specific seats (only if not already booked)
   */
  async markSeatsAsBooked(seatIds: number[]): Promise<any> {
    const seats = await this.trainSeatRepo.find({
      where: { seatId: In(seatIds) },
    });
  
    const alreadyBooked = seats.filter(seat => seat.isBooked);
    if (alreadyBooked.length > 0) {
      return {
        message: `Some seats are already booked: ${alreadyBooked.map(s => s.seatNumber).join(', ')}`,
        data: alreadyBooked,
        result: false,
      };
    }
  
    await this.trainSeatRepo.update(seatIds, { isBooked: true });
  
    const updatedSeats = await this.trainSeatRepo.findBy({
      seatId: In(seatIds),
    });
  
    return {
      message: `Seats successfully booked: ${updatedSeats.map(s => s.seatNumber).join(', ')}`,
      data: updatedSeats,
      result: true,
    };
  }
  

  /**
   * Unbook seats (used on cancellation)
   */
  async unbookSeats(seatIds: number[]): Promise<any> {
    const seats = await this.trainSeatRepo.find({
      where: { seatId: In(seatIds) },
    });
  
    const alreadyUnbooked = seats.filter(seat => !seat.isBooked);
    if (alreadyUnbooked.length > 0) {
      return {
        message: `Some seats are already unbooked: ${alreadyUnbooked.map(s => s.seatNumber).join(', ')}`,
        data: alreadyUnbooked,
        result: false,
      };
    }
  
    await this.trainSeatRepo.update(seatIds, { isBooked: false });
  
    const updatedSeats = await this.trainSeatRepo.findBy({
      seatId: In(seatIds),
    });
  
    return {
      message: `Seats successfully unbooked: ${updatedSeats.map(s => s.seatNumber).join(', ')}`,
      data: updatedSeats,
      result: true,
    };
  }
  

  /**
   * Find a single seat
   */
  async findOne(seatId: number): Promise<any> {
    const seat = await this.trainSeatRepo.findOne({
      where: { seatId },
      relations: ['bookedTrain', 'routesByTrain', 'bookingSeat'],
    });
  
    if (!seat) {
      return {
        message: `Seat with ID ${seatId} not found`,
        data: null,
        result: false,
      };
    }
  
    return {
      message: `Seat found successfully`,
      data: seat,
      result: true,
    };
  }
  

  /**
   * Delete a seat (mostly for dev/test)
   */
  async remove(seatId: number): Promise<any> {
    const result = await this.trainSeatRepo.delete(seatId);
  
    if (result.affected === 0) {
      return {
        message: `Seat with ID ${seatId} not found`,
        data: null,
        result: false,
      };
    }
  
    return {
      message: `Seat ${seatId} removed successfully`,
      data: null,
      result: true,
    };
  }
  
}
