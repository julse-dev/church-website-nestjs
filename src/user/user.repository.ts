import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CredentialUserDto } from './dto/credential-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    const { email, username, password, phone } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      email: email,
      username: username,
      password: hashedPassword,
      phone: phone,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing email');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(credentialUserDto: CredentialUserDto): Promise<string> {
    const { email, password } = credentialUserDto;
    const user = await this.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log('login access');
      return 'login access';
    } else {
      throw new UnauthorizedException('login Failed.');
    }

    // 이 아래는 암호화 및 토큰화 적용 후 다시 작성.
  }

  async deleteAccount(credentialUserDto: CredentialUserDto): Promise<void> {}

  async updateAccount(credentialUserDto: CredentialUserDto): Promise<void> {}
}
