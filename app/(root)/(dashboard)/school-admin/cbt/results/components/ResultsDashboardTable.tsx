"use client";

import { Eye, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import type { CBTResultsDashboardItem } from "@/app/types/cbt";

interface ResultsDashboardTableProps {
  results: CBTResultsDashboardItem[];

  onViewExam: (exam: CBTResultsDashboardItem) => void;
}

export default function ResultsDashboardTable({
  results,
  onViewExam,
}: ResultsDashboardTableProps) {
  if (!results.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <GraduationCap className="mb-5 h-14 w-14 text-muted-foreground" />

          <h3 className="text-xl font-semibold">No Results Found</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            No examination results available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Examination</TableHead>

            <TableHead>Class</TableHead>

            <TableHead>Subject</TableHead>

            <TableHead>Attempts</TableHead>

            <TableHead>Average</TableHead>

            <TableHead>Pass Rate</TableHead>

            <TableHead>Highest</TableHead>

            <TableHead>Lowest</TableHead>

            <TableHead>Status</TableHead>

            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {results.map((exam) => (
            <TableRow key={exam.exam_id}>
              <TableCell>
                <div>
                  <p className="font-semibold">{exam.title}</p>
                </div>
              </TableCell>

              <TableCell>{exam.class_name}</TableCell>

              <TableCell>{exam.subject_name}</TableCell>

              <TableCell>
                <Badge variant="outline">{exam.attempts}</Badge>
              </TableCell>

              <TableCell>
                <span className="font-semibold">
                  {exam.average_percentage.toFixed(1)}%
                </span>
              </TableCell>

              <TableCell>
                <Badge
                  variant={exam.pass_rate >= 50 ? "default" : "destructive"}
                >
                  {exam.pass_rate.toFixed(1)}%
                </Badge>
              </TableCell>

              <TableCell>
                {exam.highest_score}

                {" / "}

                {exam.total_marks}
              </TableCell>

              <TableCell>
                {exam.lowest_score}

                {" / "}

                {exam.total_marks}
              </TableCell>

              <TableCell>
                <Badge variant={exam.published ? "default" : "secondary"}>
                  {exam.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewExam(exam)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Results
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
