"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

import { useCreateProject } from "@/hooks/use-create-project";
import {
  type CreateProjectRequest,
  CreateProjectRequestSchema,
} from "@/schemas/project";

interface CreateProjectFormProps {
  onSuccess?: () => void;
}

export function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const { mutate, isPending } = useCreateProject();

  const form = useForm<CreateProjectRequest>({
    resolver: zodResolver(CreateProjectRequestSchema),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      domain: "",
      isPublic: false,
      settings: {
        allowComments: true,
        allowGuests: true,
        maxParticipants: 10,
        isPublic: true,
      },
    },
  });

  const onSubmit = (data: CreateProjectRequest) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
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
                <Input placeholder="프로젝트 이름을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 설명 */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="프로젝트에 대한 설명을 입력하세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* URL */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
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
              <FormLabel>도메인</FormLabel>
              <FormControl>
                <Input placeholder="example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 공개 프로젝트 */}
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">공개 프로젝트</FormLabel>
                <FormDescription>
                  프로젝트를 모든 사용자에게 공개합니다
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 설정: 댓글 허용 */}
        <FormField
          control={form.control}
          name="settings.allowComments"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">댓글 허용</FormLabel>
                <FormDescription>
                  프로젝트에 댓글을 작성할 수 있습니다
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 설정: 게스트 허용 */}
        <FormField
          control={form.control}
          name="settings.allowGuests"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">게스트 허용</FormLabel>
                <FormDescription>
                  비회원도 프로젝트에 참여할 수 있습니다
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 설정: 최대 참여자 수 */}
        <FormField
          control={form.control}
          name="settings.maxParticipants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>최대 참여자 수</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 설정: 공개 설정 */}
        <FormField
          control={form.control}
          name="settings.isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">설정 공개</FormLabel>
                <FormDescription>
                  프로젝트 설정을 모든 사용자에게 공개합니다
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "생성 중..." : "프로젝트 생성"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
