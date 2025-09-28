/**
 * API 클라이언트 인증 토큰 관리
 * NextAuth 세션과 로컬 스토리지를 통한 토큰 제공
 */

import { getSession } from "next-auth/react";

/**
 * 서버 환경에서 사용할 토큰 (API 라우트용)
 */
let serverToken: string | null = null;

/**
 * 서버 환경에서 사용할 토큰 설정
 * API 라우트에서 NextAuth 세션 토큰을 전달할 때 사용
 *
 * @param token - 설정할 인증 토큰 (또는 null로 초기화)
 *
 * @example
 * ```typescript
 * import { setServerToken } from '@/utils/api-client/auth-adapter';
 *
 * // API 라우트에서 사용
 * export async function GET(request: Request) {
 *   const session = await getServerSession(authOptions);
 *
 *   if (session?.accessToken) {
 *     setServerToken(session.accessToken);
 *   }
 *
 *   // 이후 apiClient 사용 시 자동으로 토큰 주입됨
 *   const data = await apiClient.get('users').json();
 *
 *   return Response.json(data);
 * }
 * ```
 */
export function setServerToken(token: string | null) {
  serverToken = token;
}

/**
 * 환경에 따른 토큰 가져오기
 * 1. 서버: serverToken 사용
 * 2. 브라우저: NextAuth 세션 → localStorage → sessionStorage 순서
 *
 * @returns 현재 환경에서 사용 가능한 인증 토큰 (또는 null)
 *
 * @example
 * ```typescript
 * import { getEnvironmentToken } from '@/utils/api-client/auth-adapter';
 *
 * // 클라이언트 컴포넌트에서 사용
 * const token = await getEnvironmentToken();
 * if (token) {
 *   console.log('로그인 상태');
 * } else {
 *   console.log('비로그인 상태');
 * }
 *
 * // API 호출 전 수동 토큰 확인
 * async function makeAuthenticatedRequest() {
 *   const token = await getEnvironmentToken();
 *
 *   if (!token) {
 *     throw new Error('인증이 필요한 요청입니다.');
 *   }
 *
 *   return fetch('/api/protected', {
 *     headers: { Authorization: `Bearer ${token}` }
 *   });
 * }
 * ```
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
