import { IsInt, IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsInt()
  seatCount: number;

  @IsDateString()
  bookingDate: Date;

  @IsString()
  @IsNotEmpty()
  ticketNumber: string;

  @IsInt()
  bookingId: number;

  @IsInt()
  passengerId: number;

  @IsInt()
  trainId: number;
}
