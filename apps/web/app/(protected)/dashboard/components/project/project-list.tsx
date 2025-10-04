"use client";

import { useQuery } from "@triad/shared";
import { Button, Input } from "@triad/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { getProjects } from "@/lib/api/projects";
import type { ProjectListResponse } from "@/schemas/project";

import { Pagination } from "./pagination";
import { ProjectGrid } from "./project-grid";
import { AddProjectButton } from "./projects-action-button";

function useProjects({
  page = 1,
  limit = 20,
  search = "",
  initialData,
}: {
  page?: number;
  limit?: number;
  search?: string;
  initialData?: ProjectListResponse;
} = {}) {
  return useQuery({
    queryKey: ["projects", { page, limit, search }],
    queryFn: () => getProjects({ page, limit, search }),
    initialData,
    placeholderData: (previousData) => previousData,
  });
}

interface ProjectListProps {
  initialData?: ProjectListResponse;
}

export function ProjectList({ initialData }: ProjectListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터에서 상태 읽기
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const searchQuery = searchParams.get("search") || "";

  // 로컬 검색 입력 상태
  const [searchInput, setSearchInput] = useState(searchQuery);

  // 프로젝트 목록 조회
  const { data, isLoading, isError } = useProjects({
    page,
    limit,
    search: searchQuery,
    initialData,
  });

  // URL 업데이트 함수
  const updateURL = useCallback(
    (params: Record<string, string | number>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          current.set(key, String(value));
        } else {
          current.delete(key);
        }
      });

      router.push(`?${current.toString()}`);
    },
    [router, searchParams]
  );

  // 검색 적용
  const handleApplySearch = () => {
    updateURL({ page: 1, limit, search: searchInput });
  };

  // 검색 초기화
  const handleResetSearch = () => {
    setSearchInput("");
    updateURL({ page: 1, limit, search: "" });
  };

  // Enter 키로 검색 적용
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplySearch();
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    updateURL({ page: newPage });
  };

  if (isError) {
    return (
      <div className="bg-card flex flex-col gap-4 rounded-xl p-6">
        <div className="text-destructive flex items-center justify-center py-8 text-sm">
          프로젝트를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card flex flex-col gap-4 rounded-xl p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <b className="text-lg font-bold">Projects</b>
        <AddProjectButton />
      </div>

      {/* 검색 */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="프로젝트 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="max-w-sm"
        />
        <Button size="sm" onClick={handleApplySearch}>
          적용
        </Button>
        {searchQuery && (
          <Button size="sm" variant="outline" onClick={handleResetSearch}>
            초기화
          </Button>
        )}
      </div>

      {/* 프로젝트 그리드 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground text-sm">로딩 중...</p>
        </div>
      ) : (
        <ProjectGrid projects={data?.projects || []} />
      )}

      {/* 페이지네이션 */}
      {data && data.totalPages > 1 && (
        <Pagination meta={data} onPageChange={handlePageChange} />
      )}
    </div>
  );
}
