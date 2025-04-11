import { IsDateString, IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateRouteDto {
  @IsDateString()
  @IsNotEmpty()
  departureDate: string; // 'YYYY-MM-DD'

  @IsString()
  @IsNotEmpty()
  departureTime: string; // 'HH:MM:SS'

  @IsString()
  @IsNotEmpty()
  arrivalTime: string; // 'HH:MM:SS'

  @IsInt()
  @IsNotEmpty()
  trainId: number;

  @IsInt()
  @IsNotEmpty()
  departureStationId: number;

  @IsInt()
  @IsNotEmpty()
  arrivalStationId: number;
}
