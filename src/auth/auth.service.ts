import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CredentialAuthDto } from './dto/credential-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    await this.userService.createUser(createUserDto);
  }

  async signIn(credentialAuthDto: CredentialAuthDto): Promise<string> {
    const { email, password } = credentialAuthDto;
    const user = await this.userService.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email, id: user.id };
      const accessToken = await this.jwtService.signAsync(payload);

      console.log('login access');
      return accessToken;
    } else {
      throw new UnauthorizedException('login Failed.');
    }
  }
}
