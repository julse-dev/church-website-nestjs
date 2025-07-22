import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 409, description: '이미 존재하는 이메일' })
  @ApiBody({ type: CreateUserDto })
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({ status: 200, description: '내 정보 반환' })
  @ApiBody({ schema: { properties: { userId: { type: 'number' } } } })
  @Post('/me')
  async getProfile(@Body('userId') userId: number) {
    return await this.userService.findById(userId);
  }

  @ApiOperation({ summary: '내 정보 수정' })
  @ApiResponse({ status: 200, description: '수정 완료' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        email: { type: 'string', example: 'test@example.com', nullable: true },
        username: { type: 'string', example: '홍길동', nullable: true },
        password: { type: 'string', example: 'Password123!', nullable: true },
        phone: { type: 'string', example: '010-1234-5678', nullable: true },
        hashedRefreshToken: { type: 'string', nullable: true },
      },
    },
  })
  @Post('/me/update')
  async updateProfile(
    @Body('userId') userId: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser(userId, updateUserDto);
    return { message: '수정되었습니다.' };
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiResponse({ status: 200, description: '회원탈퇴 완료' })
  @ApiBody({ schema: { properties: { userId: { type: 'number' } } } })
  @Post('/me/delete')
  async deleteAccount(@Body('userId') userId: number) {
    await this.userService.deleteUser(userId);
    return { message: '회원탈퇴가 완료되었습니다.' };
  }
}
