import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './entities/route.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Train } from 'src/train_booking/train/entities/train.entity';
import { Station } from 'src/train_booking/station/entities/station.entity';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepo: Repository<Route>,
    @InjectRepository(Train)
    private readonly trainRepo: Repository<Train>,
    @InjectRepository(Station)
    private readonly stationRepo: Repository<Station>,
  ) {}

  // ✅ CREATE
  async create(createRouteDto: CreateRouteDto): Promise<any> {
    const {
      departureDate,
      departureTime,
      arrivalTime,
      trainId,
      departureStationId,
      arrivalStationId,
    } = createRouteDto;


    const train = await this.trainRepo.findOne({ where: { trainId } });
    if (!train) throw new NotFoundException('Train not found');

    const departureStation = await this.stationRepo.findOne({
      where: { stationId: departureStationId },
    });
    if (!departureStation)
      throw new NotFoundException('Departure station not found');

    const arrivalStation = await this.stationRepo.findOne({
      where: { stationId: arrivalStationId },
    });
    if (!arrivalStation)
      throw new NotFoundException('Arrival station not found');

    const existingRoute = await this.routeRepo.findOne({
      where: {
        trainTakingRoute: { trainId },
        departureStation: { stationId: departureStationId },
        arrivalStation: { stationId: arrivalStationId },
        departureDate, 
      },
    });

    if (existingRoute) {
      throw new ConflictException(
        'Route already exists for this train on the given date',
      );
    }

    const newRoute = this.routeRepo.create({
      departureDate, 
      departureTime,
      arrivalTime,
      trainTakingRoute: train,
      departureStation,
      arrivalStation,
    });

    const savedRoute = await this.routeRepo.save(newRoute);

    return {
      message: 'Route created successfully',
      data: savedRoute,
      result: true,
    };
  }

  // ✅ FIND ALL
  async findAll(): Promise<any> {
    const routes = await this.routeRepo.find({
      relations: ['trainTakingRoute'], // This loads the train data
    });
  
    return {
      message: 'Routes fetched successfully',
      data: routes,
      result: true,
    };
  }

  // ✅ FIND ONE
  async findOne(id: number): Promise<any> {
    const route = await this.routeRepo.findOne({
      where: { routeId: id },
    });

    if (!route) throw new NotFoundException(`Route with ID ${id} not found`);

    return {
      message: 'Route found',
      data: route,
      result: true,
    };
  }

  // ✅ UPDATE
  async update(id: number, updateRouteDto: UpdateRouteDto): Promise<any> {
    const route = await this.routeRepo.findOne({ where: { routeId: id } });

    if (!route) throw new NotFoundException(`Route with ID ${id} not found`);

    // If train or stations are being updated, fetch them
    const { trainId, departureStationId, arrivalStationId } = updateRouteDto;

    if (trainId) {
      const train = await this.trainRepo.findOne({ where: { trainId } });
      if (!train) throw new NotFoundException('Train not found');
      route.trainTakingRoute = train;
    }

    if (departureStationId) {
      const departureStation = await this.stationRepo.findOne({
        where: { stationId: departureStationId },
      });
      if (!departureStation)
        throw new NotFoundException('Departure station not found');
      route.departureStation = departureStation;
    }

    if (arrivalStationId) {
      const arrivalStation = await this.stationRepo.findOne({
        where: { stationId: arrivalStationId },
      });
      if (!arrivalStation)
        throw new NotFoundException('Arrival station not found');
      route.arrivalStation = arrivalStation;
    }

    Object.assign(route, updateRouteDto);

    const updated = await this.routeRepo.save(route);

    return {
      message: 'Route updated successfully',
      data: updated,
      result: true,
    };
  }

  // ✅ DELETE
  async remove(id: number): Promise<any> {
    const route = await this.routeRepo.findOne({ where: { routeId: id } });

    if (!route) throw new NotFoundException(`Route with ID ${id} not found`);

    await this.routeRepo.delete(id);

    return {
      message: 'Route deleted successfully',
      result: true,
    };
  }
}
