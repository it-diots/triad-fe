"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { useState } from "react";

/**
 * TanStack Query 프로바이더 컴포넌트
 * 전체 앱에 React Query 컨텍스트를 제공합니다.
 *
 * QueryClient 기본 설정:
 * - staleTime: 5분 (데이터가 오래된 것으로 간주되기까지의 시간)
 * - gcTime: 10분 (비활성 캐시가 메모리에 유지되는 시간)
 * - retry: 1 (실패 시 재시도 횟수)
 * - refetchOnWindowFocus: true (윈도우 포커스 시 자동 재요청)
 *
 * 사용법:
 * - 루트 레이아웃에서 앱 전체를 감싸서 사용
 * - 하위 컴포넌트에서 useQuery, useMutation 훅으로 서버 상태 관리
 *
 * @example
 * ```tsx
 * <QueryProvider>
 *   <App />
 * </QueryProvider>
 * ```
 */

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // useState로 QueryClient 인스턴스 생성 (컴포넌트 리렌더링 시에도 동일한 인스턴스 유지)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5분 동안 데이터를 fresh 상태로 유지
            staleTime: 5 * 60 * 1000,
            // 10분 동안 비활성 캐시를 메모리에 유지
            gcTime: 10 * 60 * 1000,
            // 실패 시 1번 재시도
            retry: 1,
            // 윈도우 포커스 시 자동으로 데이터 재요청
            refetchOnWindowFocus: false,
          },
          mutations: {
            // 뮤테이션 실패 시 재시도 안 함
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 React Query DevTools 표시 */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
