import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { CredentialAuthDto } from './dto/credential-auth.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserProfileDto } from 'src/user/dto/user-profile.dto';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from 'src/user/user.decorator';
import { AuthenticatedRequest, CookieResponse } from './types/auth-types';
import { CookieService } from './services/cookie.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService,
  ) { }

  @Post('/signin')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 1분에 5번만 로그인 시도 허용
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 201, description: '로그인 성공' })
  @ApiResponse({ status: 401, description: '로그인 실패' })
  @ApiResponse({ status: 429, description: '너무 많은 로그인 시도' })
  @ApiBody({ type: CredentialAuthDto })
  async signIn(
    @Body(ValidationPipe) credentialAuthDto: CredentialAuthDto,
    @Res({ passthrough: true }) res: CookieResponse,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.validateUser(credentialAuthDto);

    this.cookieService.setAccessTokenCookie(res, accessToken);
    this.cookieService.setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  @Post('/refresh')
  @ApiOperation({ summary: '액세스 토큰 재발급' })
  @ApiResponse({ status: 201, description: '토큰 재발급 성공' })
  @ApiResponse({ status: 401, description: '리프레시 토큰 오류' })
  async refresh(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: CookieResponse,
  ) {
    const refreshToken = this.cookieService.getRefreshTokenFromRequest(req);
    const { accessToken } =
      await this.authService.refreshAccessToken(refreshToken);

    this.cookieService.setAccessTokenCookie(res, accessToken);

    return { accessToken };
  }

  @Post('/signout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  async signOut(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: CookieResponse,
  ) {
    const refreshToken = this.cookieService.getRefreshTokenFromRequest(req);
    await this.authService.removeRefreshToken(refreshToken);

    this.cookieService.clearAuthCookies(res);

    return { message: '로그아웃 되었습니다.' };
  }

  @Get('/me')
  @ApiOperation({ summary: '내 정보 조회(토큰 기반)' })
  @ApiResponse({ status: 200, description: '내 정보 반환' })
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: UserProfileDto): UserProfileDto {
    return user;
  }
}
