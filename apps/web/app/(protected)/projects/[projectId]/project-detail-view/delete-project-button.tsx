"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Icon,
} from "@triad/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteProject } from "@/lib/api/projects";

/**
 * 프로젝트 삭제 버튼 컴포넌트
 * AlertDialog를 사용하여 삭제 확인 후 프로젝트를 삭제합니다
 *
 * @param projectId - 삭제할 프로젝트 ID
 * @param projectName - 프로젝트 이름 (확인 메시지에 표시)
 */

interface DeleteProjectButtonProps {
  projectId: string;
  projectName: string;
}

export function DeleteProjectButton({
  projectId,
  projectName,
}: DeleteProjectButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // 프로젝트 삭제 mutation
  const { mutate: handleDelete, isPending } = useMutation({
    mutationKey: ["projects", "delete", projectId],
    mutationFn: () => deleteProject(projectId),
    onSuccess: () => {
      // 프로젝트 목록 쿼리 무효화 (대시보드 자동 갱신)
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      // 대시보드로 리디렉션
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      console.error("프로젝트 삭제 실패:", error);
      // TODO: 에러 토스트 메시지 표시
    },
  });

  const handleConfirmDelete = () => {
    handleDelete();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Icon.Trash2 className="mr-2 h-4 w-4" />
          프로젝트 삭제
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>프로젝트를 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-bold">&quot;{projectName}&quot;</span>{" "}
            프로젝트를 삭제하시겠습니까?
            <br />이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "삭제 중..." : "삭제"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
