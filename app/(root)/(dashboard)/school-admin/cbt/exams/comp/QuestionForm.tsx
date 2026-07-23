"use client";

import { useEffect, useMemo, useState } from "react";

import { Loader2, Plus, Trash2 } from "lucide-react";

import { CreateQuestionRequest, Question } from "@/app/types/cbt";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuestionFormProps {
  open: boolean;

  loading?: boolean;

  question?: Question | null;
  onValidationError?: (message: string) => void;

  onOpenChange: (open: boolean) => void;

  onSubmit: (data: CreateQuestionRequest) => void | Promise<void>;
}

export default function QuestionForm({
  open,
  loading = false,
  question,
  onOpenChange,
  onSubmit,
  onValidationError,
}: QuestionFormProps) {
  const editing = useMemo(() => !!question, [question]);

  const [questionText, setQuestionText] = useState("");

  const [marks, setMarks] = useState(1);

  const [orderNo, setOrderNo] = useState(1);

  const [correctIndex, setCorrectIndex] = useState("0");

  const [options, setOptions] = useState<string[]>(["", "", "", ""]);

  const resetForm = () => {
    setQuestionText("");

    setMarks(1);

    setOrderNo(1);

    setCorrectIndex("0");

    setOptions(["", "", "", ""]);
  };

  useEffect(() => {
    if (!open) return;

    if (!question) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetForm();

      return;
    }

    setQuestionText(question.question_text);

    setMarks(question.marks);

    setOrderNo(question.order_no);

    setOptions(question.options.map((option) => option.option_text));

    const correct = question.options.findIndex((option) => option.is_correct);

    setCorrectIndex(correct >= 0 ? correct.toString() : "0");
  }, [open, question]);
  function updateOption(index: number, value: string) {
    setOptions((prev) =>
      prev.map((option, i) => (i === index ? value : option)),
    );
  }

  function addOption() {
    setOptions((prev) => [...prev, ""]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) {
      return;
    }

    const nextOptions = options.filter((_, i) => i !== index);

    setOptions(nextOptions);

    const selected = Number(correctIndex);

    if (selected === index) {
      setCorrectIndex("0");

      return;
    }

    if (selected > index) {
      setCorrectIndex(String(selected - 1));
    }
  }

  type ValidationResult =
    | {
        valid: true;
      }
    | {
        valid: false;
        message: string;
      };

  function validateForm(): ValidationResult {
    if (!questionText.trim()) {
      return {
        valid: false,
        message: "Question text is required.",
      };
    }

    if (marks < 1) {
      return {
        valid: false,
        message: "Marks must be at least 1.",
      };
    }

    if (orderNo < 1) {
      return {
        valid: false,
        message: "Question number must be at least 1.",
      };
    }

    if (options.length < 2) {
      return {
        valid: false,
        message: "A question must have at least two options.",
      };
    }

    if (options.some((option) => !option.trim())) {
      return {
        valid: false,
        message: "All answer options are required.",
      };
    }

    const selected = Number(correctIndex);

    if (Number.isNaN(selected) || selected < 0 || selected >= options.length) {
      return {
        valid: false,
        message: "Please select the correct answer.",
      };
    }

    return {
      valid: true,
    };
  }

  function buildPayload(): CreateQuestionRequest {
    return {
      question_text: questionText.trim(),

      marks,

      order_no: orderNo,

      options: options.map((option, index) => ({
        option_text: option.trim(),

        is_correct: index === Number(correctIndex),
      })),
    };
  }

  async function handleSubmit() {
    const validation = validateForm();

    if (!validation.valid) {
      onValidationError?.(validation.message);
      return;
    }

    await onSubmit(buildPayload());
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Question" : "Add Question"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* ======================================= */}
          {/* Question */}
          {/* ======================================= */}

          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>

            <Input
              id="question"
              placeholder="Enter the examination question..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          {/* ======================================= */}
          {/* Marks & Order */}
          {/* ======================================= */}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="marks">Marks</Label>

              <Input
                id="marks"
                type="number"
                min={1}
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Question Number</Label>

              <Input
                id="order"
                type="number"
                min={1}
                value={orderNo}
                onChange={(e) => setOrderNo(Number(e.target.value))}
              />
            </div>
          </div>

          {/* ======================================= */}
          {/* Options */}
          {/* ======================================= */}

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Label>Answer Options</Label>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addOption}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>

            <RadioGroup
              value={correctIndex}
              onValueChange={setCorrectIndex}
              className="space-y-4"
            >
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border p-4"
                >
                  <RadioGroupItem
                    id={`option-${index}`}
                    value={index.toString()}
                  />

                  <Input
                    className="flex-1"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={options.length <= 2}
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </RadioGroup>

            <p className="text-xs text-muted-foreground">
              Select the radio button beside the correct answer.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button disabled={loading} onClick={() => void handleSubmit()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editing ? (
                "Update Question"
              ) : (
                "Save Question"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
