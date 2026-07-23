"use client";

import { CheckCircle2, Pencil, Trash2 } from "lucide-react";

import { Question } from "@/app/types/cbt";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface QuestionCardProps {
  question: Question;

  onEdit?: () => void;

  onDelete?: () => void;
}

export default function QuestionCard({
  question,
  onEdit,
  onDelete,
}: QuestionCardProps) {
  return (
    <Card className="transition-all duration-200 hover:border-primary/30 hover:shadow-md">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Question {question.order_no}</Badge>

            <Badge>
              {question.marks} Mark
              {question.marks > 1 ? "s" : ""}
            </Badge>

            <Badge variant="secondary">{question.options.length} Options</Badge>
          </div>

          <h3 className="text-lg font-semibold leading-7">
            {question.question_text}
          </h3>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex shrink-0 gap-2">
            {onEdit && (
              <Button size="icon" variant="outline" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}

            {onDelete && (
              <Button size="icon" variant="destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={option.id}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                option.is_correct
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "hover:bg-muted/40"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {String.fromCharCode(65 + index)}
                </div>

                <span className="break-words">{option.option_text}</span>
              </div>

              {option.is_correct && (
                <CheckCircle2 className="ml-3 h-5 w-5 shrink-0 text-green-600" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
