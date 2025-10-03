import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Icon,
  Separator,
} from "@triad/ui";

import type { ProjectWithOwner } from "@/schemas/project";
import { formatDate } from "@/utils/date";

interface ProjectCardProps {
  project: ProjectWithOwner;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isDeleted = project.deletedAt !== null;

  return (
    <Card
      className={cn("relative cursor-pointer gap-4 p-0", {
        "cursor-not-allowed": isDeleted,
      })}
    >
      <CardHeader className="flex flex-col gap-4 p-4 pb-0">
        <CardTitle className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Icon.ClockPlus className="h-4 w-4" />
            <span className="text-sm">{formatDate(project.createdAt)}</span>
          </div>
          <p>{project.name}</p>
        </CardTitle>

        <CardDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={project.owner.avatar ?? undefined} />
              <AvatarFallback>{project.owner.username}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold">{project.owner.username}</span>
          </div>
          <p>{project.description}</p>
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="p-4 pt-0">
        <ul className="flex flex-col gap-2">
          <li className="flex items-center gap-2">
            <Icon.RectangleEllipsis className="h-4 w-4" />
            <span className="text-sm font-medium">
              <b className="text-sm font-bold">
                {project.settings.isPublic ? "공개" : "비공개"}
              </b>
              &nbsp;프로젝트
            </span>
          </li>

          <li className="flex items-center gap-2">
            <Icon.RectangleEllipsis className="h-4 w-4" />
            <span className="text-sm font-medium">
              코멘트&nbsp;
              <b className="text-sm font-bold">
                {project.settings.allowComments ? "허용" : "불가"}
              </b>
            </span>
          </li>

          <li className="flex items-center gap-2">
            <Icon.RectangleEllipsis className="h-4 w-4" />
            <span className="text-sm font-medium">
              게스트&nbsp;
              <b className="text-sm font-bold">
                {project.settings.allowGuests ? "허용" : "불가"}
              </b>
            </span>
          </li>

          {project.settings.maxParticipants && (
            <li className="flex items-center gap-2">
              <Icon.RectangleEllipsis className="h-4 w-4" />
              <span className="text-sm font-medium">
                최대 참여자 수&nbsp;
                <b className="text-sm font-bold">
                  {project.settings.maxParticipants}명
                </b>
              </span>
            </li>
          )}
        </ul>
      </CardContent>

      {isDeleted && (
        <>
          <div className="absolute inset-0 z-10 h-full w-full bg-[rgba(255,255,255,0.93)] blur-sm" />
          <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center">
            <span className="text-sm">
              {formatDate(project.updatedAt)}에 삭제됨
            </span>
          </div>
        </>
      )}
    </Card>
  );
}
