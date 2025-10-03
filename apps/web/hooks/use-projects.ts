import { useQuery } from "@triad/shared";

import { getProjects, type GetProjectsParams } from "@/lib/api/projects";
import type { ProjectListResponse } from "@/schemas/project";

interface UseProjectsOptions extends GetProjectsParams {
  initialData?: ProjectListResponse;
}

/**
 * 프로젝트 목록 조회 query hook
 *
 * @param options - 조회 옵션 (page, limit, search, initialData)
 * @returns TanStack Query 결과
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useProjects({
 *   page: 1,
 *   limit: 20,
 *   search: '검색어',
 *   initialData: serverData
 * });
 * ```
 */
export function useProjects({
  page = 1,
  limit = 20,
  search = "",
  initialData,
}: UseProjectsOptions = {}) {
  return useQuery({
    queryKey: ["projects", { page, limit, search }],
    queryFn: () => getProjects({ page, limit, search }),
    initialData,
    // 이전 데이터를 placeholder로 유지하여 매끄러운 전환
    placeholderData: (previousData) => previousData,
  });
}
