"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
  Textarea,
} from "@triad/ui";
import { useForm } from "react-hook-form";

import { queryKeys } from "@/constants/query-keys";
import { createProject } from "@/lib/api/projects";
import type { CreateProjectRequest } from "@/schemas/project";
import { CreateProjectRequestSchema } from "@/schemas/project";

/**
 * 프로젝트 생성 커스텀 훅
 * TanStack Query useMutation을 사용하여 서버 상태 관리
 */
function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["projects", "create"],
    mutationFn: createProject,
    onSuccess: () => {
      // 프로젝트 목록 쿼리 무효화 (자동 재조회)
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() });
    },
  });
}

/**
 * 프로젝트 생성 폼 컴포넌트
 * React Hook Form과 Zod를 사용한 유효성 검사
 * TanStack Query를 사용한 API 호출
 *
 * @param onSuccess - 프로젝트 생성 성공 시 콜백
 */

interface CreateProjectFormProps {
  onSuccess?: () => void;
}

export function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const { mutate, isPending } = useCreateProject();

  // React Hook Form 초기화
  const form = useForm<CreateProjectRequest>({
    resolver: zodResolver(CreateProjectRequestSchema),
    defaultValues: {
      name: "",
      description: null,
      url: null,
      domain: "",
      isPublic: false,
      settings: {
        allowComments: true,
        allowGuests: false,
        maxParticipants: 10,
        isPublic: false,
      },
    },
  });

  // 폼 제출 핸들러
  const onSubmit = (data: CreateProjectRequest) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
      onError: (error: Error) => {
        console.error("프로젝트 생성 실패:", error);
        // TODO: 에러 토스트 메시지 표시
      },
    });
  };

  return (
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
              <FormDescription>프로젝트 웹사이트 URL (선택)</FormDescription>
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
                    onChange={(e) => field.onChange(Number(e.target.value))}
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

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? "생성 중..." : "프로젝트 생성"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
