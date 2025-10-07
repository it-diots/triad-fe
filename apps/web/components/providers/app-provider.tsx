"use client";

import type { Session } from "next-auth";
import type { ReactNode } from "react";

import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";

/**
 * 앱 전체 프로바이더 통합 컴포넌트
 * QueryProvider와 AuthProvider를 결합하여 단일 Provider로 제공
 *
 * Provider 계층 구조:
 * QueryProvider (최상위)
 *   └─ AuthProvider
 *       └─ children
 *
 * 사용법:
 * - 루트 레이아웃에서 앱 전체를 감싸서 사용
 * - 모든 하위 컴포넌트에서 useSession, useQuery, useMutation 사용 가능
 *
 * @example
 * ```tsx
 * <AppProvider>
 *   <App />
 * </AppProvider>
 * ```
 */

interface AppProviderProps {
  children: ReactNode;
  session?: Session | null;
}

export function AppProvider({ children, session }: AppProviderProps) {
  return (
    <QueryProvider>
      <AuthProvider session={session}>{children}</AuthProvider>
    </QueryProvider>
  );
}
