import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChurchNewsBoardsService } from './church-news-boards.service';
import { CreateChurchNewsBoardDto } from './dto/create-church-news-board.dto';
import { UpdateChurchNewsBoardDto } from './dto/update-church-news-board.dto';

@Controller('church-news-boards')
export class ChurchNewsBoardsController {
  constructor(
    private readonly churchNewsBoardsService: ChurchNewsBoardsService,
  ) {}

  @Post('/create')
  create(@Body() createChurchNewsBoardDto: CreateChurchNewsBoardDto) {
    return this.churchNewsBoardsService.create(createChurchNewsBoardDto);
  }

  @Get('/list')
  async getPostList() {
    return await this.churchNewsBoardsService.getPostList();
  }

  @Get('/list/:id')
  async getPostById(@Param('id') id: string) {
    return await this.churchNewsBoardsService.getPostById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChurchNewsBoardDto: UpdateChurchNewsBoardDto,
  ) {
    return this.churchNewsBoardsService.update(+id, updateChurchNewsBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.churchNewsBoardsService.remove(+id);
  }
}
