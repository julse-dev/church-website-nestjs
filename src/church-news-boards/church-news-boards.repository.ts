import { DataSource, Repository } from 'typeorm';
import { ChurchNewsBoard } from './entities/church-news-board.entity';
import { CreateChurchNewsBoardDto } from './dto/create-church-news-board.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class ChurchNewsBoardsRepository extends Repository<ChurchNewsBoard> {
  constructor(private datasource: DataSource) {
    super(ChurchNewsBoard, datasource.createEntityManager());
  }

  async createPost(
    createChurchNewsBoardDto: CreateChurchNewsBoardDto,
  ): Promise<void> {
    const { title, content, author, userId, createdAt } =
      createChurchNewsBoardDto;

    const churchNewsPost = this.create({
      title: title,
      content: content,
      author: author,
      userId: userId,
      createdAt: createdAt,
    });

    try {
      await this.save(churchNewsPost);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Post already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getPostById(id: number): Promise<ChurchNewsBoard> {
    try {
      const post = await this.findOne({
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

  async getPostList(): Promise<Partial<ChurchNewsBoard>[]> {
    try {
      return this.find({
        select: ['id', 'title', 'createdAt', 'author'],
        order: { id: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch posts, error: ${error.message}`,
      );
    }
  }
}
