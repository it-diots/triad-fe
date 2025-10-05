"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@triad/ui";

import { CreateProjectForm } from "./create-project-form";

/**
 * 프로젝트 생성 모달 컴포넌트
 * Dialog UI를 제공하고 폼 컴포넌트를 렌더링
 *
 * @param open - 모달 열림 상태
 * @param onOpenChange - 모달 상태 변경 핸들러
 */

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
}: CreateProjectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden p-0">
        <div className="flex max-h-[90vh] flex-col">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>새 프로젝트 생성</DialogTitle>
            <DialogDescription>
              프로젝트 정보를 입력하여 새로운 프로젝트를 생성합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto px-6 pb-6">
            <CreateProjectForm onSuccess={() => onOpenChange(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
