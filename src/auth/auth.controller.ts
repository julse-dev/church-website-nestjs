import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Res,
  Logger,
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
    @Res() res: Response,
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

    return res.json({ accessToken });
  }

  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    const { accessToken } =
      await this.authService.refreshAccessToken(refreshToken);

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.json({ accessToken });
  }

  @Post('/signout')
  async signOut(@Req() req: Request, @Res() res: Response) {
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

    // const logger = new Logger(AuthController.name);
    // logger.log('로그아웃 되었습니다.');

    return res.status(200).json({ message: '로그아웃 되었습니다.' });
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request): UserProfileDto {
    return req.user as UserProfileDto;
  }
}
