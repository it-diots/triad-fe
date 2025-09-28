"use client";

import { Route } from "next";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * 인증 가드 컴포넌트
 * 인증되지 않은 사용자를 로그인 페이지로 리다이렉트합니다.
 */
export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // 로딩 중에는 아무것도 하지 않음

    if (!session) {
      // 현재 경로를 callbackUrl로 저장
      const callbackUrl = encodeURIComponent(window.location.href);
      router.push(`${redirectTo}?callbackUrl=${callbackUrl}` as Route);
    }
  }, [session, status, router, redirectTo]);

  // 로딩 중이거나 세션이 없으면 아무것도 렌더링하지 않음
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}