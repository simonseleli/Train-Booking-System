import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepo: Repository<Station>,
  ) {}

  /**
   * Create a new station
   */
  async create(createStationDto: CreateStationDto): Promise<{ message: string; data: Station; result: boolean }> {
    const { name } = createStationDto;

    const existing = await this.stationRepo.findOne({ where: { name } });
    if (existing) {
      throw new ConflictException(`Station with name "${name}" already exists`);
    }

    const newStation = await this.stationRepo.save(createStationDto);

    return {
      message: 'Station created successfully',
      data: newStation,
      result: true,
    };
  }

  /**
   * Get all stations
   */
  async findAll(): Promise<{ message: string; data: Station[]; result: boolean }> {
    const stations = await this.stationRepo.find();

    if (!stations.length) {
      return {
        message: 'No stations found',
        data: [],
        result: false,
      };
    }

    return {
      message: 'Stations fetched successfully',
      data: stations,
      result: true,
    };
  }

  /**
   * Get a station by ID
   */
  async findOne(id: number): Promise<{ message: string; data: Station; result: boolean }> {
    const station = await this.stationRepo.findOne({ where: { stationId: id } });

    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }

    return {
      message: 'Station fetched successfully',
      data: station,
      result: true,
    };
  }

  /**
   * Update station details
   */
  async update(id: number, updateStationDto: UpdateStationDto): Promise<{ message: string; data: Station; result: boolean }> {
    const station = await this.stationRepo.findOne({ where: { stationId: id } });

    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }

    const updated = await this.stationRepo.save({ ...station, ...updateStationDto });

    return {
      message: 'Station updated successfully',
      data: updated,
      result: true,
    };
  }

  /**
   * Delete a station
   */
  async remove(id: number): Promise<{ message: string; data: null; result: boolean }> {
    const station = await this.stationRepo.findOne({ where: { stationId: id } });

    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }

    await this.stationRepo.remove(station);

    return {
      message: 'Station deleted successfully',
      data: null,
      result: true,
    };
  }
}
