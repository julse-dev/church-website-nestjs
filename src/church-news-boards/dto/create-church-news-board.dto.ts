import { IsString } from 'class-validator';

export class CreateChurchNewsBoardDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;
}
