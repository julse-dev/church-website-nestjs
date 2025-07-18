import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { email, username, password, phone } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email: email,
      username: username,
      password: hashedPassword,
      phone: phone,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateUser(
    id: number,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<void> {
    const { username, password, phone } = updateUserDto;
    const updateData: Partial<User> = {};
    if (username) updateData.username = username;
    if (phone) updateData.phone = phone;
    if (password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(password, salt);
    }
    await this.userRepository.update(id, updateData);
  }

  async updateRefreshToken(
    id: number,
    hashedRefreshToken: string,
  ): Promise<void> {
    await this.userRepository.update(id, { hashedRefreshToken });
  }

  async findOneBy(condition: Partial<User>): Promise<User | undefined> {
    return await this.userRepository.findOneBy(condition);
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
