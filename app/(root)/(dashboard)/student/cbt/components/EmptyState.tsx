"use client";

import { GraduationCap } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No Available Exams",
  description = "There are currently no examinations available for you. Once your teacher publishes an exam, it will appear here.",
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <GraduationCap className="h-8 w-8 text-muted-foreground" />
      </div>

      <h2 className="mt-5 text-xl font-semibold">{title}</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
