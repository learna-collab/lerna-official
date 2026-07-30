"use client";

import { CalendarDays, ChevronRight, Trophy } from "lucide-react";

import type { StudentHistoryItem } from "@/app/types/cbt";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PassFailBadge from "../../result/components/PassFailBadge";

interface HistoryCardProps {
  item: StudentHistoryItem;
  onViewResult: (attemptId: string) => void;
}

export default function HistoryCard({ item, onViewResult }: HistoryCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="space-y-5 p-6">
        {/* Header */}

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{item.exam_title}</h3>

            <p className="text-sm text-muted-foreground">{item.subject_name}</p>
          </div>

          <PassFailBadge
            passed={item.passed}
            percentage={item.percentage}
            showPercentage
          />
        </div>

        {/* Score */}

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4 text-center">
            <p className="text-xs text-muted-foreground">Score</p>

            <p className="mt-2 text-2xl font-bold">{item.score}</p>
          </div>

          <div className="rounded-lg border p-4 text-center">
            <p className="text-xs text-muted-foreground">Percentage</p>

            <p
              className={`mt-2 text-2xl font-bold ${
                item.passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {item.percentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Metadata */}

        <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-primary" />

            <span className="font-medium">Attempt ID:</span>

            <span className="truncate text-muted-foreground">
              {item.attempt_id}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4 text-primary" />

            <span className="font-medium">Completed:</span>

            <span className="text-muted-foreground">
              {item.completed_at
                ? new Date(item.completed_at).toLocaleString()
                : "-"}
            </span>
          </div>
        </div>

        {/* Action */}

        <Button
          className="w-full"
          onClick={() => onViewResult(item.attempt_id)}
        >
          View Result
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
