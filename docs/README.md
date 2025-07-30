# 📚 Church Website NestJS 문서 센터

> 프로젝트의 모든 문서와 가이드를 한곳에서 관리합니다.

## 📋 문서 구조

```
docs/
├── README.md                    # 이 파일 - 문서 허브
├── architecture/                # 아키텍처 문서
│   ├── overview.md             # 시스템 전체 구조
│   ├── database-design.md      # 데이터베이스 설계
│   └── api-design.md           # API 설계
├── development/                 # 개발 관련 문서
│   ├── getting-started.md      # 개발 환경 설정
│   ├── coding-standards.md     # 코딩 표준
│   └── testing-guide.md        # 테스트 가이드
├── security/                    # 보안 관련 문서
│   ├── security-policy.md      # 보안 정책
│   ├── authentication.md       # 인증 시스템
│   └── COOKIE_MANAGEMENT.md    # 쿠키 관리 시스템
├── deployment/                  # 배포 관련 문서
│   ├── production-deploy.md    # 프로덕션 배포
│   ├── environment-config.md   # 환경 설정
│   └── monitoring.md           # 모니터링
├── features/                    # 기능별 문서
│   ├── user-management.md      # 사용자 관리
│   ├── mypage.md              # 마이페이지
│   └── church-news.md          # 교회 소식
├── reports/                     # 리포트 및 분석
│   ├── security-audit.md       # 보안 감사
│   ├── performance-report.md   # 성능 분석
│   └── changelog.md            # 변경 이력
└── troubleshooting/            # 문제 해결
    ├── common-issues.md        # 자주 발생하는 문제
    └── faq.md                  # 자주 묻는 질문
```

## 🎯 문서 유형별 가이드

### 📖 기술 문서

- **목적**: 시스템 이해와 유지보수
- **대상**: 개발자, 기술팀
- **위치**: `architecture/`, `development/`

### 🔒 보안 문서

- **목적**: 보안 정책과 구현 사항
- **대상**: 보안팀, 개발자
- **위치**: `security/`

### 🚀 배포 문서

- **목적**: 운영 환경 관리
- **대상**: DevOps, 운영팀
- **위치**: `deployment/`

### 📊 리포트

- **목적**: 분석 결과와 개선 사항
- **대상**: 프로젝트 매니저, 개발팀
- **위치**: `reports/`

## 🏷️ 문서 작성 규칙

### 1. 파일명 규칙

```
kebab-case.md           ✅ 권장
camelCase.md           ❌ 비권장
snake_case.md          ❌ 비권장
```

### 2. 문서 헤더 템플릿

```markdown
---
title: '문서 제목'
description: '간단한 설명'
author: '작성자'
created: 'YYYY-MM-DD'
updated: 'YYYY-MM-DD'
version: '1.0'
tags: ['tag1', 'tag2']
---
```

### 3. 문서 구조

1. **개요** - 문서의 목적과 범위
2. **상세 내용** - 핵심 정보
3. **예시/코드** - 실제 사용 예
4. **참고 자료** - 관련 링크와 문서

## 🔗 빠른 링크

### 📚 핵심 문서

- [시스템 아키텍처](./architecture/overview.md)
- [개발 시작하기](./development/getting-started.md)
- [보안 정책](./security/security-policy.md)
- [배포 가이드](./deployment/production-deploy.md)

### 🔧 개발 도구

- [코딩 표준](./development/coding-standards.md)
- [테스트 가이드](./development/testing-guide.md)
- [쿠키 관리 시스템](./security/COOKIE_MANAGEMENT.md)

### 📊 최신 리포트

- [보안 감사 리포트](./reports/security-audit.md)
- [성능 분석 리포트](./reports/performance-report.md)
- [변경 이력](./reports/changelog.md)

### 🆘 문제 해결

- [자주 발생하는 문제](./troubleshooting/common-issues.md)
- [FAQ](./troubleshooting/faq.md)

## 📝 문서 기여 가이드

### 새 문서 추가

1. 적절한 폴더에 파일 생성
2. 문서 헤더 템플릿 사용
3. 이 README에 링크 추가
4. 관련 문서들과 상호 링크 설정

### 기존 문서 수정

1. `updated` 필드 갱신
2. 변경 사항을 changelog에 기록
3. 관련 문서들의 링크 확인

## 🏆 문서 품질 체크리스트

- [ ] 명확한 제목과 목적
- [ ] 논리적인 구조와 흐름
- [ ] 실제 코드 예시 포함
- [ ] 최신 정보 반영
- [ ] 관련 문서와의 링크
- [ ] 적절한 태그와 메타데이터

---

📅 **마지막 업데이트**: 2025년 7월 30일  
👥 **관리자**: 개발팀  
🔄 **업데이트 주기**: 월 1회 정기 검토
