import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateStationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean; // Optional, defaults to true
}
