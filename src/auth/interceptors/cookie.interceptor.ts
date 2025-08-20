import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from '../services/cookie.service';

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
}

@Injectable()
export class CookieInterceptor implements NestInterceptor {
    constructor(private readonly cookieService: CookieService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data: AuthResponse) => {
                if (data && (data.accessToken || data.refreshToken)) {
                    const response = context.switchToHttp().getResponse();

                    if (data.accessToken) {
                        this.cookieService.setAccessTokenCookie(response, data.accessToken);
                    }

                    if (data.refreshToken) {
                        this.cookieService.setRefreshTokenCookie(response, data.refreshToken);
                    }
                }
                return data;
            }),
        );
    }
}
