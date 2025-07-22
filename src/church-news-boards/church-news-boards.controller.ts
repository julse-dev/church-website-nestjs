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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ChurchNewsBoardsService } from './church-news-boards.service';
import { CreateChurchNewsBoardDto } from './dto/create-church-news-board.dto';
import { UpdateChurchNewsBoardDto } from './dto/update-church-news-board.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { CurrentUser } from 'src/user/user.decorator';
import { UserProfileDto } from 'src/user/dto/user-profile.dto';

@ApiTags('church-news-boards')
@Controller('church-news-boards')
export class ChurchNewsBoardsController {
  constructor(
    private readonly churchNewsBoardsService: ChurchNewsBoardsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @ApiOperation({ summary: '게시글 작성' })
  @ApiResponse({ status: 201, description: '게시글 작성 성공' })
  @ApiResponse({ status: 409, description: '중복 게시글' })
  @ApiBody({ type: CreateChurchNewsBoardDto })
  async create(
    @Body() createChurchNewsBoardDto: CreateChurchNewsBoardDto,
    @CurrentUser() user: UserProfileDto,
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
  @ApiOperation({ summary: '게시글 목록 조회' })
  @ApiResponse({ status: 200, description: '게시글 목록 반환' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: '페이지 번호',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: '페이지 당 개수',
  })
  async getPostList(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.churchNewsBoardsService.getPostList(
      Number(page),
      Number(limit),
    );
  }

  @Get('/list/:id')
  @ApiOperation({ summary: '게시글 상세 조회' })
  @ApiResponse({ status: 200, description: '게시글 반환' })
  @ApiParam({ name: 'id', type: Number, description: '게시글 ID' })
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return await this.churchNewsBoardsService.getPostById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: '게시글 수정' })
  @ApiResponse({ status: 200, description: '게시글 수정 성공' })
  @ApiResponse({ status: 401, description: '권한 없음' })
  @ApiParam({ name: 'id', type: Number, description: '게시글 ID' })
  @ApiBody({ type: UpdateChurchNewsBoardDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChurchNewsBoardDto: UpdateChurchNewsBoardDto,
    @CurrentUser() user: UserProfileDto,
  ) {
    return this.churchNewsBoardsService.updatePost(
      id,
      updateChurchNewsBoardDto,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: '게시글 삭제' })
  @ApiResponse({ status: 200, description: '게시글 삭제 성공' })
  @ApiResponse({ status: 401, description: '권한 없음' })
  @ApiParam({ name: 'id', type: Number, description: '게시글 ID' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserProfileDto,
  ) {
    return this.churchNewsBoardsService.removePost(id, user);
  }
}
