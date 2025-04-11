import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { StationService } from './station.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Controller('station')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  /**
   * Create a new station
   * @param createStationDto - DTO containing station data
   * @returns - Success message with the created station
   */
  @Post('create')
  async create(@Body() createStationDto: CreateStationDto) {
    return await this.stationService.create(createStationDto);
  }

  /**
   * Get all stations
   * @returns - List of stations or empty array if none found
   */
  @Get('findAll')
  async findAll() {
    return await this.stationService.findAll();
  }

  /**
   * Get a single station by ID
   * @param id - Station ID
   * @returns - Station object or not found error
   */
  @Get('findOne/:id')
  async findOne(@Param('id') id: number) {
    return await this.stationService.findOne(id);
  }

  /**
   * Update a station's information
   * @param id - Station ID
   * @param updateStationDto - DTO containing fields to update
   * @returns - Updated station object
   */
  @Put('update/:id')
  async update(@Param('id') id: number, @Body() updateStationDto: UpdateStationDto) {
    return await this.stationService.update(id, updateStationDto);
  }

  /**
   * Delete a station
   * @param id - Station ID
   * @returns - Success message upon deletion
   */
  @Delete('remove/:id')
  async remove(@Param('id') id: number) {
    return await this.stationService.remove(id);
  }
}
