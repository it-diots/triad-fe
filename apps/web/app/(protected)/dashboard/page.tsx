import { auth } from "@/auth";

import { Dashboard } from "./dashboard";

/**
 * 사용자 대시보드 페이지
 * 인증된 사용자만 접근 가능한 보호된 페이지
 */
export default async function DashboardPage() {
  const session = await auth();

  // 에러 페이지 테스트
  // throw new Error("test");
  return <Dashboard session={session} />;
}
