"use client";

import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { TableCell, TableRow } from "@/components/ui/table";

import type { CBTResultsDashboardItem } from "@/app/types/cbt";

interface ResultsDashboardRowProps {
  exam: CBTResultsDashboardItem;

  onViewExam: (exam: CBTResultsDashboardItem) => void;
}

export default function ResultsDashboardRow({
  exam,
  onViewExam,
}: ResultsDashboardRowProps) {
  return (
    <TableRow>
      {/* Examination */}

      <TableCell>
        <div className="space-y-1">
          <p className="font-semibold">{exam.title}</p>

          <p className="text-xs text-muted-foreground">
            {new Date(exam.starts_at).toLocaleDateString()}
          </p>
        </div>
      </TableCell>

      {/* Class */}

      <TableCell>
        <Badge variant="outline">{exam.class_name}</Badge>
      </TableCell>

      {/* Subject */}

      <TableCell>{exam.subject_name}</TableCell>

      {/* Attempts */}

      <TableCell>
        <span className="font-medium">{exam.attempts}</span>
      </TableCell>

      {/* Average Score */}

      <TableCell>
        <div className="space-y-1">
          <p className="font-semibold">
            {exam.average_score}

            {" / "}

            {exam.total_marks}
          </p>

          <p className="text-xs text-muted-foreground">
            {exam.average_percentage.toFixed(1)}%
          </p>
        </div>
      </TableCell>

      {/* Pass Rate */}

      <TableCell>
        <Badge variant={exam.pass_rate >= 50 ? "default" : "destructive"}>
          {exam.pass_rate.toFixed(1)}%
        </Badge>
      </TableCell>

      {/* Highest Score */}

      <TableCell>
        <span className="text-green-600 font-medium">{exam.highest_score}</span>
      </TableCell>

      {/* Lowest Score */}

      <TableCell>
        <span className="text-red-600 font-medium">{exam.lowest_score}</span>
      </TableCell>

      {/* Status */}

      <TableCell>
        <Badge variant={exam.published ? "default" : "secondary"}>
          {exam.published ? "Published" : "Draft"}
        </Badge>
      </TableCell>

      {/* Action */}

      <TableCell className="text-right">
        <Button size="sm" variant="outline" onClick={() => onViewExam(exam)}>
          <Eye className="mr-2 h-4 w-4" />
          View Results
        </Button>
      </TableCell>
    </TableRow>
  );
}
