"use client";

import { Award, CheckCircle2, CircleX, Percent, Trophy } from "lucide-react";

import type { StudentResult } from "@/app/types/cbt";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ScoreCardProps {
  result: StudentResult;
}

export default function ScoreCard({ result }: ScoreCardProps) {
  const gradeColor = result.passed ? "text-green-600" : "text-red-600";

  return (
    <Card className="overflow-hidden shadow-sm">
      <div className={`h-2 ${result.passed ? "bg-green-600" : "bg-red-600"}`} />

      <CardContent className="space-y-8 p-8">
        {/* Score */}

        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div
            className={`rounded-full ${
              result.passed
                ? "bg-green-100 dark:bg-green-950"
                : "bg-red-100 dark:bg-red-950"
            } p-5`}
          >
            <Trophy className={`h-10 w-10 ${gradeColor}`} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Final Score</p>

            <h1 className={`text-6xl font-bold ${gradeColor}`}>
              {result.score}
            </h1>

            <p className="text-lg text-muted-foreground">
              out of {result.total_marks}
            </p>
          </div>

          <Badge
            variant={result.passed ? "default" : "destructive"}
            className="px-5 py-1 text-sm"
          >
            {result.passed ? "PASSED" : "FAILED"}
          </Badge>
        </div>

        {/* Percentage */}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Overall Percentage</span>

            <span className={`font-bold ${gradeColor}`}>
              {result.percentage.toFixed(1)}%
            </span>
          </div>

          <Progress value={result.percentage} className="h-3" />
        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />

              <div>
                <p className="text-xs text-muted-foreground">Correct</p>

                <p className="text-xl font-bold">{result.correct_answers}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <CircleX className="h-8 w-8 text-red-600" />

              <div>
                <p className="text-xs text-muted-foreground">Wrong</p>

                <p className="text-xl font-bold">{result.wrong_answers}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Award className="h-8 w-8 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">Answered</p>

                <p className="text-xl font-bold">{result.answered_questions}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Percent className="h-8 w-8 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">Accuracy</p>

                <p className="text-xl font-bold">
                  {result.answered_questions > 0
                    ? (
                        (result.correct_answers / result.answered_questions) *
                        100
                      ).toFixed(1)
                    : "0.0"}
                  %
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
