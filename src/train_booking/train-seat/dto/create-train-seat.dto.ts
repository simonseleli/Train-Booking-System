import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateTrainSeatDto {
  @IsInt()
  @IsNotEmpty()
  seatNumber: number;

  @IsInt()
  @IsNotEmpty()
  trainId: number;

  @IsInt()
  @IsNotEmpty()
  routeId: number;
}
