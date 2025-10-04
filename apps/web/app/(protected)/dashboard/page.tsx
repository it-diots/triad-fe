import { auth } from "@/auth";
import { getProjects } from "@/lib/api/projects";
import { setServerToken } from "@/utils/api-client/auth-adapter";

import { LatestActivityCard, ProjectList, UserInfoCard } from "./components";

/**
 * 사용자 대시보드 페이지
 * 인증된 사용자만 접근 가능한 보호된 페이지
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
  const session = await auth();

  // Next.js 15에서 searchParams는 Promise
  const params = await searchParams;

  // 서버에서 초기 프로젝트 데이터 조회
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 20;
  const search = params.search || "";

  let initialProjectsData;
  try {
    // 서버 사이드에서 API 호출 시 인증 토큰 설정
    if (session?.accessToken) {
      setServerToken(session.accessToken);
    }

    initialProjectsData = await getProjects({ page, limit, search });
  } catch (error) {
    // 에러 발생 시 undefined로 설정하여 클라이언트에서 재시도
    console.error("Failed to fetch initial projects data:", error);
    initialProjectsData = undefined;
  } finally {
    // 보안을 위해 사용 후 토큰 초기화
    setServerToken(null);
  }

  return (
    <div className="grid h-full grid-cols-[1fr_400px] grid-rows-[1fr_auto] gap-4">
      <div className="grid grid-cols-[300px_1fr] gap-4">
        <UserInfoCard session={session} />
        <ProjectList initialData={initialProjectsData} />
      </div>

      <LatestActivityCard />
    </div>
  );
}
