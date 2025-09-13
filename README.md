# Triad Frontend

**Triad**는 원격 팀워크를 향상시키기 위해 설계된 웹 기반 협업 도구로, 실시간 커서 공유와 위치별 댓글 기능을 제공합니다.

## 핵심 기능 (MVP v1.0)

### 실시간 커서 공유

- 같은 페이지에 있는 모든 팀원의 커서 위치 표시
- 각 사용자별 고유 색상과 이름
- 부드러운 커서 움직임 애니메이션
- WebSocket 기반 실시간 통신

### 위치별 댓글 시스템

- 웹페이지 어디든 댓글 추가 가능
- 댓글 위치를 나타내는 시각적 마커
- 답글 기능이 있는 스레드 기반 대화
- 댓글 상태 관리 (활성/해결됨/보관됨)
- 영구 댓글 데이터 저장

## 대상 사용자

- 웹 개발팀
- UX/UI 디자이너
- QA 엔지니어
- 제품 관리자
- 마케팅팀

## 기술 스택

TypeScript, Tailwind CSS, Turborepo를 사용하는 React/Next.js 모노레포입니다.

- **React 19** with Server Components (RSC)
- **Next.js 15** with App Router
- **TypeScript** with 엄격한 설정
- **Tailwind CSS** 스타일링
- **Radix UI** 접근성 있는 컴포넌트
- **Turborepo** 빌드 오케스트레이션

## 시작하기

### 사전 요구사항

- Node.js 23.6.1
- pnpm 10.15.1

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
# 모든 개발 서버 실행
pnpm dev

# 웹 앱만 실행
pnpm dev:web

# 확장프로그램만 실행
pnpm dev:extension
```

### 빌드

```bash
# 모든 패키지와 앱 빌드
pnpm build

# 웹 앱만 빌드
pnpm build:web

# 확장프로그램만 빌드
pnpm build:extension
```

### 코드 품질

```bash
# ESLint 실행
pnpm lint

# 코드 포맷팅
pnpm format

# 타입 검사
pnpm type-check
```

## 프로젝트 구조

```
triad-fe/
├── apps/
│   ├── extension/           # WXT 크롬 확장프로그램
│   └── web/                 # Next.js 15 애플리케이션
├── packages/
│   ├── ui/                  # 공유 React 컴포넌트 라이브러리
│   ├── eslint-config/       # ESLint 및 Prettier 설정
│   ├── typescript-config/   # TypeScript 설정
│   ├── tailwindcss-config/  # Tailwind CSS 설정
│   └── shared/              # 공통 유틸리티와 타입
└── rules/                   # 프로젝트 개발 규칙
```

## 최근 변경사항

WXT 프레임워크를 사용한 Chrome 확장 프로그램 개발 환경이 추가되었습니다. 웹 애플리케이션과 확장 프로그램 모두 지원하는 하이브리드 구조로 발전했습니다.
