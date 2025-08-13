# Church Website Backend

교회 웹사이트 백엔드 API 서버 (NestJS + PostgreSQL)

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.development.example .env.development

# 개발 서버 실행
npm run start:dev
```

## 📚 문서

- [개발 가이드](docs/development-guide.md) - 상세한 개발 환경 설정
- [API 문서](http://localhost:3000/api-docs) - Swagger 문서 (서버 실행 후)

## 🔗 주요 API 엔드포인트

### 인증

- `POST /api/auth/signin` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/signout` - 로그아웃

### 사용자

- `POST /api/user/signup` - 회원가입
- `GET /api/user/me` - 내 정보 조회
- `PATCH /api/user/me/profile` - 프로필 수정
- `DELETE /api/user/me` - 회원 탈퇴

### 게시판

- `GET /api/church-news-boards/list` - 게시글 목록
- `POST /api/church-news-boards/create` - 게시글 작성
- `GET /api/church-news-boards/list/:id` - 게시글 상세
- `PATCH /api/church-news-boards/:id` - 게시글 수정
- `DELETE /api/church-news-boards/:id` - 게시글 삭제

## 🛠 기술 스택

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (HTTP-only cookies)
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 있습니다.
