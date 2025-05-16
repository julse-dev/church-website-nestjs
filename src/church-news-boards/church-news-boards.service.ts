import { Injectable } from '@nestjs/common';
import { CreateChurchNewsBoardDto } from './dto/create-church-news-board.dto';
import { UpdateChurchNewsBoardDto } from './dto/update-church-news-board.dto';
import { ChurchNewsBoardsRepository } from './church-news-boards.repository';

@Injectable()
export class ChurchNewsBoardsService {
  constructor(private churchNewsBoardsRepository: ChurchNewsBoardsRepository) {}

  async create(
    createChurchNewsBoardDto: CreateChurchNewsBoardDto,
  ): Promise<void> {
    await this.churchNewsBoardsRepository.createPost(createChurchNewsBoardDto);
  }

  async getPostList() {
    return await this.churchNewsBoardsRepository.getPostList();
  }

  async getPostById(id: number) {
    return await this.churchNewsBoardsRepository.getPostById(id);
  }

  update(id: number, updateChurchNewsBoardDto: UpdateChurchNewsBoardDto) {
    return `This action updates a #${id} churchNewsBoard`;
  }

  remove(id: number) {
    return `This action removes a #${id} churchNewsBoard`;
  }
}
