import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    // 영어, 숫자만 가능한 유효성 체크
    message: `영어, 숫자, !, @, #, - 등 기호를 추가해주세요.`,
  })
  password: string;
}
