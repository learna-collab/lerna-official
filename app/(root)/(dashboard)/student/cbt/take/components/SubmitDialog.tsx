"use client";

import { Loader2, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SubmitDialogProps {
  open: boolean;
  answeredQuestions: number;
  totalQuestions: number;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export default function SubmitDialog({
  open,
  answeredQuestions,
  totalQuestions,
  submitting = false,
  onOpenChange,
  onSubmit,
}: SubmitDialogProps) {
  const unanswered = totalQuestions - answeredQuestions;
  const completed = unanswered === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit Examination</DialogTitle>

          <DialogDescription>
            Please review your progress before submitting your exam. Once
            submitted, you will not be able to make any changes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold">{totalQuestions}</p>

              <p className="text-xs text-muted-foreground">Total Questions</p>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center dark:border-green-900 dark:bg-green-950">
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                {answeredQuestions}
              </p>

              <p className="text-xs text-muted-foreground">Answered</p>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-900 dark:bg-amber-950">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                {unanswered}
              </p>

              <p className="text-xs text-muted-foreground">Unanswered</p>
            </div>
          </div>

          {!completed && (
            <Alert>
              <TriangleAlert className="h-4 w-4" />

              <AlertTitle>Some questions are unanswered</AlertTitle>

              <AlertDescription>
                You still have{" "}
                <strong>
                  {unanswered} {unanswered === 1 ? "question" : "questions"}
                </strong>{" "}
                without an answer. You can still submit, but those questions
                will be marked as unanswered.
              </AlertDescription>
            </Alert>
          )}

          {completed && (
            <Alert>
              <AlertTitle>Ready to submit</AlertTitle>

              <AlertDescription>
                Great! You have answered all questions. Click
                <strong> Submit Exam </strong>
                when you&apos;re ready.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            Continue Exam
          </Button>

          <Button onClick={onSubmit} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Exam
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
