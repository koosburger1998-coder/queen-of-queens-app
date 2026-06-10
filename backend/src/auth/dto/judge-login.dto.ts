import { IsString, IsNotEmpty } from 'class-validator';

export class JudgeLoginDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
