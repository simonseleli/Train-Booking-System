import { IsInt, IsDateString, IsEnum, IsOptional, IsArray } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  trainId: number;

  @IsInt()
  passengerId: number;

  @IsInt()
  routeId: number;

  @IsInt()
  seatCount: number;

  @IsDateString()
  bookingDate: Date;

  @IsArray()
  @IsInt({ each: true })
  trainSeatIds: number[]; // IDs of selected seats

  @IsOptional()
  @IsEnum(['draft', 'confirmed', 'cancelled'])
  state?: 'draft' | 'confirmed' | 'cancelled';
}
