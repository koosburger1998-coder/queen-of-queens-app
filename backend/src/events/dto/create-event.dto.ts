import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  date: string;

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
