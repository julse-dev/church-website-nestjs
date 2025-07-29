# Church Website in Nest.js

본 프로젝트는 교회 웹사이트 백엔드를 구현하는 프로젝트입니다.

## Project Setup

### 1. Spec

Node: 최신 LTS  
Nest.js: 최신 LTS  
PostgreSQL: 최신 LTS

### 2. Install

```zsh
npm install
```

### 3. Run

```zsh
npm run start:dev
```

## API Endpoints

### Authentication

- `POST /api/auth/signin` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/signout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

### User Management

- `POST /api/user/signup` - 회원가입
- `POST /api/user/me` - 내 정보 조회 (구버전)
- `POST /api/user/me/update` - 내 정보 수정 (구버전)
- `POST /api/user/me/delete` - 회원 탈퇴 (구버전)

### MyPage (마이페이지)

- `GET /api/user/mypage` - 마이페이지 정보 조회 (이름, 이메일, 전화번호)
- `PUT /api/user/mypage/password` - 비밀번호 변경
- `PUT /api/user/mypage/profile` - 프로필 수정 (이름, 전화번호)
- `GET /api/user/mypage/posts` - 내가 작성한 게시글 조회
- `DELETE /api/user/mypage/account` - 회원 탈퇴

### Church News Boards

- `POST /api/church-news-boards/create` - 게시글 생성
- `GET /api/church-news-boards/list` - 게시글 목록 조회
- `GET /api/church-news-boards/list/:id` - 특정 게시글 조회
- `PATCH /api/church-news-boards/:id` - 게시글 수정
- `DELETE /api/church-news-boards/:id` - 게시글 삭제

## 마이페이지 기능

### 1. 사용자 정보 조회

- **엔드포인트**: `GET /api/user/mypage`
- **인증**: JWT 토큰 필요
- **응답**: 사용자명, 이메일, 전화번호 (비밀번호 제외)

### 2. 사용자 정보 수정

#### 2.1 비밀번호 변경

- **엔드포인트**: `PUT /api/user/mypage/password`
- **인증**: JWT 토큰 필요
- **요청 본문**:

  ```json
  {
    "currentPassword": "현재_비밀번호",
    "newPassword": "새_비밀번호"
  }
  ```

- **비밀번호 요구사항**: 최소 8자, 대소문자, 숫자, 특수문자 포함

#### 2.2 프로필 수정

- **엔드포인트**: `PUT /api/user/mypage/profile`
- **인증**: JWT 토큰 필요
- **요청 본문**:

  ```json
  {
    "username": "새_사용자명",
    "phone": "010-0000-0000"
  }
  ```

- **참고**: 이메일은 수정할 수 없습니다.

### 3. 사용자 게시글 조회

- **엔드포인트**: `GET /api/user/mypage/posts`
- **인증**: JWT 토큰 필요
- **응답**: 사용자가 작성한 모든 게시글 목록

### 4. 회원 탈퇴

- **엔드포인트**: `DELETE /api/user/mypage/account`
- **인증**: JWT 토큰 필요
- **요청 본문**:

  ```json
  {
    "currentPassword": "현재_비밀번호"
  }
  ```

- **참고**: 비밀번호 확인을 통해 탈퇴 의사를 재확인합니다.

## 보안 고려사항

- 모든 마이페이지 엔드포인트는 JWT 인증이 필요합니다.
- 비밀번호 변경 및 회원 탈퇴 시 현재 비밀번호를 확인합니다.
- 비밀번호는 bcrypt로 해싱되어 저장됩니다.
- 응답에서 비밀번호와 같은 민감한 정보는 제외됩니다.
