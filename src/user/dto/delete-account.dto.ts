import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteAccountDto {
    @ApiProperty({
        description: '현재 비밀번호 (탈퇴 확인용)',
        example: 'currentPassword123!',
    })
    @IsString()
    currentPassword: string;
}
