"use client";

import { Button, Icon } from "@triad/ui";

export default function CreateProject() {
  const createProject = () => {
    window.alert("프로젝트 추가");
  };

  return (
    <Button variant="outline" size="sm">
      <Icon.Plus className="mr-2 h-4 w-4" onClick={createProject} />
      프로젝트 추가
    </Button>
  );
}
