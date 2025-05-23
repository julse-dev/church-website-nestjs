import { Controller, Post, Body, ValidationPipe, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CredentialAuthDto } from './dto/credential-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  token: string = 'access_token';

  @Post('signin')
  async signIn(
    @Body(ValidationPipe) credentialAuthDto: CredentialAuthDto,
    @Res() res: Response,
  ) {
    const accessToken = await this.authService.signIn(credentialAuthDto);
    res.cookie(this.token, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    return res.send({
      message: 'Login successful',
    });
  }

  @Post('signout')
  async signOut(@Res() res: Response) {
    res.clearCookie(this.token, {
      httpOnly: true,
      secure: true, // https 사용 시 true
      sameSite: 'strict',
    });

    console.log('logout');

    return res.status(200).json({ message: '로그아웃 되었습니다.' });
  }
}
