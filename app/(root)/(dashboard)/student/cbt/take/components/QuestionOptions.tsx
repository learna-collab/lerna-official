"use client";

import { CheckCircle2 } from "lucide-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import type { StudentQuestionOption } from "@/app/types/cbt";

interface QuestionOptionsProps {
  questionId: string;
  options: StudentQuestionOption[];
  selectedOptionId?: string;
  disabled?: boolean;
  onSelect: (questionId: string, optionId: string) => void;
}

export default function QuestionOptions({
  questionId,
  options,
  selectedOptionId,
  disabled = false,
  onSelect,
}: QuestionOptionsProps) {
  return (
    <RadioGroup
      value={selectedOptionId}
      onValueChange={(value) => onSelect(questionId, value)}
      disabled={disabled}
      className="space-y-4"
    >
      {options.map((option) => {
        const selected = selectedOptionId === option.id;

        return (
          <Label
            key={option.id}
            htmlFor={option.id}
            className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all ${
              disabled ? "cursor-not-allowed opacity-70" : "hover:bg-muted"
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
                <span className="font-semibold">{option.option_label}.</span>

                {selected && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </div>

              <p className="leading-6">{option.option_text}</p>
            </div>
          </Label>
        );
      })}
    </RadioGroup>
  );
}
