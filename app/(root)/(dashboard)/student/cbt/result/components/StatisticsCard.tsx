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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatisticsCardProps {
  result: StudentResult;
}

export default function StatisticsCard({ result }: StatisticsCardProps) {
  const unanswered = result.total_questions - result.answered_questions;

  const accuracy =
    result.answered_questions > 0
      ? (result.correct_answers / result.answered_questions) * 100
      : 0;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Performance Statistics</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Accuracy */}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />

              <span className="font-medium">Accuracy</span>
            </div>

            <span className="font-bold">{accuracy.toFixed(1)}%</span>
          </div>

          <Progress value={accuracy} className="h-3" />
        </div>

        {/* Overall Score */}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-primary" />

              <span className="font-medium">Overall Percentage</span>
            </div>

            <span className="font-bold">{result.percentage.toFixed(1)}%</span>
          </div>

          <Progress value={result.percentage} className="h-3" />
        </div>

        {/* Statistics Grid */}

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />

              <div>
                <p className="text-xs text-muted-foreground">Correct Answers</p>

                <p className="text-2xl font-bold">{result.correct_answers}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <CircleX className="h-8 w-8 text-red-600" />

              <div>
                <p className="text-xs text-muted-foreground">Wrong Answers</p>

                <p className="text-2xl font-bold">{result.wrong_answers}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <ClipboardCheck className="h-8 w-8 text-blue-600" />

              <div>
                <p className="text-xs text-muted-foreground">Answered</p>

                <p className="text-2xl font-bold">
                  {result.answered_questions}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <Award className="h-8 w-8 text-amber-600" />

              <div>
                <p className="text-xs text-muted-foreground">Unanswered</p>

                <p className="text-2xl font-bold">{unanswered}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}

        <div className="rounded-xl border bg-muted/40 p-5">
          <div className="flex items-center justify-between">
            <span className="font-medium">Questions Attempted</span>

            <span className="font-semibold">
              {result.answered_questions} / {result.total_questions}
            </span>
          </div>

          <div className="mt-4">
            <Progress
              value={(result.answered_questions / result.total_questions) * 100}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
