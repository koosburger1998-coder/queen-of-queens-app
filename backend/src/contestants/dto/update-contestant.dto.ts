import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateContestantDto {
  @IsString()
  @IsOptional()
  stageName?: string;

  @IsString()
  @IsOptional()
  style?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}
