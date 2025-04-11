import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Controller('passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  /**
   * Create a new passenger
   * @param createPassengerDto - The DTO containing passenger details to be saved
   * @returns - A response with a success message and the newly created passenger data
   */
  @Post('create')
  async create(@Body() createPassengerDto: CreatePassengerDto) {
    return await this.passengerService.create(createPassengerDto);
  }

  /**
   * Fetch all passengers
   * @returns - A response with a list of passengers or a message if no passengers are found
   */
  @Get('findAll')
  async findAll() {
    return await this.passengerService.findAll();
  }

  /**
   * Fetch a single passenger by their ID
   * @param id - The ID of the passenger to fetch
   * @returns - A response with the passenger data or an error if not found
   */
  @Get('findOne/:id')
  async findOne(@Param('id') id: number) {
    return await this.passengerService.findOne(id);
  }

  /**
   * Update an existing passenger's information
   * @param id - The ID of the passenger to update
   * @param updatePassengerDto - The DTO containing updated passenger details
   * @returns - A response with the updated passenger data
   */
  @Put('update/:id')
  async update(@Param('id') id: number, @Body() updatePassengerDto: UpdatePassengerDto) {
    return await this.passengerService.update(id, updatePassengerDto);
  }

  /**
   * Delete a passenger from the database
   * @param id - The ID of the passenger to delete
   * @returns - A response with a success message after deleting the passenger
   */
  @Delete('remove/:id')
  async remove(@Param('id') id: number) {
    return await this.passengerService.remove(id);
  }
}
