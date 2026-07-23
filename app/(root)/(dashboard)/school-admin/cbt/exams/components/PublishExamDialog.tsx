"use client";

import { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Circle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PublishExamDialogProps {
  open: boolean;

  loading?: boolean;

  disabled?: boolean;

  title?: string;

  description?: string;

  children?: ReactNode;

  confirmText?: string;

  onOpenChange: (open: boolean) => void;

  onConfirm: () => void | Promise<void>;
}

export default function PublishExamDialog({
  open,
  loading = false,
  disabled = false,
  title = "Publish Examination",
  description = "This action will make the examination available to students.",
  children,
  confirmText = "Publish Examination",
  onOpenChange,
  onConfirm,
}: PublishExamDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>

            <div>
              <p className="text-lg font-semibold">{title}</p>

              <p className="text-sm font-normal text-muted-foreground">
                {description}
              </p>
            </div>
          </AlertDialogTitle>

          <AlertDialogDescription asChild>
            <div className="space-y-5 text-sm text-foreground">
              {children}

              <div className="space-y-3">
                <p className="font-medium">Before publishing, confirm that:</p>

                <div className="space-y-2">
                  {[
                    "All questions have been reviewed.",
                    "Correct answers are selected.",
                    "Marks are assigned correctly.",
                    "The examination schedule is accurate.",
                    "The examination is ready for students.",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Circle className="mt-1 h-3 w-3 fill-current text-primary" />

                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-700 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                Once published, eligible students will be able to access this
                item automatically when it becomes available.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={loading || disabled}
            onClick={(e) => {
              e.preventDefault();

              void onConfirm();
            }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {confirmText}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
