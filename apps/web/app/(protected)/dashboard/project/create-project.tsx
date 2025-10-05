"use client";

import { Button, Icon } from "@triad/ui";
import { useState } from "react";

import { CreateProjectModal } from "./create-project-modal";

export default function CreateProject() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
        <Icon.Plus className="mr-2 h-4 w-4" />
        프로젝트 추가
      </Button>

      <CreateProjectModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
