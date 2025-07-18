import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('/me')
  async getProfile(@Body('userId') userId: number) {
    return await this.userService.findById(userId);
  }

  @Post('/me/update')
  async updateProfile(
    @Body('userId') userId: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser(userId, updateUserDto);
    return { message: '수정되었습니다.' };
  }

  @Post('/me/delete')
  async deleteAccount(@Body('userId') userId: number) {
    await this.userService.deleteUser(userId);
    return { message: '회원탈퇴가 완료되었습니다.' };
  }
}
