"use client";

import { ReactNode } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

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

interface DeleteExamDialogProps {
  open: boolean;

  loading?: boolean;

  title?: string;

  description?: string;

  children?: ReactNode;

  confirmText?: string;

  onOpenChange: (open: boolean) => void;

  onConfirm: () => void | Promise<void>;
}

export default function DeleteExamDialog({
  open,
  loading = false,
  title = "Delete Examination",
  description = "This action permanently removes this examination.",
  children,
  confirmText = "Delete Examination",
  onOpenChange,
  onConfirm,
}: DeleteExamDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
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

              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="font-medium text-destructive">
                  This action cannot be undone.
                </p>

                <p className="mt-2 text-muted-foreground">
                  Deleting this examination will permanently remove the exam,
                  all questions, answer options, student attempts, and results
                  associated with it.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();

              void onConfirm();
            }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                {confirmText}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
