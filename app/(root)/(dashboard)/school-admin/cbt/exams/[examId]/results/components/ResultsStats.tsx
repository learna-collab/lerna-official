"use client";

import { CheckCircle2, Trophy, Users, XCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface ResultsStatsProps {
  totalAttempts: number;
  passed: number;
  failed: number;
  averagePercentage: number;
}

export default function ResultsStats({
  totalAttempts,
  passed,
  failed,
  averagePercentage,
}: ResultsStatsProps) {
  const passRate = totalAttempts === 0 ? 0 : (passed / totalAttempts) * 100;

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {/* ====================================== */}
      {/* Total Attempts */}
      {/* ====================================== */}

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Attempts</p>

            <h2 className="mt-2 text-3xl font-bold">{totalAttempts}</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Students who submitted
            </p>
          </div>

          <Users className="h-10 w-10 text-primary" />
        </CardContent>
      </Card>

      {/* ====================================== */}
      {/* Passed */}
      {/* ====================================== */}

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Passed</p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">{passed}</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {passRate.toFixed(1)}% pass rate
            </p>
          </div>

          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </CardContent>
      </Card>

      {/* ====================================== */}
      {/* Failed */}
      {/* ====================================== */}

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Failed</p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">{failed}</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {(100 - passRate).toFixed(1)}% failure rate
            </p>
          </div>

          <XCircle className="h-10 w-10 text-red-600" />
        </CardContent>
      </Card>

      {/* ====================================== */}
      {/* Average */}
      {/* ====================================== */}

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Class Average</p>

            <h2 className="mt-2 text-3xl font-bold">
              {averagePercentage.toFixed(1)}%
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Average examination score
            </p>
          </div>

          <Trophy className="h-10 w-10 text-amber-500" />
        </CardContent>
      </Card>
    </div>
  );
}
