// Express 타입 확장
export interface AuthenticatedRequest {
    cookies: { [key: string]: string };
    user?: any;
}

export interface CookieResponse {
    cookie(name: string, val: string, options?: {
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
        maxAge?: number;
        expires?: Date;
        domain?: string;
        path?: string;
    }): void;

    clearCookie(name: string, options?: {
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
        domain?: string;
        path?: string;
    }): void;
}
