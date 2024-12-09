import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { CredentialUserDto } from './dto/credential-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    await this.userRepository.signUp(createUserDto);
  }

  async signIn(credentialUserDto: CredentialUserDto): Promise<void> {
    await this.userRepository.signIn(credentialUserDto);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
