"use client";

import { CheckCircle2 } from "lucide-react";

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export default function ProgressBar({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
}: ProgressBarProps) {
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="space-y-4 rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-semibold">Exam Progress</h3>

          <p className="text-sm text-muted-foreground">
            Question {currentQuestion} of {totalQuestions}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />

          <span className="text-sm font-semibold">
            {answeredQuestions} / {totalQuestions} Answered
          </span>
        </div>
      </div>

      <Progress value={progress} />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{Math.round(progress)}% Complete</span>

        <span>{totalQuestions - answeredQuestions} Remaining</span>
      </div>
    </div>
  );
}
