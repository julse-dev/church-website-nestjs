import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @MinLength(10)
  @MaxLength(20)
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{10,}$/,
    {
      message: `하나 이상의 알파벳 문자, 숫자 그리고 $, @, $, !, %, *, #, ?, & 등 기호를 추가하여 최소 10자 이상, 20자 이하의 비밀번호를 생성하세요.`,
    },
  )
  readonly password: string;

  @IsPhoneNumber('KR', { message: `한국 폰 번호를 입력해주세요.` })
  readonly phone: string;
}
