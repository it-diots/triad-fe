import type { ProjectWithOwner } from "@/schemas/project";

import { ProjectCard } from "./project-card";

interface ProjectGridProps {
  projects: ProjectWithOwner[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground text-sm">
          프로젝트가 없습니다. 새 프로젝트를 만들어보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
