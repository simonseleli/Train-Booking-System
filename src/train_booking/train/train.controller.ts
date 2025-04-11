import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TrainService } from './train.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';

@Controller('train')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  /**
   * Create a new train
   * @param createTrainDto - The DTO containing train details
   * @returns - A success message and the created train data
   */
  @Post('create')
  async create(@Body() createTrainDto: CreateTrainDto) {
    return await this.trainService.create(createTrainDto);
  }

  /**
   * Fetch all trains
   * @returns - A list of all train records
   */
  @Get('findAll')
  async findAll() {
    return await this.trainService.findAll();
  }

  /**
   * Get a single train by its ID
   * @param id - The ID of the train
   * @returns - A single train record or error if not found
   */
  @Get('findOne/:id')
  async findOne(@Param('id') id: number) {
    return await this.trainService.findOne(id);
  }

  /**
   * Update a train’s details
   * @param id - The ID of the train
   * @param updateTrainDto - The updated data for the train
   * @returns - A success message and the updated train
   */
  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateTrainDto: UpdateTrainDto,
  ) {
    return await this.trainService.update(id, updateTrainDto);
  }

  /**
   * Delete a train from the database
   * @param id - The ID of the train
   * @returns - A success message after deletion
   */
  @Delete('remove/:id')
  async remove(@Param('id') id: number) {
    return await this.trainService.remove(id);
  }
}
