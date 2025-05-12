import { PartialType } from '@nestjs/mapped-types';
import { CreateChurchNewsBoardDto } from './create-church-news-board.dto';

export class UpdateChurchNewsBoardDto extends PartialType(
  CreateChurchNewsBoardDto,
) {}
