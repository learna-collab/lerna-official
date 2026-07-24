"use client";

import { Trophy } from "lucide-react";

import { Progress } from "@/components/ui/progress";

interface ScoreBadgeProps {
  score: number;
  percentage?: number;
  totalMarks?: number;
  size?: "sm" | "md";
}

export default function ScoreBadge({
  score,
  percentage,
  totalMarks,
  size = "md",
}: ScoreBadgeProps) {
  const value = Math.max(0, Math.min(100, percentage ?? 0));

  const progressColor =
    value >= 70 ? "bg-green-600" : value >= 50 ? "bg-amber-500" : "bg-red-600";

  const scoreSize = size === "sm" ? "text-base" : "text-xl";

  return (
    <div className="min-w-35 space-y-2">
      {/* Score */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />

          <span className={`font-semibold ${scoreSize}`}>
            {score}
            {typeof totalMarks === "number" && (
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                / {totalMarks}
              </span>
            )}
          </span>
        </div>

        <span className="text-sm font-medium text-muted-foreground">
          {value.toFixed(1)}%
        </span>
      </div>

      {/* Progress */}

      <div className="relative">
        <Progress value={value} className="h-2" />

        <div
          className={`absolute left-0 top-0 h-2 rounded-full transition-all ${progressColor}`}
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}
