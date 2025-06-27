import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from 'src/user/user.service';
import { UserProfileDto } from 'src/user/dto/user-profile.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies['access_token'];
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserProfileDto> {
    // this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);
    const user = await this.userService.findOneBy({ id: payload.id });

    if (!user) {
      throw new UnauthorizedException('User Not Found Or Token Invalid.');
    }
    const { password, ...userProfile } = user;
    return userProfile;
  }
}
