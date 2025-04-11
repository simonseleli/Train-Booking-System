import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Train } from './entities/train.entity';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train)
    private readonly trainRepo: Repository<Train>,
  ) {}

  /**
   * Create a new train
   */
  async create(createTrainDto: CreateTrainDto): Promise<any> {
    const { name, trainNo } = createTrainDto;

    const existingTrain = await this.trainRepo.findOne({
      where: [{ name }, { trainNo }],
    });

    if (existingTrain) {
      throw new ConflictException('Train with same name or number exists');
    }

    const newTrain = await this.trainRepo.save(createTrainDto);

    return {
      message: 'Train created successfully',
      data: newTrain,
      result: true,
    };
  }

  /**
   * Get all trains
   */
  async findAll(): Promise<any> {
    const trains = await this.trainRepo.find();

    if (!trains.length) {
      return {
        message: 'No trains found',
        data: [],
        result: false,
      };
    }

    return {
      message: 'Trains fetched successfully',
      data: trains,
      result: true,
    };
  }

  /**
   * Get a single train by ID
   */
  async findOne(id: number): Promise<any> {
    const train = await this.trainRepo.findOne({ where: { trainId: id } });

    if (!train) {
      throw new NotFoundException(`Train with ID ${id} not found`);
    }

    return {
      message: 'Train fetched successfully',
      data: train,
      result: true,
    };
  }

  /**
   * Update a train
   */
  async update(id: number, updateTrainDto: UpdateTrainDto): Promise<any> {
    const train = await this.trainRepo.findOne({ where: { trainId: id } });

    if (!train) {
      throw new NotFoundException(`Train with ID ${id} not found`);
    }

    const updated = await this.trainRepo.save({
      ...train,
      ...updateTrainDto,
    });

    return {
      message: 'Train updated successfully',
      data: updated,
      result: true,
    };
  }

  /**
   * Delete a train
   */
  async remove(id: number): Promise<any> {
    const train = await this.trainRepo.findOne({ where: { trainId: id } });

    if (!train) {
      throw new NotFoundException(`Train with ID ${id} not found`);
    }

    await this.trainRepo.remove(train);

    return {
      message: 'Train deleted successfully',
      data: null,
      result: true,
    };
  }
}
