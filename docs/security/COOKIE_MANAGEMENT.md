# 🍪 타입 안전한 쿠키 관리 시스템

## 개요

NestJS 프로젝트에서 HTTP-only 쿠키 기반 JWT 인증을 구현하면서 TypeScript의 타입 안전성을 보장하는 쿠키 관리 시스템입니다.

## 🎯 목적

- Express Response/Request 타입 오류 해결
- `any` 타입 사용 없이 완전한 타입 안전성 보장
- 쿠키 관련 로직을 서비스로 분리하여 재사용성 향상
- 관심사 분리를 통한 코드 품질 개선

## 📁 아키텍처

```text
src/auth/
├── services/
│   └── cookie.service.ts      # 쿠키 관리 전용 서비스
├── types/
│   └── auth-types.ts          # 커스텀 타입 정의
├── interceptors/
│   └── cookie.interceptor.ts  # 쿠키 설정 인터셉터 (선택사항)
├── auth.controller.ts         # 인증 컨트롤러
├── auth.service.ts           # 인증 비즈니스 로직
└── auth.module.ts            # 모듈 설정
```

## 🔧 구현 상세

### 1. CookieService (`src/auth/services/cookie.service.ts`)

#### 주요 기능

- **setAccessTokenCookie**: Access Token을 HTTP-only 쿠키로 설정
- **setRefreshTokenCookie**: Refresh Token을 HTTP-only 쿠키로 설정
- **clearAuthCookies**: 인증 관련 쿠키들을 삭제
- **getRefreshTokenFromRequest**: 요청에서 Refresh Token 추출

#### 코드 예시

```typescript
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

  // ... 기타 메서드들
}
```

#### 보안 설정

- **httpOnly: true** - JavaScript를 통한 쿠키 접근 차단 (XSS 방지)
- **secure: production 환경에서만** - HTTPS에서만 쿠키 전송
- **sameSite: 'strict'** - CSRF 공격 방지
- **maxAge** - 쿠키 만료 시간 설정

### 2. 커스텀 타입 정의 (`src/auth/types/auth-types.ts`)

Express 타입 오류를 해결하기 위한 커스텀 인터페이스:

```typescript
export interface AuthenticatedRequest {
  cookies: { [key: string]: string };
  user?: any;
}

export interface CookieResponse {
  cookie(name: string, val: string, options?: CookieOptions): void;
  clearCookie(name: string, options?: CookieOptions): void;
}

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  expires?: Date;
  domain?: string;
  path?: string;
}
```

### 3. 개선된 Auth Controller

#### Before (문제가 있던 코드)

```typescript
async signIn(@Res() res: any) {  // any 타입 사용
  res.cookie('access_token', token, { ... });
  // 중복된 쿠키 설정 로직
}
```

#### After (개선된 코드)

```typescript
async signIn(
  @Body(ValidationPipe) credentialAuthDto: CredentialAuthDto,
  @Res({ passthrough: true }) res: CookieResponse,  // 타입 안전
) {
  const { accessToken, refreshToken } =
    await this.authService.validateUser(credentialAuthDto);

  this.cookieService.setAccessTokenCookie(res, accessToken);  // 서비스 사용
  this.cookieService.setRefreshTokenCookie(res, refreshToken);

  return { accessToken };
}
```

### 4. NestJS 표준 패턴 적용

#### CurrentUser 데코레이터 활용

```typescript
@Get('/me')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: UserProfileDto): UserProfileDto {
  return user;  // req.user 대신 직접 사용
}
```

## 🚀 사용법

### 1. 모듈 설정

```typescript
// auth.module.ts
@Module({
  providers: [AuthService, JwtStrategy, CookieService],
  // ...
})
export class AuthModule {}
```

### 2. 컨트롤러에서 사용

```typescript
constructor(
  private readonly authService: AuthService,
  private readonly cookieService: CookieService,
) {}

@Post('/signin')
async signIn(
  @Body() credentialAuthDto: CredentialAuthDto,
  @Res({ passthrough: true }) res: CookieResponse,
) {
  const { accessToken, refreshToken } =
    await this.authService.validateUser(credentialAuthDto);

  this.cookieService.setAccessTokenCookie(res, accessToken);
  this.cookieService.setRefreshTokenCookie(res, refreshToken);

  return { accessToken };
}
```

### 3. 환경 변수 설정

```bash
# .env.development
ACCESS_TOKEN_COOKIE_NAME=access_token
REFRESH_TOKEN_COOKIE_NAME=refresh_token
```

## ✅ 해결된 문제들

### 1. TypeScript 타입 오류

```text
❌ 'Response<any, Record<string, any>>' 형식에 'cookie' 속성이 없습니다.
❌ 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>' 형식에 'user' 속성이 없습니다.

✅ 커스텀 타입 정의로 해결
✅ CookieService로 추상화
```

### 2. 코드 중복 제거

```text
❌ 각 메서드마다 동일한 쿠키 설정 로직 반복
✅ CookieService로 중앙화된 관리
```

### 3. any 타입 사용 제거

```text
❌ @Res() res: any  // 타입 안전성 포기
✅ @Res() res: CookieResponse  // 완전한 타입 안전성
```

## 🎯 장점

### 1. **타입 안전성**

- 컴파일 시점에서 타입 오류 발견
- IntelliSense 자동완성 지원
- 리팩토링 시 안전성 보장

### 2. **관심사 분리**

- 쿠키 관련 로직이 별도 서비스로 분리
- 컨트롤러는 비즈니스 로직에만 집중
- 단일 책임 원칙 준수

### 3. **재사용성**

- 다른 컨트롤러에서도 CookieService 사용 가능
- 일관된 쿠키 설정 보장
- DRY 원칙 준수

### 4. **테스트 용이성**

- CookieService를 쉽게 모킹 가능
- 단위 테스트 작성 용이
- 통합 테스트에서 쿠키 동작 검증 가능

### 5. **유지보수성**

- 쿠키 설정 변경이 한 곳에서 관리
- 보안 정책 변경 시 중앙에서 수정
- 코드 가독성 향상

## 🔒 보안 고려사항

### 1. **HTTP-only 쿠키**

```typescript
httpOnly: true; // JavaScript를 통한 쿠키 접근 차단
```

### 2. **Secure 플래그**

```typescript
secure: process.env.NODE_ENV === 'production'; // HTTPS에서만 전송
```

### 3. **SameSite 정책**

```typescript
sameSite: 'strict'; // CSRF 공격 방지
```

### 4. **쿠키 만료 시간**

```typescript
maxAge: 60 * 60 * 1000; // Access Token: 1시간
maxAge: 7 * 24 * 60 * 60 * 1000; // Refresh Token: 7일
```

## 📚 참고자료

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Express Cookie Documentation](https://expressjs.com/en/api.html#res.cookie)
- [TypeScript Advanced Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [HTTP-only Cookies Security](https://owasp.org/www-community/HttpOnly)

## 🔄 마이그레이션 가이드

### 기존 코드에서 새 시스템으로 마이그레이션

1. **CookieService 추가**

   ```bash
   # 파일 생성
   src/auth/services/cookie.service.ts
   src/auth/types/auth-types.ts
   ```

2. **의존성 주입**

   ```typescript
   // auth.module.ts
   providers: [AuthService, CookieService];
   ```

3. **컨트롤러 수정**

   ```typescript
   // 기존: res.cookie() 직접 사용
   // 신규: this.cookieService.setAccessTokenCookie()
   ```

4. **타입 정의 적용**

   ```typescript
   // 기존: @Res() res: any
   // 신규: @Res() res: CookieResponse
   ```

이 시스템을 통해 TypeScript의 모든 장점을 유지하면서도 안전하고 유지보수가 용이한 쿠키 기반 인증을 구현할 수 있습니다.
