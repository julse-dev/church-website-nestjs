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
// import { User } from 'src/user/entities/user.entity';
import { UserProfileDto } from 'src/user/dto/user-profile.dto';

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

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request): UserProfileDto {
    // JwtAuthGuard가 req.user에 사용자 정보를 주입합니다.
    return req.user as UserProfileDto;
  }
}
