import { Module } from '@nestjs/common';
import { StationService } from './station.service';
import { StationController } from './station.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from '../route/entities/route.entity';
import { Station } from './entities/station.entity';

@Module({
  controllers: [StationController],
  providers: [StationService],
    imports: [TypeOrmModule.forFeature([Route, Station])], 
})
export class StationModule {}
