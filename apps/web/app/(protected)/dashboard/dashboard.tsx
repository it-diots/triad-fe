import { Session } from "next-auth";

import { LatestActivityCard, ProjectCard, UserInfoCard } from "./components";

interface DashboardProps {
  session: Session | null;
}

export function Dashboard({ session }: DashboardProps) {
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
