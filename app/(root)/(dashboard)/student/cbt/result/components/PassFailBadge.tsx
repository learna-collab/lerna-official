"use client";

import { CheckCircle2, CircleX } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface PassFailBadgeProps {
  passed: boolean;
  percentage?: number;
  showPercentage?: boolean;
  className?: string;
}

export default function PassFailBadge({
  passed,
  percentage,
  showPercentage = false,
  className,
}: PassFailBadgeProps) {
  return (
    <Badge
      variant={passed ? "default" : "destructive"}
      className={`flex w-fit items-center gap-2 px-4 py-2 text-sm font-semibold ${className ?? ""}`}
    >
      {passed ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          PASSED
        </>
      ) : (
        <>
          <CircleX className="h-4 w-4" />
          FAILED
        </>
      )}

      {showPercentage && percentage !== undefined && (
        <span className="ml-1 border-l border-current/30 pl-2">
          {percentage.toFixed(1)}%
        </span>
      )}
    </Badge>
  );
}
