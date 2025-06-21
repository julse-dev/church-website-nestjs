import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CredentialAuthDto } from './dto/credential-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/guard/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    credentialAuthDto: CredentialAuthDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = credentialAuthDto;
    const user = await this.userService.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { id: user.id, username: user.username };
      const accessToken = await this.jwtService.signAsync(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('login Failed.');
    }
  }
}
