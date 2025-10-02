import { auth } from "@/auth";

import Navigation from "./navigation";

/**
 * 서버 컴포넌트 래퍼
 * NextAuth 세션을 확인하여 초기 인증 상태를 Header에 전달
 *
 * - 새로고침 시 서버에서 인증 상태를 확인하고 초기값으로 전달
 */
export default async function Header() {
  const session = await auth();
  const isAuthenticated = !!session?.accessToken;

  return <Navigation initialIsAuthenticated={isAuthenticated} />;
}
