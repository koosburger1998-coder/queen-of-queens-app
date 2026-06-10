import { IsString, IsNotEmpty, IsObject, IsBoolean, IsOptional } from 'class-validator';

export class SubmitGuestVoteDto {
  @IsObject()
  votes: Record<string, string>;

  @IsString()
  @IsNotEmpty()
  voterToken: string;

  @IsString()
  @IsOptional()
  voterName?: string;

  @IsBoolean()
  @IsOptional()
  stayAnonymous?: boolean;
}
