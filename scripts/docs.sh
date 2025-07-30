#!/bin/bash

# 📚 문서 관리 자동화 스크립트
# 문서 생성, 업데이트, 검증을 자동화합니다.

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 기본 경로
DOCS_DIR="docs"
TEMPLATES_DIR="$DOCS_DIR/templates"

# 로고 출력
print_logo() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    📚 문서 관리 도구                         ║"
    echo "║              Church Website NestJS Project                   ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# 도움말 출력
show_help() {
    echo -e "${GREEN}사용법:${NC}"
    echo "  ./scripts/docs.sh [명령어]"
    echo ""
    echo -e "${GREEN}명령어:${NC}"
    echo "  init     - 문서 구조 초기화"
    echo "  new      - 새 문서 생성"
    echo "  update   - 문서 메타데이터 업데이트"
    echo "  validate - 문서 유효성 검사"
    echo "  toc      - 목차 생성"
    echo "  build    - 문서 빌드"
    echo "  serve    - 문서 서버 실행"
    echo "  help     - 도움말 표시"
    echo ""
    echo -e "${GREEN}예시:${NC}"
    echo "  ./scripts/docs.sh new feature/user-management"
    echo "  ./scripts/docs.sh validate"
    echo "  ./scripts/docs.sh toc"
}

# 문서 구조 초기화
init_docs() {
    echo -e "${YELLOW}📁 문서 구조 초기화 중...${NC}"
    
    # 기본 디렉토리 생성
    mkdir -p "$DOCS_DIR"/{architecture,development,security,deployment,features,reports,troubleshooting,templates}
    
    # 템플릿 파일들 생성
    create_templates
    
    echo -e "${GREEN}✅ 문서 구조 초기화 완료!${NC}"
}

# 템플릿 파일 생성
create_templates() {
    echo -e "${YELLOW}📄 템플릿 파일 생성 중...${NC}"
    
    # 기본 문서 템플릿
    cat > "$TEMPLATES_DIR/basic.md" << 'EOF'
---
title: ""
description: ""
author: "개발팀"
created: "$(date +%Y-%m-%d)"
updated: "$(date +%Y-%m-%d)"
version: "1.0"
tags: []
---

# 제목

## 개요

문서의 목적과 범위를 설명합니다.

## 내용

### 섹션 1

내용을 작성합니다.

### 섹션 2

내용을 작성합니다.

## 참고 자료

- [링크 제목](URL)

---

📅 **마지막 업데이트**: $(date +%Y년\ %m월\ %d일)
👥 **관리자**: 개발팀
EOF

    # API 문서 템플릿
    cat > "$TEMPLATES_DIR/api.md" << 'EOF'
---
title: ""
description: ""
author: "개발팀"
created: "$(date +%Y-%m-%d)"
updated: "$(date +%Y-%m-%d)"
version: "1.0"
tags: ["api", "endpoint"]
---

# API 명세서

## 개요

API의 목적과 사용법을 설명합니다.

## 엔드포인트

### GET /api/example

**설명**: 예시 엔드포인트

**요청**:
```http
GET /api/example
Authorization: Bearer {token}
```

**응답**:
```json
{
  "status": "success",
  "data": {}
}
```

**에러 응답**:
```json
{
  "status": "error",
  "message": "오류 메시지"
}
```

## 인증

JWT 토큰을 사용한 Bearer 인증이 필요합니다.

---

📅 **마지막 업데이트**: $(date +%Y년\ %m월\ %d일)
👥 **관리자**: 개발팀
EOF

    # 기능 문서 템플릿
    cat > "$TEMPLATES_DIR/feature.md" << 'EOF'
---
title: ""
description: ""
author: "개발팀"
created: "$(date +%Y-%m-%d)"
updated: "$(date +%Y-%m-%d)"
version: "1.0"
tags: ["feature", "functionality"]
---

# 기능 명세서

## 개요

기능의 목적과 범위를 설명합니다.

## 요구사항

### 기능 요구사항

- [ ] 요구사항 1
- [ ] 요구사항 2

### 비기능 요구사항

- [ ] 성능 요구사항
- [ ] 보안 요구사항

## 설계

### 아키텍처

기능의 아키텍처를 설명합니다.

### 데이터 모델

```typescript
interface Example {
  id: number;
  name: string;
}
```

## 구현

### 코드 예시

```typescript
// 예시 코드
export class ExampleService {
  async getData(): Promise<Example> {
    // 구현 내용
  }
}
```

## 테스트

### 테스트 시나리오

1. 정상 케이스
2. 에러 케이스

## 배포

배포 시 고려사항을 설명합니다.

---

📅 **마지막 업데이트**: $(date +%Y년\ %m월\ %d일)
👥 **관리자**: 개발팀
EOF

    echo -e "${GREEN}✅ 템플릿 파일 생성 완료!${NC}"
}

# 새 문서 생성
create_new_doc() {
    if [ -z "$1" ]; then
        echo -e "${RED}❌ 파일 경로를 입력해주세요.${NC}"
        echo "예시: ./scripts/docs.sh new features/user-management"
        return 1
    fi
    
    local file_path="$DOCS_DIR/$1.md"
    local dir_path=$(dirname "$file_path")
    
    # 디렉토리 생성
    mkdir -p "$dir_path"
    
    # 템플릿 선택
    echo -e "${YELLOW}📝 문서 템플릿을 선택하세요:${NC}"
    echo "1) 기본 문서"
    echo "2) API 문서"
    echo "3) 기능 문서"
    read -p "선택 (1-3): " template_choice
    
    case $template_choice in
        1) template_file="$TEMPLATES_DIR/basic.md" ;;
        2) template_file="$TEMPLATES_DIR/api.md" ;;
        3) template_file="$TEMPLATES_DIR/feature.md" ;;
        *) template_file="$TEMPLATES_DIR/basic.md" ;;
    esac
    
    # 템플릿 복사 및 날짜 치환
    sed "s/\$(date +%Y-%m-%d)/$(date +%Y-%m-%d)/g; s/\$(date +%Y년\\ %m월\\ %d일)/$(date +%Y년\ %m월\ %d일)/g" "$template_file" > "$file_path"
    
    echo -e "${GREEN}✅ 새 문서가 생성되었습니다: $file_path${NC}"
    echo -e "${BLUE}💡 VS Code로 열기: code $file_path${NC}"
}

# 문서 메타데이터 업데이트
update_metadata() {
    echo -e "${YELLOW}🔄 문서 메타데이터 업데이트 중...${NC}"
    
    local updated_count=0
    
    # 모든 .md 파일 찾기
    find "$DOCS_DIR" -name "*.md" -type f | while read -r file; do
        if grep -q "updated:" "$file"; then
            # updated 필드를 현재 날짜로 변경
            sed -i.bak "s/updated: \"[^\"]*\"/updated: \"$(date +%Y-%m-%d)\"/" "$file"
            rm "${file}.bak"
            echo "✓ 업데이트됨: $file"
            ((updated_count++))
        fi
    done
    
    echo -e "${GREEN}✅ $updated_count개 문서의 메타데이터가 업데이트되었습니다!${NC}"
}

# 문서 유효성 검사
validate_docs() {
    echo -e "${YELLOW}🔍 문서 유효성 검사 중...${NC}"
    
    local errors=0
    local warnings=0
    
    # markdownlint 설치 확인
    if ! command -v markdownlint &> /dev/null; then
        echo -e "${YELLOW}⚠️ markdownlint가 설치되지 않았습니다. 설치 중...${NC}"
        npm install -g markdownlint-cli
    fi
    
    # 모든 .md 파일 검사
    find "$DOCS_DIR" -name "*.md" -type f | while read -r file; do
        echo "검사 중: $file"
        
        # Markdown 문법 검사
        if ! markdownlint "$file" --config .markdownlint.json 2>/dev/null; then
            echo -e "${RED}❌ Markdown 문법 오류: $file${NC}"
            ((errors++))
        fi
        
        # Front matter 검사
        if ! grep -q "^---" "$file"; then
            echo -e "${YELLOW}⚠️ Front matter 누락: $file${NC}"
            ((warnings++))
        fi
        
        # 필수 필드 검사
        for field in "title" "description" "author" "created" "updated"; do
            if ! grep -q "$field:" "$file"; then
                echo -e "${YELLOW}⚠️ 필수 필드 '$field' 누락: $file${NC}"
                ((warnings++))
            fi
        done
        
        # 깨진 링크 검사 (기본적인 검사)
        if grep -q "](.*\.md)" "$file"; then
            grep -o "](.*\.md)" "$file" | sed 's/](\(.*\))/\1/' | while read -r link; do
                if [[ "$link" =~ ^\./ ]]; then
                    local target_file="$(dirname "$file")/${link#./}"
                    if [ ! -f "$target_file" ]; then
                        echo -e "${RED}❌ 깨진 링크: $link in $file${NC}"
                        ((errors++))
                    fi
                fi
            done
        fi
    done
    
    echo ""
    if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
        echo -e "${GREEN}✅ 모든 문서가 유효합니다!${NC}"
    else
        echo -e "${RED}❌ $errors개의 오류와 $warnings개의 경고가 발견되었습니다.${NC}"
    fi
}

# 목차 생성
generate_toc() {
    echo -e "${YELLOW}📋 목차 생성 중...${NC}"
    
    local toc_file="$DOCS_DIR/TABLE_OF_CONTENTS.md"
    
    cat > "$toc_file" << 'EOF'
# 📚 목차 (Table of Contents)

> 자동 생성된 문서 목차입니다.

## 📁 문서 구조

EOF

    # 폴더별로 문서 목록 생성
    find "$DOCS_DIR" -name "*.md" -not -path "*/templates/*" -not -name "TABLE_OF_CONTENTS.md" | sort | while read -r file; do
        local relative_path=${file#$DOCS_DIR/}
        local dir_name=$(dirname "$relative_path")
        local file_name=$(basename "$relative_path" .md)
        local title=""
        
        # 파일에서 title 추출
        if grep -q "title:" "$file"; then
            title=$(grep "title:" "$file" | sed 's/title: *"\([^"]*\)".*/\1/')
        else
            title="$file_name"
        fi
        
        echo "- [$title](./$relative_path) \`$dir_name\`" >> "$toc_file"
    done
    
    cat >> "$toc_file" << EOF

---

📅 **생성일**: $(date +%Y년\ %m월\ %d일)  
🤖 **자동 생성**: docs.sh 스크립트
EOF

    echo -e "${GREEN}✅ 목차가 생성되었습니다: $toc_file${NC}"
}

# 문서 빌드 (정적 사이트 생성)
build_docs() {
    echo -e "${YELLOW}🏗️ 문서 빌드 중...${NC}"
    
    # MkDocs나 다른 정적 사이트 생성기 사용
    if command -v mkdocs &> /dev/null; then
        mkdocs build
        echo -e "${GREEN}✅ MkDocs로 문서가 빌드되었습니다!${NC}"
    elif command -v docsify &> /dev/null; then
        docsify serve "$DOCS_DIR"
        echo -e "${GREEN}✅ Docsify로 문서 서버가 실행되었습니다!${NC}"
    else
        echo -e "${YELLOW}⚠️ 정적 사이트 생성기가 설치되지 않았습니다.${NC}"
        echo -e "${BLUE}💡 MkDocs 설치: pip install mkdocs${NC}"
        echo -e "${BLUE}💡 Docsify 설치: npm install -g docsify-cli${NC}"
    fi
}

# 문서 서버 실행
serve_docs() {
    echo -e "${YELLOW}🌐 문서 서버 실행 중...${NC}"
    
    if command -v docsify &> /dev/null; then
        docsify serve "$DOCS_DIR" --port 3001
    elif command -v mkdocs &> /dev/null; then
        mkdocs serve
    else
        # Python으로 간단한 서버 실행
        echo -e "${BLUE}💡 Python HTTP 서버로 문서를 제공합니다...${NC}"
        cd "$DOCS_DIR" && python3 -m http.server 3001
    fi
}

# 메인 함수
main() {
    print_logo
    
    case "${1:-help}" in
        "init")
            init_docs
            ;;
        "new")
            create_new_doc "$2"
            ;;
        "update")
            update_metadata
            ;;
        "validate")
            validate_docs
            ;;
        "toc")
            generate_toc
            ;;
        "build")
            build_docs
            ;;
        "serve")
            serve_docs
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 스크립트 실행
main "$@"
