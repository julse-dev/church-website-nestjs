import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Res,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CredentialAuthDto } from './dto/credential-auth.dto';

const ACCESS_TOKEN_COOKIE_NAME: string = 'access_token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) credentialAuthDto: CredentialAuthDto,
    @Res() res: Response,
  ) {
    const { accessToken } =
      await this.authService.validateUser(credentialAuthDto);
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.json({ accessToken });
  }

  @Post('/signout')
  async signOut(@Res() res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    const logger = new Logger(AuthController.name);
    logger.log('로그아웃 되었습니다.');

    return res.status(200).json({ message: '로그아웃 되었습니다.' });
  }
}
