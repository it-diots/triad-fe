"use client";

import { Button, Icon } from "@triad/ui";

import type { ProjectListResponse } from "@/schemas/project";

interface PaginationProps {
  meta: ProjectListResponse;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages } = meta;

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="flex items-center justify-between">
      <div className="text-muted-foreground text-sm">
        페이지 {page} / {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoPrevious}
        >
          <Icon.ChevronLeft className="h-4 w-4" />
          이전
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext}
        >
          다음
          <Icon.ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
