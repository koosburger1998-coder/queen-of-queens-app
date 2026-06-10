import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  venue?: string;

  @IsBoolean()
  @IsOptional()
  scoringLocked?: boolean;

  @IsBoolean()
  @IsOptional()
  guestVotingLocked?: boolean;
}
