"use client";

import { ArrowUpRight, CalendarClock, ClipboardCheck } from "lucide-react";

import { Attempt } from "@/app/types/cbt";

import StudentAvatar from "./StudentAvatar";
import ScoreBadge from "./ScoreBadge";
import StatusBadge from "./StatusBadge";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

interface ResultCardProps {
  attempt: Attempt;
  onView: () => void;
}

function formatDate(date?: string | null) {
  if (!date) return "--";

  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ResultCard({ attempt, onView }: ResultCardProps) {
  console.log("attempt======================; ================", attempt);
  const studentName = attempt.student
    ? `${attempt.student.first_name} ${attempt.student.last_name}`
    : "Unknown Student";

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="space-y-5 p-5">
        {/* ====================================== */}
        {/* Student */}
        {/* ====================================== */}

        <div className="flex items-start gap-4">
          <StudentAvatar
            firstName={attempt.student?.first_name}
            lastName={attempt.student?.last_name}
            size="lg"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="truncate text-lg font-semibold">{studentName}</h3>

              <StatusBadge passed={attempt.is_passed} size="sm" />
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Admission No:{" "}
              {attempt.student?.admission_number ?? "Not Available"}
            </p>
          </div>
        </div>

        {/* ====================================== */}
        {/* Score */}
        {/* ====================================== */}

        <ScoreBadge
          score={attempt.score}
          percentage={attempt.percentage}
          totalMarks={attempt.exam?.total_marks}
        />

        {/* ====================================== */}
        {/* Details */}
        {/* ====================================== */}

        {/* ====================================== */}
        {/* Footer */}
        {/* ====================================== */}

        <div className="flex justify-end border-t pt-4">
          <Button variant="outline" onClick={onView}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            View Attempt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
