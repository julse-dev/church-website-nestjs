# 🚀 개발 가이드

## 📋 사전 요구사항

- **Node.js**: v18.0.0 이상
- **PostgreSQL**: v13.0 이상
- **Git**: 최신 버전

## 🛠️ 개발 환경 설정

### 1. 저장소 클론 및 의존성 설치

```bash
git clone https://github.com/julse-dev/church-website-nestjs.git
cd church-website-nestjs
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.development.example .env.development
```

`.env.development` 파일을 열어서 다음 값들을 설정하세요:

```env
# 데이터베이스 설정
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=church_website

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# 서버 설정
PORT=3000
NODE_ENV=development
```

### 3. 데이터베이스 설정

PostgreSQL이 설치되어 있다면:

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE church_website;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE church_website TO your_username;
```

Docker를 사용하는 경우:

```bash
docker run --name postgres-church \
  -e POSTGRES_DB=church_website \
  -e POSTGRES_USER=your_username \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:13
```

### 4. 애플리케이션 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 빌드
npm run build
npm run start:prod
```

## 🔗 주요 엔드포인트

서버가 실행되면 다음 URL에서 확인할 수 있습니다:

- **API 서버**: http://localhost:3000
- **Swagger 문서**: http://localhost:3000/api-docs

## 📝 API 테스트

### 주요 엔드포인트

**인증**

- `POST /api/auth/signin` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/signout` - 로그아웃

**사용자**

- `POST /api/user/signup` - 회원가입
- `GET /api/user/me` - 내 정보 조회
- `PATCH /api/user/me/profile` - 프로필 수정

**게시판**

- `GET /api/church-news-boards/list` - 게시글 목록
- `POST /api/church-news-boards/create` - 게시글 작성
- `GET /api/church-news-boards/list/:id` - 게시글 상세

## 🔧 개발 도구

### VS Code 확장

권장 확장:

- **NestJS Files**: NestJS 파일 생성
- **TypeScript Importer**: 자동 import
- **Prettier**: 코드 포맷팅
- **ESLint**: 코드 린팅

### 코드 스타일

```bash
# 코드 포맷팅
npm run format

# 린팅
npm run lint
```

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

---

문제가 발생하면 GitHub Issues를 통해 문의해주세요.
