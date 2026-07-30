"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: number[];
  onSelectQuestion: (index: number) => void;
}

export default function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onSelectQuestion,
}: QuestionNavigatorProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Question Navigator</CardTitle>

        <p className="text-sm text-muted-foreground">
          {answeredQuestions.length} of {totalQuestions} answered
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const answered = answeredQuestions.includes(index);
            const active = currentQuestion === index;

            return (
              <Button
                key={index}
                variant={
                  active ? "default" : answered ? "secondary" : "outline"
                }
                size="icon"
                className={`h-10 w-10 ${
                  answered && !active
                    ? "border-green-500 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950 dark:text-green-300"
                    : ""
                }`}
                onClick={() => onSelectQuestion(index)}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>

        <div className="space-y-2 rounded-lg border bg-muted/40 p-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-primary" />
            <span>Current Question</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-green-500" />
            <span>Answered</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded border bg-background" />
            <span>Not Answered</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
