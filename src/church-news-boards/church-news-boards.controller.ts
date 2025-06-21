import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ChurchNewsBoardsService } from './church-news-boards.service';
import { CreateChurchNewsBoardDto } from './dto/create-church-news-board.dto';
import { UpdateChurchNewsBoardDto } from './dto/update-church-news-board.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { CurrentUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('church-news-boards')
export class ChurchNewsBoardsController {
  constructor(
    private readonly churchNewsBoardsService: ChurchNewsBoardsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async create(
    @Body() createChurchNewsBoardDto: CreateChurchNewsBoardDto,
    @CurrentUser() user: User,
  ) {
    const postDto = {
      ...createChurchNewsBoardDto,
      userId: user.id,
      author: user.username,
      createdAt: new Date(),
    };
    return this.churchNewsBoardsService.createPost(postDto);
  }

  @Get('/list')
  async getPostList() {
    return await this.churchNewsBoardsService.getPostList();
  }

  @Get('/list/:id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return await this.churchNewsBoardsService.getPostById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChurchNewsBoardDto: UpdateChurchNewsBoardDto,
    @CurrentUser() user: User,
  ) {
    return this.churchNewsBoardsService.updatePost(
      id,
      updateChurchNewsBoardDto,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.churchNewsBoardsService.removePost(id, user);
  }
}
