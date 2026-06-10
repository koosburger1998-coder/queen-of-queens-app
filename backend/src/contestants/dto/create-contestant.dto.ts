import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateContestantDto {
  @IsString()
  @IsNotEmpty()
  stageName: string;

  @IsString()
  @IsOptional()
  style?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
