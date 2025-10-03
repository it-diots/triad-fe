import {
  type ProjectListResponse,
  ProjectListResponseSchema,
} from "@/schemas/project";
import { API_ENDPOINTS, apiClient } from "@/utils/api-client";

export interface GetProjectsParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * 프로젝트 목록 조회 API 함수
 * 서버 컴포넌트와 클라이언트 컴포넌트 모두에서 사용 가능
 *
 * @param params - 조회 파라미터 (page, limit, search)
 * @returns 프로젝트 목록 및 페이지네이션 메타데이터
 *
 * @example
 * ```typescript
 * // 서버 컴포넌트
 * const data = await getProjects({ page: 1, limit: 20 });
 *
 * // 클라이언트 컴포넌트 (TanStack Query와 함께)
 * const { data } = useQuery({
 *   queryKey: ['projects', params],
 *   queryFn: () => getProjects(params)
 * });
 * ```
 */
export async function getProjects(
  params: GetProjectsParams = {}
): Promise<ProjectListResponse> {
  const { page = 1, limit = 20, search = "" } = params;

  // URL 쿼리 파라미터 구성
  const searchParams = new URLSearchParams();
  searchParams.set("page", page.toString());
  searchParams.set("limit", limit.toString());
  if (search) {
    searchParams.set("search", search);
  }

  // API 호출
  const url = `${API_ENDPOINTS.PROJECTS.LIST}?${searchParams.toString()}`;
  const response = await apiClient.get(url);

  // 응답 데이터 검증
  const data = await response.json();
  return ProjectListResponseSchema.parse(data);
}
