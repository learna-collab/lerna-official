"use client";

import { CheckCircle2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  passed: boolean;
  size?: "sm" | "md";
}

export default function StatusBadge({ passed, size = "md" }: StatusBadgeProps) {
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 border font-medium ${
        passed
          ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-50"
          : "border-red-200 bg-red-50 text-red-700 hover:bg-red-50"
      }`}
    >
      {passed ? (
        <>
          <CheckCircle2 className={iconSize} />
          Passed
        </>
      ) : (
        <>
          <XCircle className={iconSize} />
          Failed
        </>
      )}
    </Badge>
  );
}
