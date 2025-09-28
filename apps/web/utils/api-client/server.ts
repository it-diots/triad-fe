/**
 * 서버 컴포넌트용 API 클라이언트 유틸리티
 * NextAuth 세션과 연동하여 자동으로 인증 토큰을 설정합니다.
 */

import { auth } from "@/auth";
import { apiClient } from "@/utils/api-client";
import { setServerToken } from "@/utils/api-client/auth-adapter";

/**
 * 서버 환경에서 사용할 인증된 API 클라이언트를 생성합니다.
 * NextAuth 세션에서 토큰을 자동으로 추출하여 API 클라이언트에 설정합니다.
 *
 * @returns 인증 토큰이 설정된 API 클라이언트
 *
 * @example
 * ```typescript
 * // 서버 컴포넌트에서 사용
 * export default async function UserPage() {
 *   const serverApi = await createServerApiClient();
 *   const userData = await serverApi.get(API_ENDPOINTS.AUTH.PROFILE).json();
 *
 *   return <div>{userData.name}</div>;
 * }
 *
 * // API 라우트에서 사용
 * export async function GET() {
 *   const serverApi = await createServerApiClient();
 *   const users = await serverApi.get(API_ENDPOINTS.USERS.LIST).json();
 *
 *   return Response.json(users);
 * }
 * ```
 */
export async function createServerApiClient() {
  const session = await auth();

  if (session?.accessToken) {
    setServerToken(session.accessToken);
  }

  return apiClient;
}

/**
 * 서버 환경에서 인증 상태와 함께 API 클라이언트를 제공합니다.
 * 인증 상태 확인이 필요한 경우 사용하세요.
 *
 * @returns API 클라이언트, 세션 정보, 인증 상태를 포함한 객체
 *
 * @example
 * ```typescript
 * export default async function ProtectedPage() {
 *   const { apiClient, session, isAuthenticated } = await createServerApiWithAuth();
 *
 *   if (!isAuthenticated) {
 *     return <div>로그인이 필요합니다</div>;
 *   }
 *
 *   const userData = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE).json();
 *   return <div>안녕하세요, {userData.name}님!</div>;
 * }
 * ```
 */
export async function createServerApiWithAuth() {
  const session = await auth();

  if (session?.accessToken) {
    setServerToken(session.accessToken);
  }

  return {
    apiClient,
    session,
    isAuthenticated: !!session?.accessToken,
    user: session?.user || null,
  };
}