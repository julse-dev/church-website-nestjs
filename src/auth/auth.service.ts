import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { CredentialAuthDto } from './dto/credential-auth.dto';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async signIn(credentialAuthDto: CredentialAuthDto): Promise<void> {
    await this.userRepository.signIn(credentialAuthDto);
  }
}
