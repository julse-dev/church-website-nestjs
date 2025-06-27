import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateChurchNewsBoardDto } from './dto/create-church-news-board.dto';
import { UpdateChurchNewsBoardDto } from './dto/update-church-news-board.dto';
import { Repository } from 'typeorm';
import { ChurchNewsBoard } from './entities/church-news-board.entity';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/user/entities/user.entity';
import { UserProfileDto } from 'src/user/dto/user-profile.dto';

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
    return this.boardRepository.find({
      select: ['id', 'title', 'createdAt', 'author'],
      order: { id: 'DESC' },
    });
  }

  async getPostById(id: number): Promise<ChurchNewsBoard> {
    const post = await this.boardRepository.findOne({
      where: { id },
      select: ['id', 'title', 'author', 'content', 'createdAt', 'userId'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
  }

  async updatePost(
    id: number,
    updateChurchNewsBoardDto: UpdateChurchNewsBoardDto,
    user: UserProfileDto,
  ): Promise<ChurchNewsBoard> {
    const post = await this.getPostById(id);

    if (post.userId !== user.id) {
      throw new UnauthorizedException(
        'You do not have permission to edit this post.',
      );
    }

    const updatedPost = this.boardRepository.merge(
      post,
      updateChurchNewsBoardDto,
    );
    await this.boardRepository.save(updatedPost);
    return updatedPost;
  }

  async removePost(id: number, user: UserProfileDto): Promise<void> {
    const post = await this.getPostById(id);

    if (post.userId !== user.id) {
      throw new UnauthorizedException(
        'You do not have permission to delete this post.',
      );
    }

    const result = await this.boardRepository.delete(id);

    if (result.affected === 0) {
      // This case should not be reached if getPostById is successful, but as a safeguard:
      throw new NotFoundException(
        `Post with ID "${id}" not found during deletion.`,
      );
    }
  }
}
