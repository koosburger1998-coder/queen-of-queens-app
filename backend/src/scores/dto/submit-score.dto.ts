import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class SubmitScoreDto {
  @IsString()
  @IsNotEmpty()
  contestantId: string;

  @IsObject()
  values: Record<string, number>;

  @IsString()
  @IsOptional()
  comment?: string;
}
