import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
  Separator,
} from "@triad/ui";

import type { ProjectWithOwner } from "@/schemas/project";
import { formatDate } from "@/utils/date";

import { DeleteProjectButton } from "./delete-project-button";

/**
 * 프로젝트 상세 정보 표시 컴포넌트
 * 프로젝트의 모든 정보를 카드 형식으로 표시하고 삭제 버튼을 포함합니다
 * 향후 수정 기능 추가를 고려하여 구조화되어 있습니다
 *
 * @param project - 표시할 프로젝트 데이터
 */

interface ProjectDetailViewProps {
  project: ProjectWithOwner;
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  return (
    <div className="container mx-auto h-screen max-w-4xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="mb-2 flex items-center gap-3 text-3xl">
                {project.name}
                {project.isPublic ? (
                  <Badge variant="default">공개</Badge>
                ) : (
                  <Badge variant="secondary">비공개</Badge>
                )}
              </CardTitle>

              <CardDescription className="text-base">
                {project.description || "설명이 없습니다."}
              </CardDescription>
            </div>

            <DeleteProjectButton
              projectId={project.id}
              projectName={project.name}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={project.owner.avatar || undefined} />
              <AvatarFallback>{project.owner.username}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {project.owner.username}
              </span>
              <span className="text-muted-foreground text-xs">
                프로젝트 소유자
              </span>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div className="grid gap-6">
            {/* 기본 정보 */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">기본 정보</h3>
              <dl className="grid gap-3">
                <div className="flex items-center gap-2">
                  <Icon.Globe className="text-muted-foreground h-4 w-4" />
                  <dt className="text-muted-foreground text-sm">도메인:</dt>
                  <dd className="font-medium">{project.domain}</dd>
                </div>

                {project.url && (
                  <div className="flex items-center gap-2">
                    <Icon.Link className="text-muted-foreground h-4 w-4" />
                    <dt className="text-muted-foreground text-sm">URL:</dt>
                    <dd>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {project.url}
                      </a>
                    </dd>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Icon.Calendar className="text-muted-foreground h-4 w-4" />
                  <dt className="text-muted-foreground text-sm">생성일:</dt>
                  <dd className="font-medium">
                    {formatDate(project.createdAt)}
                  </dd>
                </div>

                <div className="flex items-center gap-2">
                  <Icon.CalendarClock className="text-muted-foreground h-4 w-4" />
                  <dt className="text-muted-foreground text-sm">수정일:</dt>
                  <dd className="font-medium">
                    {formatDate(project.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>

            <Separator />

            {/* 프로젝트 설정 */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">프로젝트 설정</h3>
              <dl className="grid gap-3">
                <div className="flex items-center gap-2">
                  <Icon.MessageSquare className="text-muted-foreground h-4 w-4" />
                  <dt className="text-muted-foreground text-sm">코멘트:</dt>
                  <dd className="font-medium">
                    {project.settings.allowComments ? (
                      <Badge variant="default">허용</Badge>
                    ) : (
                      <Badge variant="secondary">불가</Badge>
                    )}
                  </dd>
                </div>

                <div className="flex items-center gap-2">
                  <Icon.Users className="text-muted-foreground h-4 w-4" />
                  <dt className="text-muted-foreground text-sm">게스트:</dt>
                  <dd className="font-medium">
                    {project.settings.allowGuests ? (
                      <Badge variant="default">허용</Badge>
                    ) : (
                      <Badge variant="secondary">불가</Badge>
                    )}
                  </dd>
                </div>

                {project.settings.maxParticipants && (
                  <div className="flex items-center gap-2">
                    <Icon.UserPlus className="text-muted-foreground h-4 w-4" />
                    <dt className="text-muted-foreground text-sm">
                      최대 참여자 수:
                    </dt>
                    <dd className="font-medium">
                      {project.settings.maxParticipants}명
                    </dd>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Icon.Eye className="text-muted-foreground h-4 w-4" />
                  <dt className="text-muted-foreground text-sm">설정 공개:</dt>
                  <dd className="font-medium">
                    {project.settings.isPublic ? (
                      <Badge variant="default">공개</Badge>
                    ) : (
                      <Badge variant="secondary">비공개</Badge>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
