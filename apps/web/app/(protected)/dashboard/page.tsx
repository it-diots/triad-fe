import { auth } from "@/auth";

import LatestActivityCard from "./latest-activity-card";
import { ProjectCard } from "./project";
import UserInfoCard from "./user-info-card";

/**
 * 사용자 대시보드 페이지
 * 인증된 사용자만 접근 가능한 보호된 페이지
 */
export default async function DashboardPage() {
  const session = await auth();

  // 에러 페이지 테스트
  // throw new Error("test");
  return (
    <div className="grid h-full grid-cols-[1fr_400px] grid-rows-[1fr_auto] gap-4">
      <div className="grid grid-cols-[300px_1fr] gap-4">
        <UserInfoCard session={session} />
        <ProjectCard />
      </div>

      <LatestActivityCard />
    </div>
  );
}
