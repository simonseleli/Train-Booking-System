import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassengerModule } from './train_booking/passenger/passenger.module';
import * as crypto from 'crypto';
import { BookingModule } from './train_booking/booking/booking.module';
import { StationModule } from './train_booking/station/station.module';
import { TicketModule } from './train_booking/ticket/ticket.module';
import { TrainModule } from './train_booking/train/train.module';
import { TrainSeatModule } from './train_booking/train-seat/train-seat.module';
import { RouteModule } from './train_booking/route/route.module';
(global as any).crypto = crypto;

@Module({
  imports: [
    // Load .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database setup
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') || '3306'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
        autoLoadEntities: true,
      }),
    }),

    // Feature modules
    PassengerModule,
    TrainModule,    
    BookingModule,  
    StationModule,  
    TicketModule, 
    TrainSeatModule,
    RouteModule   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
