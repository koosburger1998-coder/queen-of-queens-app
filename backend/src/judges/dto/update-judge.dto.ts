import { IsString, IsOptional } from 'class-validator';

export class UpdateJudgeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;
}
