import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Put,
  Delete,
  UseGuards,
  Patch
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { CurrentUser } from './user.decorator';
import { Throttle } from '@nestjs/throttler';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // ✅ 공개 엔드포인트: 회원가입
  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 409, description: '이미 존재하는 이메일' })
  @ApiBody({ type: CreateUserDto })
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // ✅ 인증된 사용자 전용 엔드포인트들 (기존 /mypage → /me로 통합)

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({ status: 200, description: '사용자 정보 반환 (비밀번호 제외)' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async getMyProfile(@CurrentUser() user: any) {
    return await this.userService.getMyProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/me/password')
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 5분에 3번만 비밀번호 변경 시도 허용
  @ApiOperation({ summary: '비밀번호 변경' })
  @ApiResponse({ status: 200, description: '비밀번호 변경 완료' })
  @ApiResponse({ status: 400, description: '현재 비밀번호가 올바르지 않음' })
  @ApiResponse({ status: 401, description: '인증 필요' })
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
  @Patch('/me/profile')
  @ApiOperation({ summary: '프로필 수정 (이름, 전화번호)' })
  @ApiResponse({ status: 200, description: '프로필 수정 완료' })
  @ApiResponse({ status: 401, description: '인증 필요' })
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
  @Get('/me/posts')
  @ApiOperation({ summary: '내가 작성한 게시글 조회' })
  @ApiResponse({ status: 200, description: '사용자가 작성한 게시글 목록 반환' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  async getMyPosts(@CurrentUser() user: any) {
    return await this.userService.getMyPosts(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  @Throttle({ default: { limit: 10, ttl: 3600000 } }) // 1시간에 2번만 회원 탈퇴 시도 허용
  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiResponse({ status: 200, description: '회원 탈퇴 완료' })
  @ApiResponse({ status: 400, description: '비밀번호가 올바르지 않음' })
  @ApiResponse({ status: 401, description: '인증 필요' })
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
