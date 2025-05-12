import { IsDateString, IsInt, IsString } from 'class-validator';

export class CreateChurchNewsBoardDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsString()
  readonly author: string;

  @IsInt()
  readonly userId: number;

  @IsDateString()
  readonly createdAt: Date;
}
