---
title: '시스템 아키텍처 개요'
description: 'Church Website NestJS 프로젝트의 전체 시스템 구조'
author: '개발팀'
created: '2025-07-30'
updated: '2025-07-30'
version: '1.0'
tags: ['architecture', 'overview', 'system-design']
---

# 🏗️ 시스템 아키텍처 개요

## 📋 시스템 개요

Church Website NestJS는 교회 웹사이트를 위한 백엔드 API 서버로, 사용자 관리, 교회 소식 관리, 인증/인가 기능을 제공합니다.

## 🎯 아키텍처 목표

- **확장성**: 모듈형 구조로 기능 추가 용이
- **보안성**: 다층 보안 체계 구축
- **유지보수성**: 명확한 책임 분리와 표준화
- **성능**: 효율적인 데이터 처리와 캐싱

## 🏛️ 전체 아키텍처

```text
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                    (React/Next.js)                         │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS
                      │ JSON API
┌─────────────────────▼───────────────────────────────────────┐
│                   API Gateway                               │
│              (Rate Limiting, CORS)                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  NestJS Backend                            │
│  ┌───────────────┬──────────────┬─────────────────────────┐ │
│  │   Auth        │    User      │   Church News           │ │
│  │   Module      │   Module     │   Module                │ │
│  │               │              │                         │ │
│  │ - JWT Auth    │ - Profile    │ - CRUD Operations       │ │
│  │ - Guards      │ - MyPage     │ - Content Management    │ │
│  │ - Strategies  │ - Management │ - File Upload           │ │
│  └───────────────┴──────────────┴─────────────────────────┘ │
│                              │                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Common Layer                               │ │
│  │  - Validation Pipes                                     │ │
│  │  - Exception Filters                                    │ │
│  │  - Interceptors                                         │ │
│  │  - Guards & Decorators                                  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │ TypeORM
┌─────────────────────▼───────────────────────────────────────┐
│                 PostgreSQL Database                        │
│  ┌─────────────┬─────────────┬─────────────────────────────┐ │
│  │   Users     │   Church    │        System               │ │
│  │   Table     │   News      │        Tables               │ │
│  │             │   Table     │                             │ │
│  │ - id        │ - id        │ - sessions                  │ │
│  │ - email     │ - title     │ - logs                      │ │
│  │ - password  │ - content   │ - configs                   │ │
│  │ - profile   │ - author    │                             │ │
│  └─────────────┴─────────────┴─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 기술 스택

### Backend Framework

- **NestJS**: TypeScript 기반 Node.js 프레임워크
- **Express**: HTTP 서버 엔진
- **TypeScript**: 타입 안전성을 위한 언어

### Database & ORM

- **PostgreSQL**: 관계형 데이터베이스
- **TypeORM**: 객체-관계 매핑 도구
- **Connection Pooling**: 데이터베이스 연결 최적화

### Authentication & Security

- **JWT**: JSON Web Token 기반 인증
- **bcrypt**: 비밀번호 해싱
- **Passport**: 인증 미들웨어
- **HTTP-only Cookies**: 보안 토큰 저장

### API & Documentation

- **Swagger/OpenAPI**: API 문서화
- **Class-validator**: 입력 데이터 검증
- **Class-transformer**: 데이터 변환

### Development & DevOps

- **ESLint + Prettier**: 코드 품질 관리
- **Jest**: 테스트 프레임워크
- **PM2**: 프로세스 매니저 (프로덕션)

## 📦 모듈 구조

### Core Modules

#### AuthModule

```typescript
@Module({
  imports: [JwtModule, PassportModule],
  providers: [AuthService, JwtStrategy, CookieService],
  controllers: [AuthController],
  exports: [AuthService]
})
```

- **책임**: 사용자 인증 및 권한 관리
- **주요 기능**: 로그인, 로그아웃, 토큰 관리

#### UserModule

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
```

- **책임**: 사용자 프로필 및 계정 관리
- **주요 기능**: 마이페이지, 비밀번호 변경, 계정 삭제

#### ChurchNewsBoardsModule

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([ChurchNewsBoard])],
  providers: [ChurchNewsBoardsService],
  controllers: [ChurchNewsBoardsController]
})
```

- **책임**: 교회 소식 게시판 관리
- **주요 기능**: 게시글 CRUD, 검색, 페이지네이션

## 🔐 보안 아키텍처

### 다층 보안 구조

1. **Network Layer**
   - HTTPS 강제
   - CORS 정책
   - Rate Limiting

2. **Application Layer**
   - JWT 토큰 검증
   - Role-based Access Control
   - Input Validation

3. **Data Layer**
   - SQL Injection 방지
   - 데이터 암호화
   - 접근 제어

### Authentication Flow

```text
Client                    Server                    Database
  │                         │                         │
  │ 1. POST /auth/signin    │                         │
  ├─────────────────────────▶                         │
  │                         │ 2. Validate credentials │
  │                         ├─────────────────────────▶
  │                         │ 3. User data            │
  │                         ◀─────────────────────────┤
  │                         │ 4. Generate JWT         │
  │                         │ 5. Set HTTP-only cookie │
  │ 6. Response + Cookie    │                         │
  ◀─────────────────────────┤                         │
  │                         │                         │
  │ 7. Authenticated Request│                         │
  ├─────────────────────────▶ 8. Verify JWT           │
  │                         │                         │
  │ 9. Response             │                         │
  ◀─────────────────────────┤                         │
```

## 📊 데이터 모델

### 핵심 엔티티

#### User Entity

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => ChurchNewsBoard, (board) => board.author)
  posts: ChurchNewsBoard[];
}
```

#### ChurchNewsBoard Entity

```typescript
@Entity()
export class ChurchNewsBoard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}
```

## 🚀 성능 최적화

### Database Optimization

- **Connection Pooling**: 동시 연결 수 관리
- **Query Optimization**: N+1 문제 해결
- **Indexing**: 검색 성능 향상

### Caching Strategy

- **Memory Cache**: 자주 사용되는 데이터
- **Query Cache**: 복잡한 쿼리 결과
- **Session Cache**: 사용자 세션 정보

### API Optimization

- **Pagination**: 대용량 데이터 처리
- **Compression**: 응답 데이터 압축
- **Response Optimization**: 불필요한 데이터 제거

## 📈 모니터링 & 로깅

### Logging Strategy

```typescript
// 전역 로깅 인터셉터
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    console.log(`[${new Date().toISOString()}] ${method} ${url}`);
    return next.handle();
  }
}
```

### Error Handling

```typescript
// 전역 예외 필터
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // 에러 로깅 및 응답 처리
  }
}
```

## 🔄 개발 프로세스

### Code Quality

- **TypeScript**: 컴파일 타임 타입 검증
- **ESLint**: 코드 스타일 및 품질 검사
- **Prettier**: 코드 포맷팅 자동화

### Testing Strategy

- **Unit Tests**: 개별 기능 테스트
- **Integration Tests**: 모듈 간 상호작용 테스트
- **E2E Tests**: 전체 시나리오 테스트

## 📋 확장 계획

### Phase 1 (현재)

- ✅ 기본 인증 시스템
- ✅ 사용자 관리
- ✅ 교회 소식 관리

### Phase 2 (단기)

- [ ] 파일 업로드 시스템
- [ ] 이메일 알림
- [ ] 관리자 대시보드

### Phase 3 (장기)

- [ ] 실시간 채팅
- [ ] 모바일 앱 지원
- [ ] 마이크로서비스 분리

---

**참고 문서**

- [데이터베이스 설계](./database-design.md)
- [API 설계](./api-design.md)
- [보안 정책](../security/security-policy.md)
