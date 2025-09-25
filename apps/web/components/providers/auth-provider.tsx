"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/**
 * 인증 프로바이더 컴포넌트
 * 전체 앱에 Next-Auth 세션 컨텍스트를 제공합니다.
 *
 * 사용법:
 * - 루트 레이아웃에서 앱 전체를 감싸서 사용
 * - 하위 컴포넌트에서 useSession 훅으로 인증 상태 접근 가능
 */

interface AuthProviderProps {
  children: ReactNode;
  session?: Session | null;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider
      session={session}
      // 세션 새로고침 간격 (5분)
      refetchInterval={5 * 60}
      // 윈도우 포커스시 세션 새로고침
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}
