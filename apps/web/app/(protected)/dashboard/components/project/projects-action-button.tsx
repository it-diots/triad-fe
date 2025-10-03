"use client";

import { Button, Icon } from "@triad/ui";
import { useState } from "react";

import { CreateProjectModal } from "./create-project-modal";

interface AddProjectButtonProps {}

export function AddProjectButton({}: AddProjectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Icon.Plus className="mr-2 h-4 w-4" />
        프로젝트 추가
      </Button>

      <CreateProjectModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
