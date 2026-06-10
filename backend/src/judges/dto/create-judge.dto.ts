import { IsString, IsNotEmpty } from 'class-validator';

export class CreateJudgeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
