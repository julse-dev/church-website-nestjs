import { Module } from '@nestjs/common';
import { ChurchNewsBoardsService } from './church-news-boards.service';
import { ChurchNewsBoardsController } from './church-news-boards.controller';
import { ChurchNewsBoardsRepository } from './church-news-boards.repository';

@Module({
  controllers: [ChurchNewsBoardsController],
  providers: [ChurchNewsBoardsService, ChurchNewsBoardsRepository],
})
export class ChurchNewsBoardsModule {}
