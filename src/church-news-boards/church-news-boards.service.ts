import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateChurchNewsBoardDto } from './dto/create-church-news-board.dto';
import { UpdateChurchNewsBoardDto } from './dto/update-church-news-board.dto';
import { Repository } from 'typeorm';
import { ChurchNewsBoard } from './entities/church-news-board.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChurchNewsBoardsService {
  constructor(
    @InjectRepository(ChurchNewsBoard)
    private readonly boardRepository: Repository<ChurchNewsBoard>,
  ) {}

  async createPost(
    createChurchNewsBoardDto: CreateChurchNewsBoardDto & {
      userId: number;
      author: string;
      createdAt: Date;
    },
    // user: any,
  ): Promise<void> {
    const { title, content, author, userId, createdAt } =
      createChurchNewsBoardDto;

    const churchNewsPost = this.boardRepository.create({
      title,
      content,
      author,
      userId,
      createdAt,
    });

    try {
      await this.boardRepository.save(churchNewsPost);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Post already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getPostList(): Promise<Partial<ChurchNewsBoard>[]> {
    try {
      return this.boardRepository.find({
        select: ['id', 'title', 'createdAt', 'author'],
        order: { id: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch posts, error: ${error.message}`,
      );
    }
  }

  async getPostById(id: number): Promise<ChurchNewsBoard> {
    try {
      const post = await this.boardRepository.findOne({
        where: { id: id },
        select: ['id', 'title', 'author', 'content', 'createdAt'],
      });
      if (!post) {
        throw new ConflictException('Post Not Found');
      }
      return post;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch post, error: ${error.message}`,
      );
    }
  }

  update(id: number, updateChurchNewsBoardDto: UpdateChurchNewsBoardDto) {
    return `This action updates a #${id} churchNewsBoard`;
  }

  remove(id: number) {
    return `This action removes a #${id} churchNewsBoard`;
  }
}
