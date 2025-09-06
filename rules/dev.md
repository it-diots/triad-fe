## 개발

### 일반 원칙

- 간결하고 읽기 쉬운 TypeScript 코드를 작성하세요.
- 함수형 및 선언형 프로그래밍 패턴을 사용하세요.
- DRY (Don't Repeat Yourself) 원칙을 따르세요.
- 가독성 향상을 위해 조기 반환(Early Return)을 구현하세요.
- 컴포넌트를 논리적으로 구조화하세요.

---

### 이름 규칙 (Naming Conventions)

- 보조 동사를 사용하여 서술적인 이름을 사용하세요 (예: isLoading, hasError).
- 이벤트 핸들러 앞에는 "handle" 접두사를 붙이세요 (예: handleClick, handleSubmit).
- 디렉토리 이름은 소문자와 대시(-)를 사용하세요 (예: components/auth-wizard).
- 컴포넌트는 named export를 선호하세요.

---

### TypeScript 사용법

- 모든 코드에 TypeScript를 사용하세요.
- type보다 interface를 선호하세요.
- enum 사용을 피하고, 대신 const 맵을 사용하세요.
- 적절한 타입 안정성 및 추론을 구현하세요.
- 타입 검증을 위해 satisfies 연산자를 사용하세요.

---

### 접근성 (Accessibility)

- 시맨틱 HTML 태그를 사용하여 문서의 구조와 의미를 명확하게 전달하세요.
- 단순히 스타일링을 위해 div나 span을 남용하기보다 nav, main, button 등 의미에 맞는 태그를 우선적으로 사용하세요.
- 이미지에는 alt 속성을, 입력 요소(input)에는 label 태그를 명시하여 스크린 리더 사용자의 접근성을 향상시키세요.

---

## React 19 및 Next.js 15 베스트 프랙티스

### 컴포넌트 아키텍처

- 가능한 경우 리액트 서버 컴포넌트(RSC)를 선호하세요.
- 'use client' 지시어 사용을 최소화하세요.
- 적절한 에러 바운더리(Error Boundaries)를 구현하세요.
- 비동기 작업을 위해 Suspense를 사용하세요.
- 성능 및 웹 바이탈(Web Vitals)을 최적화하세요.

---

### 상태 관리 (State Management)

- 더 이상 사용되지 않는 useFormState 대신 useActionState를 사용하세요.
- 새로운 속성(data, method, action)이 추가된 향상된 useFormStatus를 활용하세요.
- 클라이언트 측 상태를 최소화하세요.
