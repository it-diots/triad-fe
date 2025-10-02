"use client";

import { Button } from "@triad/ui";
import { useState } from "react";

interface ConnectionActionButtonProps {
  initialConnected: boolean;
}

export function ProjectsActionButton({
  initialConnected,
}: ConnectionActionButtonProps) {
  const [isConnected, setIsConnected] = useState(initialConnected);

  const handleToggle = () => {
    setIsConnected(!isConnected);
    console.log(isConnected ? "Disconnected" : "Connected");
  };

  return (
    <Button
      variant={isConnected ? "outline" : "default"}
      size="sm"
      onClick={handleToggle}
    >
      {isConnected ? "Disconnect" : "Connect"}
    </Button>
  );
}
