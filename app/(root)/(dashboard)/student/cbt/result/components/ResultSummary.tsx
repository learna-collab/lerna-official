"use client";

import {
  Award,
  CheckCircle2,
  CircleX,
  ClipboardCheck,
  Percent,
  Target,
} from "lucide-react";

import type { StudentResult } from "@/app/types/cbt";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResultSummaryProps {
  result: StudentResult;
}

export default function ResultSummary({ result }: ResultSummaryProps) {
  const completedAt = result.completed_at
    ? new Date(result.completed_at).toLocaleString()
    : "-";

  const startedAt = new Date(result.started_at).toLocaleString();

  return (
    <div className="space-y-6">
      {/* Header */}

      <Card className="overflow-hidden">
        <div
          className={`h-2 ${result.passed ? "bg-green-600" : "bg-red-600"}`}
        />

        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Badge
                variant={result.passed ? "default" : "destructive"}
                className="w-fit"
              >
                {result.passed ? "PASSED" : "FAILED"}
              </Badge>

              <h1 className="text-3xl font-bold">{result.exam_title}</h1>

              <p className="text-muted-foreground">{result.subject_name}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Final Score</p>

              <h2
                className={`text-5xl font-bold ${
                  result.passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.score}
              </h2>

              <p className="text-muted-foreground">/ {result.total_marks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <Percent className="h-6 w-6 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Percentage</p>

              <p className="text-2xl font-bold">
                {result.percentage.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-950">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Correct</p>

              <p className="text-2xl font-bold">{result.correct_answers}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-red-100 p-3 dark:bg-red-950">
              <CircleX className="h-6 w-6 text-red-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Wrong</p>

              <p className="text-2xl font-bold">{result.wrong_answers}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-950">
              <ClipboardCheck className="h-6 w-6 text-amber-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Answered</p>

              <p className="text-2xl font-bold">
                {result.answered_questions}/{result.total_questions}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details */}

      <Card>
        <CardContent className="grid gap-6 p-6 md:grid-cols-2">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">Total Marks</p>

                <p className="font-semibold">
                  {result.score} / {result.total_marks}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />

              <div>
                <p className="text-sm text-muted-foreground">Questions</p>

                <p className="font-semibold">{result.total_questions}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-muted-foreground">Started</p>

              <p className="font-medium">{startedAt}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Completed</p>

              <p className="font-medium">{completedAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
