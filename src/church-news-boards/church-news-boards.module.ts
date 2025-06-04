import { Module } from '@nestjs/common';
import { ChurchNewsBoardsService } from './church-news-boards.service';
import { ChurchNewsBoardsController } from './church-news-boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChurchNewsBoard } from './entities/church-news-board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChurchNewsBoard])],
  controllers: [ChurchNewsBoardsController],
  providers: [ChurchNewsBoardsService],
})
export class ChurchNewsBoardsModule {}
