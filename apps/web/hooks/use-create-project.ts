import { useMutation, useQueryClient } from "@triad/shared";

import type { CreateProjectRequest, Project } from "@/schemas/project";
import { CreateProjectRequestSchema, ProjectSchema } from "@/schemas/project";
import { API_ENDPOINTS, apiClient } from "@/utils/api-client";

/**
 * 프로젝트 생성 mutation hook
 *
 * @example
 * ```tsx
 * const { mutate, isPending, error } = useCreateProject();
 *
 * const onSubmit = (data: CreateProjectRequest) => {
 *   mutate(data);
 * };
 * ```
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["projects", "create"],
    mutationFn: async (newProject: CreateProjectRequest): Promise<Project> => {
      // 요청 데이터 검증
      const validatedData = CreateProjectRequestSchema.parse(newProject);

      // API 호출
      const response = await apiClient.post(API_ENDPOINTS.PROJECTS.CREATE, {
        json: validatedData,
      });

      // 응답 데이터 검증
      const data = await response.json();
      return ProjectSchema.parse(data);
    },
    onSuccess: () => {
      // 프로젝트 목록 쿼리 무효화하여 자동 갱신
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
