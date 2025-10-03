"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@triad/ui";

import { CreateProjectForm } from "./create-project-form";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
}: CreateProjectModalProps) {
  const handleSuccess = () => {
    // 프로젝트 생성 성공 시 모달 닫기
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>새 프로젝트 만들기</DialogTitle>
          <DialogDescription>
            프로젝트 정보를 입력하고 새로운 프로젝트를 생성하세요
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
