/**
 * API 클라이언트 인증 토큰 관리
 * NextAuth 세션과 로컬 스토리지를 통한 토큰 제공
 */

import { getSession } from "next-auth/react";

/**
 * 서버 환경에서 사용할 토큰 (API 라우트용)
 */
let serverToken: string | null = null;

export function setServerToken(token: string | null) {
  serverToken = token;
}

/**
 * 환경에 따른 토큰 가져오기
 * 1. 서버: serverToken 사용
 * 2. 브라우저: NextAuth 세션 → localStorage → sessionStorage 순서
 */
export async function getEnvironmentToken(): Promise<string | null> {
  // 서버 환경
  if (typeof window === "undefined") {
    return serverToken;
  }

  // 브라우저 환경
  try {
    // NextAuth 세션에서 토큰 시도
    const session = await getSession();
    if (session?.accessToken) {
      return session.accessToken;
    }
  } catch (error) {
    console.warn("NextAuth 세션 조회 실패:", error);
  }

  // Fallback: 로컬 스토리지
  return (
    localStorage.getItem("auth-token") || sessionStorage.getItem("auth-token")
  );
}
