import { UserProfileDto } from '../../user/dto/user-profile.dto';

declare global {
  namespace Express {
    interface Request {
      user?: UserProfileDto;
    }

    interface Response {
      cookie(name: string, val: string, options?: any): this;
      clearCookie(name: string, options?: any): this;
    }
  }
}

export { };
