"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Icon,
  Input,
  Separator,
  Switch,
  Textarea,
} from "@triad/ui";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { queryKeys } from "@/constants/query-keys";
import { getProjectById, updateProject } from "@/lib/api/projects";
import type { ProjectWithOwner, UpdateProjectRequest } from "@/schemas/project";
import { UpdateProjectRequestSchema } from "@/schemas/project";
import { formatDate } from "@/utils/date";

import { DeleteProjectButton } from "./delete-project-button";

/**
 * 프로젝트 상세 정보 표시 컴포넌트
 * 프로젝트의 모든 정보를 카드 형식으로 표시하고 삭제 버튼을 포함합니다
 * 향후 수정 기능 추가를 고려하여 구조화되어 있습니다
 *
 * @param projectId - 조회할 프로젝트 ID
 * @param initialData - 서버에서 가져온 초기 프로젝트 데이터
 */

interface ProjectDetailViewProps {
  projectId: string;
  initialData: ProjectWithOwner;
}

export function ProjectDetailView({
  projectId,
  initialData,
}: ProjectDetailViewProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // 프로젝트 데이터 조회 (초기 데이터 사용)
  const { data: project } = useQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: () => getProjectById(projectId),
    initialData,
  });

  // React Hook Form 초기화
  const form = useForm<UpdateProjectRequest>({
    resolver: zodResolver(UpdateProjectRequestSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      url: project.url,
      domain: project.domain,
      isPublic: project.isPublic,
      settings: {
        allowComments: project.settings.allowComments,
        allowGuests: project.settings.allowGuests,
        maxParticipants: project.settings.maxParticipants || 10,
        isPublic: project.settings.isPublic,
      },
    },
  });

  // 프로젝트 수정 mutation
  const { mutate: handleUpdate, isPending } = useMutation({
    mutationKey: ["projects", "update", projectId],
    mutationFn: (data: UpdateProjectRequest) => updateProject(projectId, data),
    onSuccess: () => {
      // 상세 페이지와 목록 데이터 동시 갱신
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(projectId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() });
      setIsEditing(false); // 읽기 전용 모드로 전환
    },
    onError: (error: Error) => {
      console.error("프로젝트 수정 실패:", error);
      // TODO: 에러 토스트 메시지 표시
    },
  });

  // 폼 제출 핸들러
  const onSubmit = (data: UpdateProjectRequest) => {
    handleUpdate(data);
  };

  // 취소 핸들러
  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  // 수정 모드가 아닐 때 (읽기 전용 모드)
  if (!isEditing) {
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

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Icon.Pencil className="mr-2 h-4 w-4" />
                  수정
                </Button>
                <DeleteProjectButton
                  projectId={project.id}
                  projectName={project.name}
                />
              </div>
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
                    <dt className="text-muted-foreground text-sm">
                      설정 공개:
                    </dt>
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

  // 수정 모드일 때
  return (
    <div className="container mx-auto h-screen max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">프로젝트 수정</CardTitle>
          <CardDescription>프로젝트 정보를 수정합니다</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 프로젝트 이름 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>프로젝트 이름 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="프로젝트 이름을 입력하세요"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 프로젝트 설명 */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>프로젝트 설명</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="프로젝트에 대한 설명을 입력하세요"
                        className="resize-none"
                        rows={3}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      프로젝트의 목적과 내용을 간단히 설명해주세요 (선택)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 도메인 */}
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>도메인 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example.com"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      프로젝트와 연관된 도메인을 입력하세요
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 프로젝트 URL */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>프로젝트 URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        type="url"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      프로젝트 웹사이트 URL (선택)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 프로젝트 공개 여부 */}
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">공개 프로젝트</FormLabel>
                      <FormDescription>
                        프로젝트를 다른 사용자에게 공개합니다
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* 프로젝트 설정 섹션 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">프로젝트 설정</h3>

                {/* 코멘트 허용 */}
                <FormField
                  control={form.control}
                  name="settings.allowComments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">코멘트 허용</FormLabel>
                        <FormDescription>
                          프로젝트에 코멘트를 남길 수 있도록 허용합니다
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* 게스트 허용 */}
                <FormField
                  control={form.control}
                  name="settings.allowGuests"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">게스트 허용</FormLabel>
                        <FormDescription>
                          로그인하지 않은 사용자의 접근을 허용합니다
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* 최대 참여자 수 */}
                <FormField
                  control={form.control}
                  name="settings.maxParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>최대 참여자 수 *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormDescription>
                        프로젝트에 참여할 수 있는 최대 인원 (1-100명)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 설정 공개 여부 */}
                <FormField
                  control={form.control}
                  name="settings.isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">설정 공개</FormLabel>
                        <FormDescription>
                          프로젝트 설정을 다른 사용자에게 공개합니다
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* 버튼 영역 */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="min-w-[120px]"
                >
                  {isPending ? "저장 중..." : "저장"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
