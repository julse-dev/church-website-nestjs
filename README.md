# Church Website Backend

    이 프로젝트는 교회 웹사이트를 위한 백엔드 시스템으로, 사용자 관리, 소식 게시판, JWT 기반 인증 기능을 제공합니다.

## 🚀 Starting Project

### 📋 Prerequisites & Tech Stack

이 프로젝트는 아래 기술들을 사용하여 개발되었습니다. 프로젝트를 실행하기 위해 필요한 환경이 구축되었는지 확인해 주세요.

- Node.js: v18.0.0 이상

- PostgreSQL: v13.0 이상

- Git: 최신 버전

- 백엔드: NestJS, TypeScript

- 인증: JWT (HTTP-only cookies)

- 문서화: Swagger/OpenAPI

- 유효성 검사: class-validator, class-transformer

### ⚙️ Setup

1. **프로젝트 클론 및 의존성 설치**

   ```bash
   git clone https://github.com/julse-dev/church-website-nestjs.git
   cd church-website-nestjs
   npm install
   ```

2. **환경 변수 설정**

   ```bash
   cp .env.development.example .env.development
   ```

   필수 환경 변수:
   - `NODE_ENV`: 개발 환경 설정 (development/production)
   - `DB_TYPE`: 데이터베이스 타입 (postgres)
   - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`: 데이터베이스 연결 정보
   - `JWT_SECRET`: JWT 토큰 암호화 키
   - `JWT_EXPIRES_IN`: 토큰 만료 시간
   - `PORT`: 서버 포트 (기본값: 3001)

3. **서버 실행**

   ```bash
   npm run start:dev
   ```

## 📚 API Docs

Swagger UI를 통해 API 문서와 테스트 기능을 제공합니다.

- **접근 URL**: `http://localhost:3001/api-docs`
- **Base URL**: `/api`

주요 기능

- 사용자 인증 (회원가입/로그인)
- 사용자 프로필 관리
- 교회 소식 게시판 CRUD
- JWT 기반 인증 (HTTP-only 쿠키)

## 📄 LICENCE

    MIT License.
