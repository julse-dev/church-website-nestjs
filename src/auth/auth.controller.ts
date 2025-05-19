import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialAuthDto } from './dto/credential-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body(ValidationPipe) credentialAuthDto: CredentialAuthDto) {
    return this.authService.signIn(credentialAuthDto);
  }
}
