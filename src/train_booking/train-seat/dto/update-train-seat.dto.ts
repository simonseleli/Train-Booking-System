import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainSeatDto } from './create-train-seat.dto';

export class UpdateTrainSeatDto extends PartialType(CreateTrainSeatDto) {}
