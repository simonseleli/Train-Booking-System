import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsIn,
} from 'class-validator';

export class CreateTrainDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  trainNo: string; // 🔥 Add this field

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsInt()
  capacity: number;

  @IsString()
  @IsIn(['express', 'passenger', 'freight'])
  trainType: 'express' | 'passenger' | 'freight';
}
