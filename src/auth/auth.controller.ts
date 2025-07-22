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
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CredentialAuthDto } from './dto/credential-auth.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserProfileDto } from 'src/user/dto/user-profile.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly ACCESS_TOKEN_COOKIE_NAME: string;
  private readonly REFRESH_TOKEN_COOKIE_NAME: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.ACCESS_TOKEN_COOKIE_NAME = this.configService.get<string>(
      'ACCESS_TOKEN_COOKIE_NAME',
      'access_token',
    );
    this.REFRESH_TOKEN_COOKIE_NAME = this.configService.get<string>(
      'REFRESH_TOKEN_COOKIE_NAME',
      'refresh_token',
    );
  }

  @Post('/signin')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 201, description: '로그인 성공' })
  @ApiResponse({ status: 401, description: '로그인 실패' })
  @ApiBody({ type: CredentialAuthDto })
  async signIn(
    @Body(ValidationPipe) credentialAuthDto: CredentialAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.validateUser(credentialAuthDto);

    res.cookie(this.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken };
  }

  @Post('/refresh')
  @ApiOperation({ summary: '액세스 토큰 재발급' })
  @ApiResponse({ status: 201, description: '토큰 재발급 성공' })
  @ApiResponse({ status: 401, description: '리프레시 토큰 오류' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE_NAME];
    const { accessToken } =
      await this.authService.refreshAccessToken(refreshToken);

    res.cookie(this.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return { accessToken };
  }

  @Post('/signout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE_NAME];
    await this.authService.removeRefreshToken(refreshToken);

    res.clearCookie(this.ACCESS_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.clearCookie(this.REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: '로그아웃 되었습니다.' };
  }

  @Get('/me')
  @ApiOperation({ summary: '내 정보 조회(토큰 기반)' })
  @ApiResponse({ status: 200, description: '내 정보 반환' })
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request): UserProfileDto {
    return req.user as UserProfileDto;
  }
}
