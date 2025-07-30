import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
}

@Injectable()
export class CookieInterceptor implements NestInterceptor {
    constructor(private readonly configService: ConfigService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data: AuthResponse) => {
                if (data && (data.accessToken || data.refreshToken)) {
                    const response = context.switchToHttp().getResponse();

                    if (data.accessToken) {
                        response.cookie('access_token', data.accessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 60 * 60 * 1000, // 1 hour
                        });
                    }

                    if (data.refreshToken) {
                        response.cookie('refresh_token', data.refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                        });
                    }
                }
                return data;
            }),
        );
    }
}
