"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { queryKeys } from "@/constants/query-keys";
import { getProjects } from "@/lib/api/projects";
import type { ProjectListResponse } from "@/schemas/project";

import { CreateProject } from "../create-project";
import { ProjectCardItem } from "./project-card-item";

/**
 * 프로젝트 목록 컴포넌트
 * 서버에서 받은 초기 데이터와 클라이언트 상태 관리를 통합
 *
 * @param initialData - 서버에서 조회한 초기 프로젝트 목록 데이터
 */

interface ProjectListProps {
  initialData: ProjectListResponse;
}

export function ProjectList({ initialData }: ProjectListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL에서 페이지 정보 추출
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  // TanStack Query로 프로젝트 목록 조회
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: queryKeys.projects.list({ page: currentPage, limit }),
    queryFn: () => getProjects({ page: currentPage, limit }),
    initialData,
    placeholderData: keepPreviousData,
  });

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    params.set("limit", limit.toString());
    const url = `${pathname}?${params.toString()}`;
    router.push(url as Route);
  };

  const totalPages = data?.total || 1;
  const hasNext = currentPage < totalPages;
  const hasPrevious = currentPage > 1;

  return (
    <div className="bg-card flex flex-col gap-4 rounded-xl p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <b className="text-lg font-bold">Projects</b>
        <CreateProject />
      </div>

      {/* 프로젝트 목록 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">로딩 중...</p>
        </div>
      ) : data?.projects.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">
            프로젝트가 없습니다. 새로운 프로젝트를 생성해보세요!
          </p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-2 gap-4 ${isPlaceholderData ? "opacity-50" : ""}`}
        >
          {data?.projects.map((project) => (
            <ProjectCardItem
              key={project.id}
              project={project}
              isDeleted={!!project.deletedAt}
            />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {data && data.projects.length > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-muted-foreground text-sm">
            총 {data.total}개의 프로젝트
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrevious || isPlaceholderData}
              className="text-primary hover:bg-accent disabled:text-muted-foreground rounded-md px-3 py-1 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              이전
            </button>

            <span className="text-muted-foreground px-2 text-sm">
              {currentPage}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext || isPlaceholderData}
              className="text-primary hover:bg-accent disabled:text-muted-foreground rounded-md px-3 py-1 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
