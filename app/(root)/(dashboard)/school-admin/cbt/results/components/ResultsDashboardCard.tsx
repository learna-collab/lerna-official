"use client";

import { Eye, FileText, GraduationCap, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import type { CBTResultsDashboardItem } from "@/app/types/cbt";

interface ResultsDashboardCardProps {
  exam: CBTResultsDashboardItem;

  onViewExam: (exam: CBTResultsDashboardItem) => void;
}

export default function ResultsDashboardCard({
  exam,
  onViewExam,
}: ResultsDashboardCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* Header */}

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-lg">{exam.title}</CardTitle>

            <p className="text-sm text-muted-foreground">{exam.subject_name}</p>
          </div>

          <Badge variant={exam.published ? "default" : "secondary"}>
            {exam.published ? "Published" : "Draft"}
          </Badge>
        </div>

        <Badge variant="outline" className="w-fit">
          {exam.class_name}
        </Badge>
      </CardHeader>

      {/* Body */}

      <CardContent className="space-y-5">
        {/* Attempts */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="h-4 w-4" />

            <span>Attempts</span>
          </div>

          <span className="font-semibold">{exam.attempts}</span>
        </div>

        {/* Average */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />

            <span>Average</span>
          </div>

          <div className="text-right">
            <p className="font-semibold">
              {exam.average_score}

              {" / "}

              {exam.total_marks}
            </p>

            <p className="text-xs text-muted-foreground">
              {exam.average_percentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Pass Rate */}

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Pass Rate</span>

          <Badge variant={exam.pass_rate >= 50 ? "default" : "destructive"}>
            {exam.pass_rate.toFixed(1)}%
          </Badge>
        </div>

        {/* Score Range */}

        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />

            <span className="font-medium">Score Range</span>
          </div>

          <div className="flex justify-between text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Highest</p>

              <p className="font-semibold text-green-600">
                {exam.highest_score}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">Lowest</p>

              <p className="font-semibold text-red-600">{exam.lowest_score}</p>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer */}

      <CardFooter>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => onViewExam(exam)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Results
        </Button>
      </CardFooter>
    </Card>
  );
}
