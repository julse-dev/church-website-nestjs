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
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CredentialAuthDto } from './dto/credential-auth.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserProfileDto } from 'src/user/dto/user-profile.dto';

const ACCESS_TOKEN_COOKIE_NAME: string = 'access_token';
const REFRESH_TOKEN_COOKIE_NAME: string = 'refresh_token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) credentialAuthDto: CredentialAuthDto,
    @Res({ passthrough: true }) res: Response, // 버그 수정: passthrough 옵션 추가
  ) {
    const { accessToken, refreshToken } =
      await this.authService.validateUser(credentialAuthDto);

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken }; // 버그 수정: res.json 대신 객체 반환
  }

  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 버그 수정: passthrough 옵션 추가
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    const { accessToken } =
      await this.authService.refreshAccessToken(refreshToken);

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return { accessToken }; // 버그 수정: res.json 대신 객체 반환
  }

  @Post('/signout')
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 버그 수정: passthrough 옵션 추가
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    await this.authService.removeRefreshToken(refreshToken);

    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: '로그아웃 되었습니다.' }; // 버그 수정: res.status().json 대신 객체 반환
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request): UserProfileDto {
    return req.user as UserProfileDto;
  }
}
