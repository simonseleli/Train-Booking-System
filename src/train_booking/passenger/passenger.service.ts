import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Passenger } from './entities/passenger.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PassengerService {

  constructor(
    @InjectRepository(Passenger)
    private readonly passengerRepo: Repository<Passenger>
  ) {}

  /**
   * Create a new passenger
   * @param createPassengerDto - The DTO containing passenger details to be saved
   * @returns - A promise that resolves with a success message and the newly created passenger data
   */
  async create(createPassengerDto: CreatePassengerDto): Promise<{ message: string; data: Passenger; result: boolean }> {
    const { email, phone } = createPassengerDto;

    // Check if the email or phone number already exists in the database
    const existingPassenger = await this.passengerRepo.findOne({ where: [{ email }, { phone }] });

    if (existingPassenger) {
      // If either email or phone exists, throw a conflict exception
      throw new ConflictException('Email or phone number already exists');
    }

    // Save the new passenger data to the database
    const newPassenger = await this.passengerRepo.save(createPassengerDto);

    // Return a success response with the newly created passenger data
    return {
      message: 'Passenger created successfully',
      data: newPassenger,
      result: true,
    };
  }

  /**
   * Fetch all passengers from the database
   * @returns - A promise that resolves with a list of passengers or a message if no passengers are found
   */
  async findAll(): Promise<{ message: string; data: Passenger[]; result: boolean }> {
    const passengers = await this.passengerRepo.find();

    // If no passengers are found, return a message saying so
    if (passengers.length === 0) {
      return {
        message: 'No passengers found',
        data: [],
        result: false,
      };
    }

    // Return a success response with all the passengers data
    return {
      message: 'Passengers fetched successfully',
      data: passengers,
      result: true,
    };
  }

  /**
   * Fetch a single passenger by their ID
   * @param id - The ID of the passenger to fetch
   * @returns - A promise that resolves with the passenger data or throws an exception if not found
   */
  async findOne(id: number): Promise<{ message: string; data: Passenger; result: boolean }> {
    const passenger = await this.passengerRepo.findOne({ where: { passengerId: id } });

    // If the passenger does not exist, throw a not found exception
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} does not exist`);
    }

    // Return a success response with the found passenger data
    return {
      message: 'Passenger fetched successfully',
      data: passenger,
      result: true,
    };
  }

  /**
   * Update an existing passenger's information
   * @param id - The ID of the passenger to update
   * @param updatePassengerDto - The DTO containing the new passenger details
   * @returns - A promise that resolves with the updated passenger data or throws an exception if not found
   */
  async update(id: number, updatePassengerDto: UpdatePassengerDto): Promise<{ message: string; data: Passenger; result: boolean }> {
    const passenger = await this.passengerRepo.findOne({ where: { passengerId: id } });

    // If the passenger does not exist, throw a not found exception
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} does not exist`);
    }

    // Merge the existing passenger with the updated data and save it
    const updatedPassenger = await this.passengerRepo.save({ ...passenger, ...updatePassengerDto });

    // Return a success response with the updated passenger data
    return {
      message: 'Passenger updated successfully',
      data: updatedPassenger,
      result: true,
    };
  }

  /**
   * Delete a passenger from the database
   * @param id - The ID of the passenger to delete
   * @returns - A promise that resolves with a success message or throws an exception if not found
   */
  async remove(id: number): Promise<{ message: string; data: null; result: boolean }> {
    const passenger = await this.passengerRepo.findOne({ where: { passengerId: id } });

    // If the passenger does not exist, throw a not found exception
    if (!passenger) {
      throw new NotFoundException(`Passenger with ID ${id} does not exist`);
    }

    // Remove the passenger from the database
    await this.passengerRepo.remove(passenger);

    // Return a success response after deleting the passenger
    return {
      message: 'Passenger deleted successfully',
      data: null,
      result: true,
    };
  }
}
