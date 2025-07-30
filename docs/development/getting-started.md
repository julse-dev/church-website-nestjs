---
title: '개발 시작 가이드'
description: 'Church Website NestJS 프로젝트 개발 환경 설정 및 시작 가이드'
author: '개발팀'
created: '2025-07-30'
updated: '2025-07-30'
version: '1.0'
tags: ['development', 'setup', 'guide']
---

# 🚀 개발 시작 가이드

## 📋 사전 요구사항

### 필수 소프트웨어

- **Node.js**: v18.0.0 이상
- **npm**: v8.0.0 이상 (또는 yarn v1.22.0 이상)
- **PostgreSQL**: v13.0 이상
- **Git**: v2.30.0 이상

### 권장 개발 도구

- **VS Code**: IDE
- **Docker**: 데이터베이스 컨테이너
- **Postman**: API 테스트
- **DBeaver**: 데이터베이스 관리

## 🛠️ 개발 환경 설정

### 1. 저장소 클론

```bash
git clone https://github.com/julse-dev/church-website-nestjs.git
cd church-website-nestjs
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

```bash
# 환경 변수 파일 복사
cp .env.development.example .env.development
```

`.env.development` 파일 편집:

```bash
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=church_admin
DB_PASSWORD=your_secure_password
DB_NAME=church_website_dev
DB_SYNC=true

# JWT 설정
JWT_SECRET=your_super_secure_jwt_secret_key
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key

# 쿠키 설정
ACCESS_TOKEN_COOKIE_NAME=access_token
REFRESH_TOKEN_COOKIE_NAME=refresh_token

# 환경 설정
NODE_ENV=development
PORT=3000

# CORS 설정
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. 데이터베이스 설정

#### 옵션 A: PostgreSQL 직접 설치

1. PostgreSQL 설치 (macOS)

   ```bash
   brew install postgresql
   brew services start postgresql
   ```

2. 데이터베이스 생성

   ```bash
   createdb church_website_dev
   createuser church_admin
   psql church_website_dev
   ```

   ```sql
   ALTER USER church_admin WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE church_website_dev TO church_admin;
   ```

#### 옵션 B: Docker 사용

```bash
# PostgreSQL 컨테이너 실행
docker run --name church-postgres \
  -e POSTGRES_DB=church_website_dev \
  -e POSTGRES_USER=church_admin \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  -d postgres:13
```

### 5. 애플리케이션 실행

```bash
# 개발 모드 실행
npm run start:dev

# 또는 디버그 모드
npm run start:debug
```

서버가 성공적으로 실행되면:

- API 서버: http://localhost:3000
- Swagger 문서: http://localhost:3000/api

## 📁 프로젝트 구조

```text
src/
├── main.ts                    # 애플리케이션 진입점
├── app.module.ts             # 루트 모듈
├── auth/                     # 인증 모듈
│   ├── auth.controller.ts    # 인증 컨트롤러
│   ├── auth.service.ts       # 인증 서비스
│   ├── auth.module.ts        # 인증 모듈
│   ├── dto/                  # 데이터 전송 객체
│   ├── services/             # 서비스 레이어
│   ├── types/                # 타입 정의
│   └── interceptors/         # 인터셉터
├── user/                     # 사용자 모듈
│   ├── user.controller.ts    # 사용자 컨트롤러
│   ├── user.service.ts       # 사용자 서비스
│   ├── user.module.ts        # 사용자 모듈
│   ├── dto/                  # 데이터 전송 객체
│   └── entities/             # 엔티티
├── church-news-boards/       # 교회 소식 모듈
├── configs/                  # 설정 파일
├── guard/                    # 가드
└── types/                    # 공통 타입
```

## 🔧 개발 명령어

### 기본 명령어

```bash
# 개발 서버 실행
npm run start:dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start:prod

# 테스트 실행
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

### 코드 품질

```bash
# 린팅 검사
npm run lint

# 린팅 자동 수정
npm run lint:fix

# 포맷팅
npm run format
```

### 데이터베이스

```bash
# 마이그레이션 생성
npm run migration:generate -- src/migrations/MigrationName

# 마이그레이션 실행
npm run migration:run

# 마이그레이션 되돌리기
npm run migration:revert
```

## 🧪 테스트

### 단위 테스트

```bash
# 특정 파일 테스트
npm run test -- auth.service.spec.ts

# 특정 모듈 테스트
npm run test -- --testPathPattern=auth

# 감시 모드
npm run test:watch
```

### E2E 테스트

```bash
# 전체 E2E 테스트
npm run test:e2e

# 특정 E2E 테스트
npm run test:e2e -- --testNamePattern="Auth"
```

## 🔍 디버깅

### VS Code 디버깅 설정

`.vscode/launch.json` 파일:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug NestJS",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/main.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "runtimeArgs": ["--nolazy", "-r", "ts-node/register"],
      "sourceMaps": true,
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

### 로그 레벨 설정

```typescript
// main.ts
app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
```

## 📊 API 테스트

### Swagger UI 사용

1. 서버 실행 후 http://localhost:3000/api 접속
2. API 엔드포인트 탐색 및 테스트
3. 인증이 필요한 API의 경우 로그인 후 토큰 사용

### Postman 컬렉션

```json
{
  "info": {
    "name": "Church Website API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{access_token}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Sign In",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/signin",
              "host": ["{{base_url}}"],
              "path": ["auth", "signin"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000"
    }
  ]
}
```

## 🛡️ 보안 고려사항

### 개발 환경 보안

1. **환경 변수 관리**
   - `.env` 파일은 절대 커밋하지 않기
   - 강력한 JWT 시크릿 사용
   - 개발용 데이터베이스 계정 분리

2. **HTTPS 사용**

   ```bash
   # 개발 환경에서 HTTPS 사용 (선택사항)
   npm install -g mkcert
   mkcert localhost
   ```

3. **의존성 보안 검사**
   ```bash
   npm audit
   npm audit fix
   ```

## 🚨 문제 해결

### 자주 발생하는 문제

#### 1. 데이터베이스 연결 실패

```bash
# 데이터베이스 상태 확인
pg_isready -h localhost -p 5432

# PostgreSQL 서비스 재시작
brew services restart postgresql
```

#### 2. 포트 충돌

```bash
# 포트 사용 중인 프로세스 확인
lsof -i :3000

# 프로세스 종료
kill -9 <PID>
```

#### 3. 의존성 충돌

```bash
# node_modules 및 package-lock.json 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript 컴파일 오류

```bash
# TypeScript 캐시 클리어
npm run build -- --clean
```

### 로그 확인

```bash
# 개발 서버 로그
npm run start:dev

# 상세 로그
DEBUG=* npm run start:dev
```

## 📚 추가 리소스

### 공식 문서

- [NestJS 공식 문서](https://docs.nestjs.com/)
- [TypeORM 문서](https://typeorm.io/)
- [PostgreSQL 문서](https://www.postgresql.org/docs/)

### 개발 도구

- [VS Code NestJS 확장](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)
- [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client)
- [PostgreSQL VS Code](https://marketplace.visualstudio.com/items?itemName=ms-ossdata.vscode-postgresql)

---

**다음 단계**: [코딩 표준](./coding-standards.md) 문서를 확인하여 프로젝트의 코딩 규칙을 숙지하세요.
