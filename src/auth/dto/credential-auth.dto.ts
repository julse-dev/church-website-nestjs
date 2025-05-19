import {
  IsEmail,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CredentialAuthDto {
  @IsEmail()
  readonly email: string;

  @MinLength(10, { message: `비밀번호 최소 길이는 10자 입니다.` })
  @MaxLength(20, { message: `비밀번호 최대 길이는 20자 입니다.` })
  @IsStrongPassword(
    {
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: `각기 다른 1개 이상의 대소문자와 숫자, 특수문자를 조합해주세요.`,
    },
  )
  readonly password: string;
}
