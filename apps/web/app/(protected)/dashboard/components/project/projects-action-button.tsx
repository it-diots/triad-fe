"use client";

import { Button, Icon } from "@triad/ui";

interface AddProjectButtonProps {}

export function AddProjectButton({}: AddProjectButtonProps) {
  const createProject = () => {
    // 로직 추가
    window.alert("프로젝트 추가");
  };

  return (
    <Button variant="outline" size="sm" onClick={createProject}>
      <Icon.Plus className="mr-2 h-4 w-4" />
      프로젝트 추가
    </Button>
  );
}
