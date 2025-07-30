import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Put,
  Delete,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { CurrentUser } from './user.decorator';
import { Throttle } from '@nestjs/throttler'; @ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

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

  // 마이페이지 기능 엔드포인트들
  @UseGuards(JwtAuthGuard)
  @Get('/mypage')
  @ApiOperation({ summary: '마이페이지 - 내 정보 조회' })
  @ApiResponse({ status: 200, description: '사용자 정보 반환 (비밀번호 제외)' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async getMyPage(@CurrentUser() user: any) {
    return await this.userService.getMyProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/mypage/password')
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 5분에 3번만 비밀번호 변경 시도 허용
  @ApiOperation({ summary: '마이페이지 - 비밀번호 변경' })
  @ApiResponse({ status: 200, description: '비밀번호 변경 완료' })
  @ApiResponse({ status: 400, description: '현재 비밀번호가 올바르지 않음' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @ApiResponse({ status: 429, description: '너무 많은 비밀번호 변경 시도' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @CurrentUser() user: any,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ) {
    await this.userService.changePassword(user.id, changePasswordDto);
    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/mypage/profile')
  @ApiOperation({ summary: '마이페이지 - 프로필 수정 (이름, 전화번호)' })
  @ApiResponse({ status: 200, description: '프로필 수정 완료' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @ApiBody({ type: UpdateProfileDto })
  async updateMyProfile(
    @CurrentUser() user: any,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
  ) {
    await this.userService.updateProfile(user.id, updateProfileDto);
    return { message: '프로필이 성공적으로 수정되었습니다.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/mypage/posts')
  @ApiOperation({ summary: '마이페이지 - 내가 작성한 게시글 조회' })
  @ApiResponse({ status: 200, description: '사용자가 작성한 게시글 목록 반환' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async getMyPosts(@CurrentUser() user: any) {
    return await this.userService.getMyPosts(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/mypage/account')
  @Throttle({ default: { limit: 2, ttl: 3600000 } }) // 1시간에 2번만 회원 탈퇴 시도 허용
  @ApiOperation({ summary: '마이페이지 - 회원 탈퇴' })
  @ApiResponse({ status: 200, description: '회원 탈퇴 완료' })
  @ApiResponse({ status: 400, description: '비밀번호가 올바르지 않음' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @ApiResponse({ status: 429, description: '너무 많은 회원 탈퇴 시도' })
  @ApiBody({ type: DeleteAccountDto })
  async deleteMyAccount(
    @CurrentUser() user: any,
    @Body(ValidationPipe) deleteAccountDto: DeleteAccountDto,
  ) {
    await this.userService.deleteAccount(user.id, deleteAccountDto);
    return { message: '회원 탈퇴가 완료되었습니다.' };
  }
}
