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
  ) { }

  async validateUser(
    credentialAuthDto: CredentialAuthDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = credentialAuthDto;
    const user = await this.userService.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { id: user.id, username: user.username };
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('login Failed.');
    }
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findOneBy({ id: payload.id });

      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      const isMatch = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );
      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      const newAccessToken = await this.jwtService.signAsync(
        { id: user.id, username: user.username },
        { expiresIn: '1h' },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  async removeRefreshToken(refreshToken: string): Promise<void> {
    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findOneBy({ id: payload.id });
      if (user) {
        await this.userService.updateRefreshToken(user.id, null);
      }
    } catch {
      // 무시
    }
  }
}
