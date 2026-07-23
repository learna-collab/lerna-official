"use client";

import { ReactNode } from "react";

interface ExamListHeaderProps {
  title?: string;

  description?: string;

  children?: ReactNode;
}

export default function ExamListHeader({
  title = "Computer Based Tests",
  description = "Create, organize and manage examinations for your school.",
  children,
}: ExamListHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-background p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

        <p className="max-w-3xl text-muted-foreground">{description}</p>
      </div>

      {children && (
        <div className="flex flex-wrap items-center gap-3">{children}</div>
      )}
    </div>
  );
}
