"use client";

import { ArrowUpRight, CalendarClock, ClipboardCheck } from "lucide-react";

import { Attempt } from "@/app/types/cbt";

import StudentAvatar from "./StudentAvatar";
import StatusBadge from "./StatusBadge";
import ScoreBadge from "./ScoreBadge";

import { Button } from "@/components/ui/button";

import { TableCell, TableRow } from "@/components/ui/table";

interface ResultsTableRowProps {
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

export default function ResultsTableRow({
  attempt,
  onView,
}: ResultsTableRowProps) {
  const studentName = attempt.student
    ? `${attempt.student.first_name} ${attempt.student.last_name}`
    : "Unknown Student";

  return (
    <TableRow className="hover:bg-muted/40 transition-colors">
      {/* ===================================== */}
      {/* Student */}
      {/* ===================================== */}

      <TableCell>
        <div className="flex items-center gap-3">
          <StudentAvatar
            firstName={attempt.student?.first_name}
            lastName={attempt.student?.last_name}
          />

          <div className="space-y-1">
            <h4 className="font-medium leading-none">{studentName}</h4>

            <p className="text-sm text-muted-foreground">
              {attempt.student?.admission_number ?? "No Admission Number"}
            </p>
          </div>
        </div>
      </TableCell>

      {/* ===================================== */}
      {/* Answered Questions */}
      {/* ===================================== */}

      {/* ===================================== */}
      {/* Score */}
      {/* ===================================== */}

      <TableCell className="min-w-55">
        <ScoreBadge
          score={attempt.score}
          percentage={attempt.percentage}
          totalMarks={attempt.exam?.total_marks}
          size="sm"
        />
      </TableCell>

      {/* ===================================== */}
      {/* Status */}
      {/* ===================================== */}

      <TableCell>
        <StatusBadge passed={attempt.is_passed} size="sm" />
      </TableCell>

      {/* ===================================== */}
      {/* Submitted */}
      {/* ===================================== */}

      <TableCell>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarClock className="h-4 w-4" />

          <span className="text-sm">{formatDate(attempt.submitted_at)}</span>
        </div>
      </TableCell>

      {/* ===================================== */}
      {/* Action */}
      {/* ===================================== */}

      <TableCell className="text-right">
        <Button variant="outline" size="sm" onClick={onView}>
          <ArrowUpRight className="mr-2 h-4 w-4" />
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}
