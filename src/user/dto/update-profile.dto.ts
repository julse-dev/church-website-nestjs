import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiProperty({
        description: '사용자 이름',
        example: '홍길동',
        required: false,
    })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({
        description: '휴대전화 번호',
        example: '010-1234-5678',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(/^010-\d{4}-\d{4}$/, {
        message: '휴대전화 번호는 010-0000-0000 형식이어야 합니다.',
    })
    phone?: string;
}
