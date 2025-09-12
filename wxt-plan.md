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
    "@shared": resolve("../../packages/shared/src"),
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
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

## 7. WebSocket 통합 지원

### 7.1 지원 현황

- **완전 지원**: WXT 환경에서 네이티브 WebSocket API 완전 지원
- **TypeScript 타입 지원**: 완전한 타입 안전성 보장
- **React Hook 통합**: `react-use-websocket` 등 라이브러리 활용 가능
- **크로스 컨텍스트**: Background, Content Script, Popup에서 모두 사용 가능

### 7.2 Manifest 권한 설정

```json
{
  "manifest_version": 3,
  "host_permissions": [
    "wss://your-websocket-server.com/*",
    "https://your-websocket-server.com/*"
  ]
}
```

### 7.3 구현 예시

#### Background Script (`entrypoints/background.ts`)

```typescript
// 지속적인 WebSocket 연결 관리
const ws = new WebSocket("wss://api.example.com/socket");

ws.onopen = () => {
  console.log("WebSocket connected in background");
};

ws.onmessage = (event) => {
  // 다른 스크립트로 메시지 전달
  chrome.runtime.sendMessage({
    type: "websocket-data",
    data: JSON.parse(event.data),
  });
};

ws.onclose = () => {
  // 재연결 로직
  setTimeout(() => {
    // 재연결 시도
  }, 5000);
};
```

#### Content Script (`entrypoints/content.ts`)

```typescript
// 웹페이지 내에서 WebSocket 연결
const socket = new WebSocket("wss://realtime.example.com");

socket.onopen = () => {
  console.log("Connected from content script");
};

socket.onmessage = (event) => {
  // 웹페이지에 실시간 데이터 주입
  const data = JSON.parse(event.data);
  updatePageContent(data);
};

function updatePageContent(data: any) {
  // DOM 업데이트 로직
}
```

#### Popup UI (`entrypoints/popup/index.tsx`)

```typescript
import React from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Button } from '@ui/components/button';
import { Card } from '@ui/components/card';

function PopupComponent() {
  const socketUrl = 'wss://api.example.com/socket';

  const {
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <Card className="w-80 p-4">
      <h2 className="text-lg font-semibold mb-4">실시간 데이터</h2>

      <div className="mb-4">
        <span>연결 상태: {connectionStatus}</span>
      </div>

      {lastMessage && (
        <div className="mb-4 p-2 bg-gray-100 rounded">
          <pre>{lastMessage.data}</pre>
        </div>
      )}

      <Button
        onClick={() => sendMessage('Hello Server!')}
        disabled={readyState !== ReadyState.OPEN}
      >
        메시지 전송
      </Button>
    </Card>
  );
}

export default PopupComponent;
```

### 7.4 상태 관리 통합 예시

```typescript
// @triad/shared에 WebSocket 유틸리티 추가
export class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval = 5000;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
  }

  private onOpen() {
    console.log("WebSocket 연결됨");
  }

  private onMessage(event: MessageEvent) {
    // 상태 관리 라이브러리와 연동
    const data = JSON.parse(event.data);
    // Zustand store 업데이트 등
  }

  private onClose() {
    console.log("WebSocket 연결 끊어짐, 재연결 중...");
    setTimeout(() => this.connect(), this.reconnectInterval);
  }

  public send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}
```

### 7.5 보안 및 권장사항

- **WSS 사용**: 보안을 위해 Secure WebSocket(wss://) 사용 권장
- **에러 처리**: 연결 실패, 재연결 로직 구현 필수
- **메시지 필터링**: 불필요한 데이터 전송 최소화로 성능 최적화
- **연결 관리**: Background Script에서 중앙 집중식 관리 권장

## 8. 참고 자료

- WXT 공식 문서: https://wxt.dev/
- React + Shadcn 예제: https://github.com/wxt-dev/examples/tree/main/examples/react-shadcn
- TypeScript 설정 가이드: https://wxt.dev/guide/essentials/config/typescript

이 계획을 통해 기존 모노레포의 UI 라이브러리와 스타일 시스템을 그대로 활용하면서 WXT의 장점을 최대한 활용할 수 있습니다. WebSocket을 포함한 실시간 통신 기능도 완벽하게 지원됩니다.
