"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { ExamAttemptStatus } from "@/app/types/cbt";

interface StatusBadgeProps {
  status: ExamAttemptStatus;
}

const statusConfig: Record<
  ExamAttemptStatus,
  {
    label: string;
    className: string;
    icon: React.ElementType;
  }
> = {
  NOT_STARTED: {
    label: "Not Started",
    className:
      "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-100",
    icon: Circle,
  },

  IN_PROGRESS: {
    label: "In Progress",
    className:
      "border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-100",
    icon: Loader2,
  },

  COMPLETED: {
    label: "Completed",
    className:
      "border-green-200 bg-green-100 text-green-700 hover:bg-green-100",
    icon: CheckCircle2,
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon
        className={`mr-1 h-3.5 w-3.5 ${
          status === "IN_PROGRESS" ? "animate-spin" : ""
        }`}
      />

      {config.label}
    </Badge>
  );
}
