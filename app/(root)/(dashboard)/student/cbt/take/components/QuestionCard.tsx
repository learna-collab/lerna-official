"use client";

import { CheckCircle2 } from "lucide-react";

import type { StudentQuestion, StudentQuestionOption } from "@/app/types/cbt";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuestionCardProps {
  question: StudentQuestion;
  questionNumber: number;
  selectedOptionId?: string;
  onSelectOption: (questionId: string, optionId: string) => void;
  disabled?: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  selectedOptionId,
  onSelectOption,
  disabled = false,
}: QuestionCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-6 p-6">
        {/* Header */}

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">
              Question {questionNumber}
            </p>

            <h2 className="text-lg font-semibold leading-7">
              {question.question_text}
            </h2>
          </div>

          <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            {question.marks} {question.marks === 1 ? "Mark" : "Marks"}
          </div>
        </div>

        {/* Options */}

        <RadioGroup
          value={selectedOptionId}
          onValueChange={(value) => onSelectOption(question.id, value)}
          disabled={disabled}
          className="space-y-4"
        >
          {question.options.map((option: StudentQuestionOption) => {
            const selected = selectedOptionId === option.id;

            return (
              <Label
                key={option.id}
                htmlFor={option.id}
                className={`flex items-start gap-4 rounded-xl border p-4 transition-all ${
                  disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:bg-muted"
                } ${selected ? "border-primary bg-primary/5" : ""}`}
              >
                <RadioGroupItem
                  id={option.id}
                  value={option.id}
                  disabled={disabled}
                  className="mt-1"
                />

                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold">
                      {option.option_label}.
                    </span>

                    {selected && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>

                  <p className="leading-6">{option.option_text}</p>
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
