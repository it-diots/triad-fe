/**
 * NextAuth 세션과 연동하는 인증 어댑터
 */

import { getSession } from "next-auth/react";

/**
 * 현재 환경이 브라우저인지 확인
 */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * NextAuth 세션에서 액세스 토큰을 가져오는 함수
 */
export async function getAccessTokenFromSession(): Promise<string | null> {
  // 서버 환경에서는 세션을 가져올 수 없음
  if (!isBrowser()) {
    return null;
  }

  try {
    const session = await getSession();
    return session?.accessToken || null;
  } catch (error) {
    console.error("세션에서 토큰 가져오기 실패:", error);
    return null;
  }
}

/**
 * 토큰 관리 전략
 * 1. NextAuth 세션 (우선순위)
 * 2. localStorage/sessionStorage (fallback)
 */
export async function getAuthToken(): Promise<string | null> {
  // NextAuth 세션에서 토큰 시도
  const sessionToken = await getAccessTokenFromSession();
  if (sessionToken) {
    return sessionToken;
  }

  // Fallback: localStorage/sessionStorage
  if (isBrowser()) {
    return (
      localStorage.getItem("auth-token") ||
      sessionStorage.getItem("auth-token")
    );
  }

  return null;
}

/**
 * 서버 환경에서 사용할 토큰 주입 함수
 * API 라우트에서 헤더로 전달받은 토큰을 사용
 */
let serverToken: string | null = null;

export function setServerToken(token: string | null) {
  serverToken = token;
}

export function getServerToken(): string | null {
  return serverToken;
}

/**
 * 환경에 따른 토큰 가져오기
 */
export async function getEnvironmentToken(): Promise<string | null> {
  if (!isBrowser()) {
    return getServerToken();
  }

  return await getAuthToken();
}