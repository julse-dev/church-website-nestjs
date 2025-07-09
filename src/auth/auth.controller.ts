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
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CredentialAuthDto } from './dto/credential-auth.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserProfileDto } from 'src/user/dto/user-profile.dto';

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
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request): UserProfileDto {
    return req.user as UserProfileDto;
  }
}
