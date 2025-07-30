import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
    expires?: Date;
    domain?: string;
    path?: string;
}

@Injectable()
export class CookieService {
    private readonly ACCESS_TOKEN_COOKIE_NAME: string;
    private readonly REFRESH_TOKEN_COOKIE_NAME: string;

    constructor(private readonly configService: ConfigService) {
        this.ACCESS_TOKEN_COOKIE_NAME = this.configService.get<string>(
            'ACCESS_TOKEN_COOKIE_NAME',
            'access_token',
        );
        this.REFRESH_TOKEN_COOKIE_NAME = this.configService.get<string>(
            'REFRESH_TOKEN_COOKIE_NAME',
            'refresh_token',
        );
    }

    setAccessTokenCookie(response: any, token: string): void {
        response.cookie(this.ACCESS_TOKEN_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });
    }

    setRefreshTokenCookie(response: any, token: string): void {
        response.cookie(this.REFRESH_TOKEN_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }

    clearAuthCookies(response: any): void {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
        };

        response.clearCookie(this.ACCESS_TOKEN_COOKIE_NAME, cookieOptions);
        response.clearCookie(this.REFRESH_TOKEN_COOKIE_NAME, cookieOptions);
    }

    getRefreshTokenFromRequest(request: any): string | undefined {
        return request.cookies?.[this.REFRESH_TOKEN_COOKIE_NAME];
    }
}
