import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

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

  // 마이페이지 기능 메서드들
  async getMyProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['boards'],
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return new UserResponseDto(user);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('현재 비밀번호가 올바르지 않습니다.');
    }

    // 새 비밀번호 해싱
    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await this.userRepository.update(userId, { password: hashedNewPassword });
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const updateData: Partial<User> = {};
    if (updateProfileDto.username) updateData.username = updateProfileDto.username;
    if (updateProfileDto.phone) updateData.phone = updateProfileDto.phone;

    await this.userRepository.update(userId, updateData);
  }

  async getMyPosts(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['boards'],
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user.boards;
  }

  async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto): Promise<void> {
    const { currentPassword } = deleteAccountDto;

    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 현재 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('비밀번호가 올바르지 않습니다.');
    }

    await this.userRepository.delete(userId);
  }
}
