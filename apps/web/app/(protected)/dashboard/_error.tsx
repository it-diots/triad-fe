"use client";

import { Button } from "@triad/ui";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <p className="font-mono text-2xl text-white">Error: {error.message}</p>

      <Button variant="secondary" size="lg" onClick={reset}>
        Reset
      </Button>
    </div>
  );
}
