/**
 * 프로젝트 관련 API 함수
 * 서버 컴포넌트와 클라이언트 컴포넌트 모두에서 사용 가능
 */

import type {
  CreateProjectRequest,
  GetProjectsParams,
  Project,
  ProjectListResponse,
  ProjectWithOwner,
} from "@/schemas/project";
import {
  CreateProjectRequestSchema,
  GetProjectsParamsSchema,
  ProjectListResponseSchema,
  ProjectSchema,
  ProjectWithOwnerSchema,
} from "@/schemas/project";
import { API_ENDPOINTS, apiClient } from "@/utils/api-client";

/**
 * 프로젝트 목록 조회 API 함수
 * 페이지네이션 및 검색 기능 지원
 *
 * @param params - 조회 옵션 (페이지, 검색어 등)
 * @returns 프로젝트 목록과 메타데이터
 *
 * @example
 * ```typescript
 * // 서버 컴포넌트에서 직접 호출
 * const projects = await getProjects({ page: 1, limit: 10 });
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
  // 파라미터 검증
  const validatedParams = GetProjectsParamsSchema.parse(params);

  // API 호출
  const response = await apiClient.get(API_ENDPOINTS.PROJECTS.LIST, {
    searchParams: validatedParams as Record<string, string | number | boolean>,
  });

  // 응답 데이터 검증
  const data = await response.json();

  return ProjectListResponseSchema.parse(data);
}

/**
 * 프로젝트 상세 조회 API 함수
 * 특정 프로젝트의 상세 정보를 조회합니다
 *
 * @param id - 조회할 프로젝트 ID
 * @returns 프로젝트 상세 정보
 *
 * @example
 * ```typescript
 * // 서버 컴포넌트에서 직접 호출
 * const project = await getProjectById('project-id');
 *
 * // 클라이언트 컴포넌트 (TanStack Query와 함께)
 * const { data } = useQuery({
 *   queryKey: ['projects', id],
 *   queryFn: () => getProjectById(id)
 * });
 * ```
 */
export async function getProjectById(id: string): Promise<ProjectWithOwner> {
  // API 호출
  const response = await apiClient.get(API_ENDPOINTS.PROJECTS.BY_ID(id));

  // 응답 데이터 검증
  const data = await response.json();
  return ProjectWithOwnerSchema.parse(data);
}

/**
 * 프로젝트 생성 API 함수
 * 서버 컴포넌트와 클라이언트 컴포넌트 모두에서 사용 가능
 *
 * @param newProject - 생성할 프로젝트 정보
 * @returns 생성된 프로젝트 데이터
 *
 * @example
 * ```typescript
 * // 클라이언트 컴포넌트 (TanStack Query와 함께)
 * const { mutate } = useMutation({
 *   mutationFn: createProject,
 *   onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
 * });
 *
 * mutate({
 *   name: '새 프로젝트',
 *   domain: 'example.com',
 *   isPublic: true,
 *   settings: {
 *     allowComments: true,
 *     allowGuests: false,
 *     maxParticipants: 10,
 *     isPublic: true
 *   }
 * });
 * ```
 */
export async function createProject(
  newProject: CreateProjectRequest
): Promise<Project> {
  // 요청 데이터 검증
  const validatedData = CreateProjectRequestSchema.parse(newProject);

  // API 호출
  const response = await apiClient.post(API_ENDPOINTS.PROJECTS.CREATE, {
    json: validatedData,
  });

  // 응답 데이터 검증
  const data = await response.json();
  return ProjectSchema.parse(data);
}

/**
 * 프로젝트 삭제 API 함수
 * 특정 프로젝트를 삭제합니다 (소프트 삭제)
 *
 * @param id - 삭제할 프로젝트 ID
 * @returns void
 *
 * @example
 * ```typescript
 * // 클라이언트 컴포넌트 (TanStack Query와 함께)
 * const { mutate } = useMutation({
 *   mutationFn: deleteProject,
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: ['projects'] });
 *     router.push('/dashboard');
 *   }
 * });
 *
 * mutate('project-id');
 * ```
 */
export async function deleteProject(id: string): Promise<void> {
  // API 호출
  await apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
}
