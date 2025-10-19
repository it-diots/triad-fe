/**
 * TanStack Query 쿼리 키 팩토리
 * 타입 안전성과 일관성을 위해 모든 쿼리 키를 중앙에서 관리합니다
 *
 * @see https://tanstack.com/query/latest/docs/framework/react/community/lukemorales-query-key-factory
 */

import type { GetProjectsParams } from "@/schemas/project";

export const queryKeys = {
  /**
   * 프로젝트 관련 쿼리 키
   */
  projects: {
    /** 모든 프로젝트 쿼리의 루트 키 */
    all: ["projects"] as const,

    /** 프로젝트 목록 쿼리들의 공통 키 */
    lists: () => [...queryKeys.projects.all, "list"] as const,

    /** 특정 파라미터를 가진 프로젝트 목록 쿼리 키 */
    list: (params?: GetProjectsParams) =>
      [...queryKeys.projects.lists(), params] as const,

    /** 프로젝트 상세 쿼리들의 공통 키 */
    details: () => [...queryKeys.projects.all, "detail"] as const,

    /** 특정 프로젝트 상세 쿼리 키 */
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },
} as const;
