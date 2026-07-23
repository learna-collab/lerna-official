"use client";

import { useEffect, useState } from "react";

import { Loader2, Plus, Trash2 } from "lucide-react";

import { toast } from "sonner";

import { CBTService } from "@/app/services/cbt.service";

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

interface Props {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  examId: string;

  question?: Question | null;

  onSaved: () => void;
}

export default function QuestionForm({
  open,
  onOpenChange,
  examId,
  question,
  onSaved,
}: Props) {
  const editing = !!question;

  const [loading, setLoading] = useState(false);

  const [questionText, setQuestionText] = useState("");

  const [marks, setMarks] = useState(1);

  const [orderNo, setOrderNo] = useState(1);

  const [correctIndex, setCorrectIndex] = useState("0");

  const [options, setOptions] = useState(["", "", "", ""]);

  useEffect(() => {
    if (!question) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuestionText("");

      setMarks(1);

      setOrderNo(1);

      setCorrectIndex("0");

      setOptions(["", "", "", ""]);

      return;
    }

    setQuestionText(question.question_text);

    setMarks(question.marks);

    setOrderNo(question.order_no);

    setOptions(question.options.map((option) => option.option_text));

    const correct = question.options.findIndex((option) => option.is_correct);

    setCorrectIndex(correct >= 0 ? correct.toString() : "0");
  }, [question, open]);
  function updateOption(index: number, value: string) {
    const copy = [...options];

    copy[index] = value;

    setOptions(copy);
  }

  function addOption() {
    setOptions((prev) => [...prev, ""]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) {
      toast.error("A question must have at least two options.");

      return;
    }

    setOptions(options.filter((_, i) => i !== index));
  }
  async function saveQuestion() {
    if (!questionText.trim()) {
      toast.error("Question text is required.");

      return;
    }

    if (options.some((option) => !option.trim())) {
      toast.error("All options are required.");

      return;
    }

    try {
      setLoading(true);

      const payload: CreateQuestionRequest = {
        question_text: questionText,

        marks,

        order_no: orderNo,

        options: options.map((option, index) => ({
          option_text: option,

          is_correct: index === Number(correctIndex),
        })),
      };

      if (editing) {
        await CBTService.updateQuestion(question!.id, payload);

        toast.success("Question updated.");
      } else {
        await CBTService.addQuestion(examId, payload);

        toast.success("Question added.");
      }

      onSaved();

      onOpenChange(false);
    } catch {
      toast.error("Unable to save question.");
    } finally {
      setLoading(false);
    }
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
            <Label>Question</Label>

            <Input
              value={questionText}
              placeholder="Enter your question..."
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          {/* ======================================= */}
          {/* Marks & Order */}
          {/* ======================================= */}

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Marks</Label>

              <Input
                type="number"
                min={1}
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Question Number</Label>

              <Input
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

          <div className="space-y-4">
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
                    value={index.toString()}
                    id={`correct-${index}`}
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
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </RadioGroup>

            <p className="text-xs text-muted-foreground">
              Select the radio button beside an option to mark it as the correct
              answer.
            </p>
          </div>

          {/* ======================================= */}
          {/* Footer */}
          {/* ======================================= */}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button disabled={loading} onClick={saveQuestion}>
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
