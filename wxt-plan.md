# 크롬 확장프로그램 개발환경 구축 계획

## 1. WXT 프레임워크 및 React 설정
- `apps/extension` 디렉토리 생성
- WXT 패키지 설치: `@wxt-dev/wxt`, `@wxt-dev/module-react`
- wxt.config.ts 생성 (React 모듈 및 Tailwind 플러그인 설정)

## 2. 기존 패키지 통합 설정
- **UI 컴포넌트**: `@triad/ui` 패키지 활용
  - 기존 button.tsx, card.tsx, input.tsx, label.tsx 재사용
  - 워크스페이스 의존성으로 추가 (`"@triad/ui": "workspace:*"`)
- **Tailwind 설정**: `@triad/tailwindcss-config` 확장
  - 기존 tailwind.config.ts 기반으로 확장프로그램용 설정
  - PostCSS 설정 재사용

## 3. TypeScript 경로 별칭 설정
```typescript
// wxt.config.ts
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  alias: {
    "@": resolve("./"),
    "@ui": resolve("../../packages/ui/src"),
    "@shared": resolve("../../packages/shared/src")
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
})
```

## 4. 모노레포 빌드 파이프라인
- 루트 `turbo.json`에 extension 작업 추가:
  - `dev:extension`: 개발 서버
  - `build:extension`: 프로덕션 빌드
  - `@triad/ui` 의존성 설정

## 5. 확장프로그램 기본 구조 생성
- `entrypoints/popup/`: React 기반 팝업 UI (@triad/ui 컴포넌트 활용)
- `entrypoints/background.ts`: 백그라운드 스크립트  
- `entrypoints/content.ts`: 콘텐츠 스크립트
- `assets/tailwind.css`: 기존 Tailwind 설정 import

## 6. 스타일링 통합
- 기존 `@triad/tailwindcss-config` 확장
- `packages/ui/src/globals.css` 스타일 활용
- 확장프로그램별 CSS 최적화 (bundle 크기 고려)

## 7. 참고 자료
- WXT 공식 문서: https://wxt.dev/
- React + Shadcn 예제: https://github.com/wxt-dev/examples/tree/main/examples/react-shadcn
- TypeScript 설정 가이드: https://wxt.dev/guide/essentials/config/typescript

이 계획을 통해 기존 모노레포의 UI 라이브러리와 스타일 시스템을 그대로 활용하면서 WXT의 장점을 최대한 활용할 수 있습니다.