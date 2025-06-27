import { UserProfileDto } from 'src/user/dto/user-profile.dto';

declare global {
  namespace Express {
    export interface Request {
      user?: UserProfileDto;
    }
  }
}
