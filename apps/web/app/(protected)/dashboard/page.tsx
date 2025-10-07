import { auth } from "@/auth";
import { getProjects } from "@/lib/api/projects";
import { setServerToken } from "@/utils/api-client/auth-adapter";

import LatestActivityCard from "./latest-activity-card";
import { ProjectList } from "./project/project-list";
import UserInfoCard from "./user-info-card";

/**
 * 사용자 대시보드 페이지
 * 인증된 사용자만 접근 가능한 보호된 페이지
 */

interface DashboardPageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const session = await auth();
  const params = await searchParams;

  // URL에서 페이지 정보 추출
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;

  // 서버 환경에서 API 호출을 위한 토큰 설정
  if (session?.accessToken) {
    setServerToken(session.accessToken);
  }

  try {
    // 서버에서 초기 프로젝트 목록 조회
    const initialProjectsData = await getProjects({ page, limit });

    return (
      <div className="grid h-screen grid-cols-[1fr_400px] grid-rows-[1fr_auto] gap-4">
        <div className="grid grid-cols-[300px_1fr] gap-4">
          <UserInfoCard session={session} />
          <ProjectList initialData={initialProjectsData} />
        </div>

        <LatestActivityCard />
      </div>
    );
  } finally {
    // API 호출 후 토큰 정리 (메모리 누수 방지)
    setServerToken(null);
  }
}
